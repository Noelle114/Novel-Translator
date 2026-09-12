import { normalizeProviderError } from '@mtn/domain'
import {
  type ITranslationProviderAdapter,
  type KeyValidationResult,
  type ModelInfo,
  type TranslationRequest,
  type TranslationResponse,
  fetchJsonWithTimeout
} from './interfaces.js'

export class GeminiAdapter implements ITranslationProviderAdapter {
  readonly id = 'gemini' as const

  async getModels(apiKey: string): Promise<ModelInfo[]> {
    const { status, json } = await fetchJsonWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
      { method: 'GET' },
      15000
    )

    if (status >= 400) {
      throw Object.assign(new Error(json?.error?.message ?? 'Failed to list Gemini models'), { status, code: json?.error?.status })
    }

    const models = Array.isArray(json?.models) ? json.models : []
    return models
      .filter((model: any) => typeof model?.name === 'string')
      .map((model: any) => {
        const id = String(model.name).replace('models/', '')
        return { id, name: id }
      })
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const promptParts: string[] = [
      'You are a professional literary translator.',
      `Translate to ${request.targetLanguage} with natural and consistent novel style.`,
      'Do not provide commentary.',
      ''
    ]

    if (request.glossaryLines.length > 0) {
      promptParts.push('Glossary rules:')
      promptParts.push(...request.glossaryLines)
      promptParts.push('')
    }

    if (request.contextParagraphs.length > 0) {
      promptParts.push('Context paragraphs:')
      promptParts.push(...request.contextParagraphs)
      promptParts.push('')
    }

    promptParts.push('Translate this paragraph:')
    promptParts.push(request.sourceText)

    const { status, json } = await fetchJsonWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(request.modelId)}:generateContent?key=${encodeURIComponent(request.apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          generationConfig: {
            temperature: request.temperature ?? 0.2
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: promptParts.join('\n') }]
            }
          ]
        })
      },
      request.timeoutMs
    )

    if (status >= 400) {
      throw Object.assign(new Error(json?.error?.message ?? 'Gemini translation failed'), { status, code: json?.error?.status })
    }

    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text || typeof text !== 'string') {
      throw new Error('Gemini returned malformed response')
    }

    return {
      translatedText: text.trim(),
      raw: json
    }
  }

  async validateKey(apiKey: string): Promise<KeyValidationResult> {
    try {
      await this.getModels(apiKey)
      return { valid: true, message: 'Gemini key is valid' }
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

