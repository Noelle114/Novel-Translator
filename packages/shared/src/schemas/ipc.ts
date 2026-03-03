import { z } from 'zod'
import {
  AppSettingsSchema,
  ErrorStateSchema,
  ExportProfileSchema,
  ParagraphSchema,
  ProjectMetadataSchema,
  ProviderSettingsSchema,
  SavedCredentialRefSchema,
  TechnicalSettingsSchema,
  UuidSchema
} from './entities.js'
import { ProviderIdSchema, RecoverActionSchema } from './enums.js'

export const CreateProjectFromFileSchema = z.object({
  path: z.string().min(1),
  importOptions: z.object({
    name: z.string().min(1).optional()
  }).optional()
})

export const TranslationRunConfigSchema = z.object({
  providerId: ProviderIdSchema,
  modelId: z.string().min(1),
  mode: z.enum(['independent', 'contextual']),
  contextWindow: z.number().int().min(0).max(3),
  retryCount: z.number().int().min(0).max(10),
  timeoutMs: z.number().int().min(500).max(180000),
  temperature: z.number().min(0).max(2).optional(),
  glossaryMergeBehavior: z.enum(['project_over_global', 'global_over_project'])
})

export const UpdateParagraphPatchSchema = z.object({
  translationText: z.string().optional(),
  state: ParagraphSchema.shape.state.optional(),
  isLocked: z.boolean().optional(),
  isSkipped: z.boolean().optional(),
  issueFlag: z.boolean().optional()
})

export const ExportStartSchema = z.object({
  projectId: UuidSchema,
  exportProfileId: UuidSchema
})

export const ResolveErrorSchema = z.object({
  errorId: UuidSchema,
  action: RecoverActionSchema
})

export const DeleteErrorSchema = z.object({
  errorId: UuidSchema
})

export const ApiContractSchemas = {
  'settings:get': z.object({}),
  'settings:updateTechnical': TechnicalSettingsSchema,
  'settings:providers:list': z.object({}),
  'settings:providers:upsert': ProviderSettingsSchema,

  'credentials:set': z.object({
    provider: ProviderIdSchema,
    keyRef: SavedCredentialRefSchema,
    key: z.string().min(1)
  }),
  'credentials:delete': z.object({
    provider: ProviderIdSchema,
    keyRefId: UuidSchema
  }),
  'credentials:get': z.object({
    provider: ProviderIdSchema
  }),

  'projects:createFromFile': CreateProjectFromFileSchema,
  'projects:open': z.object({ projectId: UuidSchema }),
  'projects:list': z.object({}),
  'projects:delete': z.object({ projectId: UuidSchema }),

  'translation:start': z.object({ projectId: UuidSchema, runConfig: TranslationRunConfigSchema }),
  'translation:pause': z.object({ projectId: UuidSchema }),
  'translation:resume': z.object({ projectId: UuidSchema }),
  'translation:stop': z.object({ projectId: UuidSchema }),
  'translation:retryParagraph': z.object({ projectId: UuidSchema, paragraphId: UuidSchema, sameModel: z.boolean().default(true) }),
  'translation:alternativeParagraph': z.object({ projectId: UuidSchema, paragraphId: UuidSchema, sameModel: z.boolean().default(true) }),

  'editor:updateParagraph': z.object({ projectId: UuidSchema, paragraphId: UuidSchema, patch: UpdateParagraphPatchSchema }),
  'editor:splitParagraph': z.object({ projectId: UuidSchema, paragraphId: UuidSchema, splitIndex: z.number().int().min(1) }),
  'editor:mergeParagraph': z.object({ projectId: UuidSchema, firstParagraphId: UuidSchema, secondParagraphId: UuidSchema }),
  'editor:listParagraphs': z.object({ projectId: UuidSchema, sectionId: UuidSchema.optional() }),

  'export:start': ExportStartSchema,
  'export:profiles:list': z.object({ projectId: UuidSchema.optional() }),
  'export:profiles:upsert': ExportProfileSchema,

  'jobs:getState': z.object({ projectId: UuidSchema }),

  'errors:list': z.object({ projectId: UuidSchema }),
  'errors:resolve': ResolveErrorSchema,
  'errors:delete': DeleteErrorSchema
}

export type IpcChannel = keyof typeof ApiContractSchemas

export const ApiResponses = {
  'settings:get': AppSettingsSchema,
  'settings:updateTechnical': AppSettingsSchema,
  'settings:providers:list': z.array(ProviderSettingsSchema),
  'settings:providers:upsert': ProviderSettingsSchema,

  'credentials:set': z.object({ ok: z.literal(true) }),
  'credentials:delete': z.object({ ok: z.literal(true) }),
  'credentials:get': z.object({ key: z.string().nullable() }),

  'projects:createFromFile': ProjectMetadataSchema,
  'projects:open': z.object({
    project: ProjectMetadataSchema,
    paragraphs: z.array(ParagraphSchema)
  }),
  'projects:list': z.array(ProjectMetadataSchema),
  'projects:delete': z.object({ ok: z.literal(true) }),

  'translation:start': z.object({ ok: z.literal(true) }),
  'translation:pause': z.object({ ok: z.literal(true) }),
  'translation:resume': z.object({ ok: z.literal(true) }),
  'translation:stop': z.object({ ok: z.literal(true) }),
  'translation:retryParagraph': z.object({ ok: z.literal(true) }),
  'translation:alternativeParagraph': z.object({ ok: z.literal(true) }),

  'editor:updateParagraph': ParagraphSchema,
  'editor:splitParagraph': z.array(ParagraphSchema),
  'editor:mergeParagraph': ParagraphSchema,
  'editor:listParagraphs': z.array(ParagraphSchema),

  'export:start': z.object({ outputPath: z.string() }),
  'export:profiles:list': z.array(ExportProfileSchema),
  'export:profiles:upsert': ExportProfileSchema,

  'jobs:getState': z.object({
    projectId: UuidSchema,
    state: z.string(),
    progress: z.number().min(0).max(1)
  }),

  'errors:list': z.array(ErrorStateSchema),
  'errors:resolve': z.object({ ok: z.literal(true) }),
  'errors:delete': z.object({ ok: z.literal(true) })
}
