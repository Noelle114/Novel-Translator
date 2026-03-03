import { normalizeProviderError } from '@mtn/domain'
import {
  type ITranslationProviderAdapter,
  type KeyValidationResult,
  type ModelInfo,
  type TranslationRequest,
  type TranslationResponse,
  fetchJsonWithTimeout
} from './interfaces.js'

export class DeepLAdapter implements ITranslationProviderAdapter {
  readonly id = 'deepl' as const

  async getModels(_apiKey: string): Promise<ModelInfo[]> {
    return [
      { id: 'deepl-default', name: 'DeepL Default' }
    ]
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const context = request.contextParagraphs.length > 0
      ? `Context:\n${request.contextParagraphs.join('\n')}\n\n`
      : ''

    const glossary = request.glossaryLines.length > 0
      ? `Glossary rules:\n${request.glossaryLines.join('\n')}\n\n`
      : ''

    const text = `${context}${glossary}${request.sourceText}`
    const body = new URLSearchParams({
      text,
      source_lang: 'EN',
      target_lang: 'TR'
    })

    const { status, json } = await fetchJsonWithTimeout(
      'https://api-free.deepl.com/v2/translate',
      {
        method: 'POST',
        headers: {
          Authorization: `DeepL-Auth-Key ${request.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      },
      request.timeoutMs
    )

    if (status >= 400) {
      throw Object.assign(new Error(json?.message ?? 'DeepL translation failed'), { status, code: json?.code })
    }

    const translatedText = json?.translations?.[0]?.text
    if (!translatedText || typeof translatedText !== 'string') {
      throw new Error('DeepL returned malformed response')
    }

    return {
      translatedText: translatedText.trim(),
      raw: json
    }
  }

  async validateKey(apiKey: string): Promise<KeyValidationResult> {
    try {
      const { status } = await fetchJsonWithTimeout(
        'https://api-free.deepl.com/v2/usage',
        {
          method: 'GET',
          headers: {
            Authorization: `DeepL-Auth-Key ${apiKey}`
          }
        },
        15000
      )
      return {
        valid: status < 400,
        message: status < 400 ? 'DeepL key is valid' : 'DeepL key is invalid'
      }
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

