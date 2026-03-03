import { ErrorTypeSchema, type ProviderId } from '@mtn/shared'

type NormalizeInput = {
  providerId?: ProviderId
  modelId?: string
  status?: number
  message?: string
  code?: string
}

export function normalizeProviderError(input: NormalizeInput) {
  const message = input.message ?? 'Unknown provider error'
  const status = input.status

  let errorType: import('zod').infer<typeof ErrorTypeSchema> = 'unknown'
  let probableCause: string | null = null

  if (status === 401 || /invalid key|unauthorized/i.test(message)) {
    errorType = 'invalid_api_key'
    probableCause = 'API key is missing, invalid, or revoked.'
  } else if (status === 429 || /rate limit/i.test(message)) {
    errorType = 'rate_limit'
    probableCause = 'Provider rate limit reached.'
  } else if (status === 402 || /quota/i.test(message)) {
    errorType = 'quota_exceeded'
    probableCause = 'Provider quota appears to be exhausted.'
  } else if (status === 408 || /timeout/i.test(message)) {
    errorType = 'timeout'
    probableCause = 'Provider response timed out.'
  } else if (status && status >= 500) {
    errorType = 'provider_unavailable'
    probableCause = 'Provider is currently unavailable.'
  } else if (/malformed|parse|invalid response/i.test(message)) {
    errorType = 'malformed_response'
    probableCause = 'Provider response could not be parsed.'
  }

  return {
    errorType,
    probableCause,
    normalizedMessage: message,
    httpStatus: status ?? null,
    rawCode: input.code ?? null,
    recoverable: errorType !== 'invalid_api_key' && errorType !== 'quota_exceeded',
    userActionRequired: true,
    providerId: input.providerId ?? null,
    modelId: input.modelId ?? null
  }
}

