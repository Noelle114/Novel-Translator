import {
  AppSettingsSchema,
  ChapterSchema,
  GlossaryEntrySchema,
  ErrorStateSchema,
  ExportProfileSchema,
  ParagraphSchema,
  ProjectGlossaryEntrySchema,
  ProjectMetadataSchema,
  ProviderSettingsSchema,
  SavedCredentialRefSchema,
  SectionSchema,
  SourceDocumentMetadataSchema,
  TranslationStateSchema
} from './schemas/entities.js'
import { JobStateSchema, ParagraphStateSchema, ProviderIdSchema } from './schemas/enums.js'

export type AppSettings = import('zod').infer<typeof AppSettingsSchema>
export type ProviderSettings = import('zod').infer<typeof ProviderSettingsSchema>
export type ProviderId = import('zod').infer<typeof ProviderIdSchema>
export type SavedCredentialRef = import('zod').infer<typeof SavedCredentialRefSchema>
export type GlossaryEntry = import('zod').infer<typeof GlossaryEntrySchema>
export type ProjectGlossaryEntry = import('zod').infer<typeof ProjectGlossaryEntrySchema>
export type ProjectMetadata = import('zod').infer<typeof ProjectMetadataSchema>
export type SourceDocumentMetadata = import('zod').infer<typeof SourceDocumentMetadataSchema>
export type Chapter = import('zod').infer<typeof ChapterSchema>
export type Section = import('zod').infer<typeof SectionSchema>
export type Paragraph = import('zod').infer<typeof ParagraphSchema>
export type ParagraphState = import('zod').infer<typeof ParagraphStateSchema>
export type TranslationState = import('zod').infer<typeof TranslationStateSchema>
export type JobState = import('zod').infer<typeof JobStateSchema>
export type ErrorState = import('zod').infer<typeof ErrorStateSchema>
export type ExportProfile = import('zod').infer<typeof ExportProfileSchema>
