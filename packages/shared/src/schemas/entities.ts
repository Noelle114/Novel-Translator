import { z } from 'zod'
import {
  ErrorScopeSchema,
  ErrorTypeSchema,
  ExportFormatSchema,
  ExportLayoutSchema,
  GlossaryRuleTypeSchema,
  JobStateSchema,
  ParagraphStateSchema,
  ProviderIdSchema,
  SourceTypeSchema,
  TranslationModeSchema
} from './enums.js'

export const UuidSchema = z.string().uuid()

export const TechnicalSettingsSchema = z.object({
  contextEnabled: z.boolean().default(true),
  contextWindow: z.number().int().min(0).max(3).default(2),
  retryCount: z.number().int().min(0).max(10).default(2),
  timeoutMs: z.number().int().min(500).max(180000).default(30000),
  fallbackOrder: z.array(ProviderIdSchema).default(['openai', 'gemini', 'deepl']),
  temperature: z.number().min(0).max(2).optional(),
  glossaryMergeBehavior: z.enum(['project_over_global', 'global_over_project']).default('project_over_global')
})

export const AppSettingsSchema = z.object({
  id: z.literal('app-settings'),
  activeProjectId: UuidSchema.nullable(),
  uiPreferences: z.object({
    editorLayout: z.enum(['stacked', 'side-by-side']).default('stacked')
  }),
  technicalDefaults: TechnicalSettingsSchema,
  createdAt: z.string(),
  updatedAt: z.string()
})

export const ProviderSettingsSchema = z.object({
  providerId: ProviderIdSchema,
  defaultModel: z.string().min(1),
  timeoutMs: z.number().int().min(500).max(180000),
  retryCount: z.number().int().min(0).max(10),
  temperature: z.number().min(0).max(2).optional(),
  rateLimitPolicy: z.enum(['strict_pause']).default('strict_pause'),
  credentialRefId: UuidSchema.optional(),
  updatedAt: z.string()
})

export const SavedCredentialRefSchema = z.object({
  id: UuidSchema,
  providerId: ProviderIdSchema,
  label: z.string().min(1),
  keychainAccount: z.string().min(1),
  lastValidatedAt: z.string().nullable(),
  status: z.enum(['unknown', 'valid', 'invalid'])
})

export const GlossaryEntrySchema = z.object({
  id: UuidSchema,
  sourceTerm: z.string().min(1),
  targetTerm: z.string().nullable(),
  ruleType: GlossaryRuleTypeSchema,
  caseSensitive: z.boolean().default(false),
  notes: z.string().nullable(),
  priority: z.number().int().default(0),
  updatedAt: z.string()
})

export const ProjectGlossaryEntrySchema = GlossaryEntrySchema.extend({
  projectId: UuidSchema
})

export const ProjectMetadataSchema = z.object({
  id: UuidSchema,
  name: z.string().min(1),
  sourceFilePath: z.string().min(1),
  sourceType: SourceTypeSchema,
  status: JobStateSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  lastOpenedAt: z.string().nullable()
})

export const SourceDocumentMetadataSchema = z.object({
  projectId: UuidSchema,
  title: z.string().default('Untitled'),
  author: z.string().nullable(),
  language: z.string().default('en'),
  chaptersCount: z.number().int().min(0),
  hasImages: z.boolean().default(false),
  hasFootnotes: z.boolean().default(false),
  tocAvailable: z.boolean().default(false),
  drmStatus: z.enum(['unknown', 'none', 'blocked']).default('unknown')
})

export const ChapterSchema = z.object({
  id: UuidSchema,
  projectId: UuidSchema,
  index: z.number().int().min(0),
  title: z.string().min(1),
  sourceRef: z.string().nullable()
})

export const SectionSchema = z.object({
  id: UuidSchema,
  chapterId: UuidSchema,
  index: z.number().int().min(0),
  kind: z.enum(['paragraphs', 'title', 'footnote']).default('paragraphs')
})

export const ParagraphSchema = z.object({
  id: UuidSchema,
  projectId: UuidSchema,
  sectionId: UuidSchema,
  index: z.number().int().min(0),
  sourceText: z.string().min(1),
  sourceInlineMarks: z.record(z.any()).default({}),
  translationText: z.string().default(''),
  state: ParagraphStateSchema.default('pending'),
  isLocked: z.boolean().default(false),
  isSkipped: z.boolean().default(false),
  issueFlag: z.boolean().default(false),
  contextHash: z.string().nullable(),
  providerTrace: z.record(z.any()).nullable(),
  revision: z.number().int().min(0).default(0),
  updatedAt: z.string(),
  lineageParentId: UuidSchema.nullable().default(null)
})

export const TranslationStateSchema = z.object({
  projectId: UuidSchema,
  runId: UuidSchema,
  providerId: ProviderIdSchema,
  modelId: z.string().min(1),
  mode: TranslationModeSchema,
  contextWindow: z.number().int().min(0).max(3),
  progress: z.number().min(0).max(1),
  active: z.boolean(),
  startedAt: z.string(),
  pausedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  status: JobStateSchema
})

export const ErrorStateSchema = z.object({
  id: UuidSchema,
  projectId: UuidSchema,
  runId: UuidSchema.nullable(),
  scope: ErrorScopeSchema,
  providerId: ProviderIdSchema.nullable(),
  modelId: z.string().nullable(),
  chapterId: UuidSchema.nullable(),
  paragraphId: UuidSchema.nullable(),
  errorType: ErrorTypeSchema,
  httpStatus: z.number().int().nullable(),
  rawCode: z.string().nullable(),
  normalizedMessage: z.string().min(1),
  probableCause: z.string().nullable(),
  recoverable: z.boolean(),
  userActionRequired: z.boolean(),
  createdAt: z.string(),
  resolvedAt: z.string().nullable()
})

export const ExportProfileSchema = z.object({
  id: UuidSchema,
  projectId: UuidSchema.nullable(),
  name: z.string().min(1),
  outputFormat: ExportFormatSchema,
  layout: ExportLayoutSchema,
  fontFamily: z.string().min(1),
  fontSize: z.number().int().min(8).max(48),
  textColor: z.string().min(1),
  sourceTextColor: z.string().min(1).optional(),
  translatedTextColor: z.string().min(1).optional(),
  backgroundColor: z.string().min(1),
  paragraphSpacing: z.number().int().min(0).max(64),
  margins: z.object({
    top: z.number().int().min(0).max(200),
    right: z.number().int().min(0).max(200),
    bottom: z.number().int().min(0).max(200),
    left: z.number().int().min(0).max(200)
  }),
  headingStyles: z.record(z.any()).default({}),
  tocOptions: z.record(z.any()).default({}),
  includeImages: z.boolean().default(true),
  includeMetadata: z.boolean().default(true),
  createdAt: z.string()
})
