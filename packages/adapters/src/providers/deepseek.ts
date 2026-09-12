import { normalizeProviderError } from '@mtn/domain'
import {
  type ITranslationProviderAdapter,
  type KeyValidationResult,
  type ModelInfo,
  type TranslationRequest,
  type TranslationResponse,
  fetchJsonWithTimeout
} from './interfaces.js'

const BASE_URL = 'https://api.deepseek.com'

export class DeepSeekAdapter implements ITranslationProviderAdapter {
  readonly id = 'deepseek' as const

  async getModels(apiKey: string): Promise<ModelInfo[]> {
    try {
      const { status, json } = await fetchJsonWithTimeout(
        `${BASE_URL}/models`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${apiKey}` }
        },
        15000
      )

      if (status >= 400) {
        throw new Error(json?.error?.message ?? 'Failed to list DeepSeek models')
      }

      const data = Array.isArray(json?.data) ? json.data : []
      if (data.length > 0) {
        return data
          .filter((m: any) => typeof m.id === 'string')
          .map((m: any) => ({ id: m.id as string, name: m.id as string }))
      }
    } catch {
      // API erişilemezse statik listeye düş
    }

    // Bilinen güncel DeepSeek modelleri
    return [
      { id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro' },
      { id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash' }
    ]
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const systemLines = [
      'You are a professional literary translator.',
      `Translate the following text to ${request.targetLanguage} with natural, consistent novel style.`,
      'Return only the translated text — no explanations or commentary.'
    ]

    if (request.glossaryLines.length > 0) {
      systemLines.push('Glossary rules (follow strictly):')
      systemLines.push(...request.glossaryLines)
    }

    const userParts: string[] = []
    if (request.contextParagraphs.length > 0) {
      userParts.push('Context (for tone/consistency only, do not translate):')
      userParts.push(...request.contextParagraphs.map((p, i) => `${i + 1}. ${p}`))
      userParts.push('---')
    }
    userParts.push('Translate this paragraph:')
    userParts.push(request.sourceText)

    const body: Record<string, unknown> = {
      model: request.modelId,
      messages: [
        { role: 'system', content: systemLines.join('\n') },
        { role: 'user', content: userParts.join('\n') }
      ]
    }

    // deepseek-reasoner temperature parametresini desteklemiyor
    if (request.modelId !== 'deepseek-reasoner' && request.temperature !== undefined) {
      body.temperature = request.temperature
    }

    const { status, json } = await fetchJsonWithTimeout(
      `${BASE_URL}/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${request.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      },
      request.timeoutMs
    )

    if (status >= 400) {
      throw Object.assign(
        new Error(json?.error?.message ?? 'DeepSeek translation failed'),
        { status, code: json?.error?.code }
      )
    }

    const text = json?.choices?.[0]?.message?.content
    if (!text || typeof text !== 'string') {
      throw new Error('DeepSeek returned malformed response')
    }

    return { translatedText: text.trim(), raw: json }
  }

  async validateKey(apiKey: string): Promise<KeyValidationResult> {
    try {
      await this.getModels(apiKey)
      return { valid: true, message: 'DeepSeek key is valid' }
    } catch (error) {
      return { valid: false, message: this.normalizeError(error).normalizedMessage }
    }
  }

  normalizeError(error: unknown, modelId?: string) {
    const anyErr = error as any
    return normalizeProviderError({
      providerId: this.id,
      modelId,
      status: typeof anyErr?.status === 'number' ? anyErr.status : undefined,
      code: typeof anyErr?.code === 'string' ? anyErr.code : undefined,
      message: anyErr?.message ?? String(anyErr)
    })
  }
}
