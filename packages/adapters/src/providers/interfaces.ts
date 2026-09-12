import { normalizeProviderError } from '@mtn/domain'
import type { ProviderId } from '@mtn/shared'

export type ModelInfo = {
  id: string
  name: string
}

export type TranslationRequest = {
  providerId: ProviderId
  modelId: string
  sourceText: string
  targetLanguage: string
  contextParagraphs: string[]
  glossaryLines: string[]
  apiKey: string
  timeoutMs: number
  temperature?: number
}

export type TranslationResponse = {
  translatedText: string
  raw: unknown
}

export type KeyValidationResult = {
  valid: boolean
  message: string
}

export type NormalizedProviderError = ReturnType<typeof normalizeProviderError>

export interface ITranslationProviderAdapter {
  id: ProviderId
  getModels(apiKey: string): Promise<ModelInfo[]>
  translate(request: TranslationRequest): Promise<TranslationResponse>
  validateKey(apiKey: string): Promise<KeyValidationResult>
  normalizeError(error: unknown, modelId?: string): NormalizedProviderError
}

export async function fetchJsonWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<{ status: number; json: any }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal
    })

    const text = await response.text()
    let parsed: any
    try {
      parsed = text ? JSON.parse(text) : {}
    } catch {
      parsed = { raw: text }
    }

    return { status: response.status, json: parsed }
  } catch (error) {
    if (error instanceof Error && (error.name === 'AbortError' || /abort/i.test(error.message))) {
      throw Object.assign(new Error(`Request timed out after ${timeoutMs}ms`), {
        status: 408,
        code: 'ETIMEDOUT'
      })
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

