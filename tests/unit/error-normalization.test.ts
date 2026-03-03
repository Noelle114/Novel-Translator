import { describe, expect, it } from 'vitest'
import { normalizeProviderError } from '@mtn/domain'

describe('normalizeProviderError', () => {
  it('maps invalid key patterns', () => {
    const result = normalizeProviderError({
      providerId: 'openai',
      status: 401,
      message: 'invalid API key'
    })

    expect(result.errorType).toBe('invalid_api_key')
  })

  it('maps rate limit', () => {
    const result = normalizeProviderError({
      providerId: 'openai',
      status: 429,
      message: 'rate limit reached'
    })

    expect(result.errorType).toBe('rate_limit')
    expect(result.recoverable).toBe(true)
  })
})

