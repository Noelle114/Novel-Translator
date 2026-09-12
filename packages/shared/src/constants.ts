import { z } from 'zod'
import { AppSettingsSchema } from './schemas/entities.js'

export const APP_SERVICE_NAME = 'mtn-translator-desktop'

export const DEFAULT_APP_SETTINGS = AppSettingsSchema.parse({
  id: 'app-settings',
  activeProjectId: null,
  uiPreferences: {
    editorLayout: 'stacked'
  },
  technicalDefaults: {
    contextEnabled: true,
    contextWindow: 2,
    retryCount: 2,
    timeoutMs: 120000,
    fallbackOrder: ['openai', 'gemini', 'deepl'],
    glossaryMergeBehavior: 'project_over_global',
    targetLanguage: 'zh'
  },
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString()
})

export const IsoDateTimeSchema = z.string().datetime({ offset: true }).or(z.string())

export const TARGET_LANGUAGES = [
  { code: 'zh', name: 'Chinese', deeplCode: 'ZH', label: '中文' },
  { code: 'en', name: 'English', deeplCode: 'EN', label: 'English' },
  { code: 'tr', name: 'Turkish', deeplCode: 'TR', label: 'Türkçe' }
] as const

export type TargetLanguageCode = (typeof TARGET_LANGUAGES)[number]['code']

export function targetLanguageName(code: TargetLanguageCode): string {
  return TARGET_LANGUAGES.find((l) => l.code === code)?.name ?? 'Chinese'
}
