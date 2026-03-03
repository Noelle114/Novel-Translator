import { normalizeProviderError } from '@mtn/domain'
import {
  type ITranslationProviderAdapter,
  type KeyValidationResult,
  type ModelInfo,
  type TranslationRequest,
  type TranslationResponse,
  fetchJsonWithTimeout
} from './interfaces.js'

export class OpenAIAdapter implements ITranslationProviderAdapter {
  readonly id = 'openai' as const

  async getModels(apiKey: string): Promise<ModelInfo[]> {
    const { status, json } = await fetchJsonWithTimeout(
      'https://api.openai.com/v1/models',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      },
      15000
    )

    if (status >= 400) {
      throw new Error(json?.error?.message ?? 'Failed to list OpenAI models')
    }

    const data = Array.isArray(json.data) ? json.data : []
    return data
      .filter((model: any) => typeof model.id === 'string')
      .slice(0, 100)
      .map((model: any) => ({ id: model.id, name: model.id }))
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const system = [
      'You are a professional literary translator.',
      'Translate from English to Turkish with natural and consistent novel style.',
      'Do not add explanations.'
    ]

    if (request.glossaryLines.length > 0) {
      system.push('Glossary rules:')
      system.push(...request.glossaryLines)
    }

    const userParts: string[] = []
    if (request.contextParagraphs.length > 0) {
      userParts.push('Context paragraphs (for tone/consistency only):')
      userParts.push(...request.contextParagraphs.map((line, index) => `${index + 1}. ${line}`))
      userParts.push('---')
    }
    userParts.push('Translate this paragraph:')
    userParts.push(request.sourceText)

    const { status, json } = await fetchJsonWithTimeout(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${request.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: request.modelId,
          temperature: request.temperature,
          messages: [
            {
              role: 'system',
              content: system.join('\n')
            },
            {
              role: 'user',
              content: userParts.join('\n')
            }
          ]
        })
      },
      request.timeoutMs
    )

    if (status >= 400) {
      throw Object.assign(new Error(json?.error?.message ?? 'OpenAI translation failed'), { status, code: json?.error?.code })
    }

    const text = json?.choices?.[0]?.message?.content
    if (!text || typeof text !== 'string') {
      throw new Error('OpenAI returned malformed response')
    }

    return {
      translatedText: text.trim(),
      raw: json
    }
  }

  async validateKey(apiKey: string): Promise<KeyValidationResult> {
    try {
      await this.getModels(apiKey)
      return { valid: true, message: 'OpenAI key is valid' }
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

