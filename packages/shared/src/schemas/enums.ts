import { z } from 'zod'

export const ProviderIdSchema = z.enum(['openai', 'gemini', 'deepl'])
export const SourceTypeSchema = z.enum(['epub', 'pdf'])

export const ParagraphStateSchema = z.enum([
  'pending',
  'translating',
  'translated',
  'edited',
  'approved',
  'locked',
  'skipped',
  'unresolved',
  'error'
])

export const JobStateSchema = z.enum([
  'idle',
  'extracting',
  'ready',
  'translating',
  'paused',
  'paused_recoverable',
  'paused_error_waiting_user',
  'completed',
  'failed',
  'cancelled'
])

export const GlossaryRuleTypeSchema = z.enum([
  'never_translate',
  'always_translate',
  'preserve',
  'name_map'
])

export const TranslationModeSchema = z.enum(['independent', 'contextual'])

export const ErrorTypeSchema = z.enum([
  'invalid_api_key',
  'timeout',
  'rate_limit',
  'quota_exceeded',
  'provider_unavailable',
  'malformed_response',
  'parse_failure',
  'export_failure',
  'disk_write_failure',
  'unknown'
])

export const ErrorScopeSchema = z.enum(['project', 'chapter', 'paragraph', 'export'])

export const ExportFormatSchema = z.enum(['epub', 'pdf'])
export const ExportLayoutSchema = z.enum([
  'single',
  'bilingual-stacked',
  'bilingual-sidebyside'
])

export const RecoverActionSchema = z.enum([
  'retry_same_model',
  'switch_provider_model',
  'skip_paragraph',
  'pause_project',
  'mark_unresolved_and_continue',
  'stop_all'
])
