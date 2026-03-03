import { z } from 'zod';
export declare const ProviderIdSchema: z.ZodEnum<["openai", "gemini", "deepl"]>;
export declare const SourceTypeSchema: z.ZodEnum<["epub", "pdf"]>;
export declare const ParagraphStateSchema: z.ZodEnum<["pending", "translating", "translated", "edited", "approved", "locked", "skipped", "unresolved", "error"]>;
export declare const JobStateSchema: z.ZodEnum<["idle", "extracting", "ready", "translating", "paused", "paused_recoverable", "paused_error_waiting_user", "completed", "failed", "cancelled"]>;
export declare const GlossaryRuleTypeSchema: z.ZodEnum<["never_translate", "always_translate", "preserve", "name_map"]>;
export declare const TranslationModeSchema: z.ZodEnum<["independent", "contextual"]>;
export declare const ErrorTypeSchema: z.ZodEnum<["invalid_api_key", "timeout", "rate_limit", "quota_exceeded", "provider_unavailable", "malformed_response", "parse_failure", "export_failure", "disk_write_failure", "unknown"]>;
export declare const ErrorScopeSchema: z.ZodEnum<["project", "chapter", "paragraph", "export"]>;
export declare const ExportFormatSchema: z.ZodEnum<["epub", "pdf"]>;
export declare const ExportLayoutSchema: z.ZodEnum<["single", "bilingual-stacked", "bilingual-sidebyside"]>;
export declare const RecoverActionSchema: z.ZodEnum<["retry_same_model", "switch_provider_model", "skip_paragraph", "pause_project", "mark_unresolved_and_continue", "stop_all"]>;
//# sourceMappingURL=enums.d.ts.map