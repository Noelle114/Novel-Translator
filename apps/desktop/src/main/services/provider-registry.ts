import {
  DeepLAdapter,
  GeminiAdapter,
  OpenAIAdapter,
  type ITranslationProviderAdapter
} from '@mtn/adapters'
import type { ProviderId } from '@mtn/shared'

export class ProviderRegistry {
  private readonly adapters = new Map<ProviderId, ITranslationProviderAdapter>()

  constructor() {
    this.adapters.set('openai', new OpenAIAdapter())
    this.adapters.set('gemini', new GeminiAdapter())
    this.adapters.set('deepl', new DeepLAdapter())
  }

  get(providerId: ProviderId): ITranslationProviderAdapter {
    const adapter = this.adapters.get(providerId)
    if (!adapter) {
      throw new Error(`Unsupported provider: ${providerId}`)
    }
    return adapter
  }
}

