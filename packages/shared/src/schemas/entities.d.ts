import { z } from 'zod';
export declare const UuidSchema: z.ZodString;
export declare const TechnicalSettingsSchema: z.ZodObject<{
    contextEnabled: z.ZodDefault<z.ZodBoolean>;
    contextWindow: z.ZodDefault<z.ZodNumber>;
    retryCount: z.ZodDefault<z.ZodNumber>;
    timeoutMs: z.ZodDefault<z.ZodNumber>;
    fallbackOrder: z.ZodDefault<z.ZodArray<z.ZodEnum<["openai", "gemini", "deepl"]>, "many">>;
    temperature: z.ZodOptional<z.ZodNumber>;
    glossaryMergeBehavior: z.ZodDefault<z.ZodEnum<["project_over_global", "global_over_project"]>>;
}, "strip", z.ZodTypeAny, {
    contextEnabled: boolean;
    contextWindow: number;
    retryCount: number;
    timeoutMs: number;
    fallbackOrder: ("openai" | "gemini" | "deepl")[];
    glossaryMergeBehavior: "project_over_global" | "global_over_project";
    temperature?: number | undefined;
}, {
    contextEnabled?: boolean | undefined;
    contextWindow?: number | undefined;
    retryCount?: number | undefined;
    timeoutMs?: number | undefined;
    fallbackOrder?: ("openai" | "gemini" | "deepl")[] | undefined;
    temperature?: number | undefined;
    glossaryMergeBehavior?: "project_over_global" | "global_over_project" | undefined;
}>;
export declare const AppSettingsSchema: z.ZodObject<{
    id: z.ZodLiteral<"app-settings">;
    activeProjectId: z.ZodNullable<z.ZodString>;
    uiPreferences: z.ZodObject<{
        editorLayout: z.ZodDefault<z.ZodEnum<["stacked", "side-by-side"]>>;
    }, "strip", z.ZodTypeAny, {
        editorLayout: "stacked" | "side-by-side";
    }, {
        editorLayout?: "stacked" | "side-by-side" | undefined;
    }>;
    technicalDefaults: z.ZodObject<{
        contextEnabled: z.ZodDefault<z.ZodBoolean>;
        contextWindow: z.ZodDefault<z.ZodNumber>;
        retryCount: z.ZodDefault<z.ZodNumber>;
        timeoutMs: z.ZodDefault<z.ZodNumber>;
        fallbackOrder: z.ZodDefault<z.ZodArray<z.ZodEnum<["openai", "gemini", "deepl"]>, "many">>;
        temperature: z.ZodOptional<z.ZodNumber>;
        glossaryMergeBehavior: z.ZodDefault<z.ZodEnum<["project_over_global", "global_over_project"]>>;
    }, "strip", z.ZodTypeAny, {
        contextEnabled: boolean;
        contextWindow: number;
        retryCount: number;
        timeoutMs: number;
        fallbackOrder: ("openai" | "gemini" | "deepl")[];
        glossaryMergeBehavior: "project_over_global" | "global_over_project";
        temperature?: number | undefined;
    }, {
        contextEnabled?: boolean | undefined;
        contextWindow?: number | undefined;
        retryCount?: number | undefined;
        timeoutMs?: number | undefined;
        fallbackOrder?: ("openai" | "gemini" | "deepl")[] | undefined;
        temperature?: number | undefined;
        glossaryMergeBehavior?: "project_over_global" | "global_over_project" | undefined;
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: "app-settings";
    activeProjectId: string | null;
    uiPreferences: {
        editorLayout: "stacked" | "side-by-side";
    };
    technicalDefaults: {
        contextEnabled: boolean;
        contextWindow: number;
        retryCount: number;
        timeoutMs: number;
        fallbackOrder: ("openai" | "gemini" | "deepl")[];
        glossaryMergeBehavior: "project_over_global" | "global_over_project";
        temperature?: number | undefined;
    };
    createdAt: string;
    updatedAt: string;
}, {
    id: "app-settings";
    activeProjectId: string | null;
    uiPreferences: {
        editorLayout?: "stacked" | "side-by-side" | undefined;
    };
    technicalDefaults: {
        contextEnabled?: boolean | undefined;
        contextWindow?: number | undefined;
        retryCount?: number | undefined;
        timeoutMs?: number | undefined;
        fallbackOrder?: ("openai" | "gemini" | "deepl")[] | undefined;
        temperature?: number | undefined;
        glossaryMergeBehavior?: "project_over_global" | "global_over_project" | undefined;
    };
    createdAt: string;
    updatedAt: string;
}>;
export declare const ProviderSettingsSchema: z.ZodObject<{
    providerId: z.ZodEnum<["openai", "gemini", "deepl"]>;
    defaultModel: z.ZodString;
    timeoutMs: z.ZodNumber;
    retryCount: z.ZodNumber;
    temperature: z.ZodOptional<z.ZodNumber>;
    rateLimitPolicy: z.ZodDefault<z.ZodEnum<["strict_pause"]>>;
    credentialRefId: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    retryCount: number;
    timeoutMs: number;
    updatedAt: string;
    providerId: "openai" | "gemini" | "deepl";
    defaultModel: string;
    rateLimitPolicy: "strict_pause";
    temperature?: number | undefined;
    credentialRefId?: string | undefined;
}, {
    retryCount: number;
    timeoutMs: number;
    updatedAt: string;
    providerId: "openai" | "gemini" | "deepl";
    defaultModel: string;
    temperature?: number | undefined;
    rateLimitPolicy?: "strict_pause" | undefined;
    credentialRefId?: string | undefined;
}>;
export declare const SavedCredentialRefSchema: z.ZodObject<{
    id: z.ZodString;
    providerId: z.ZodEnum<["openai", "gemini", "deepl"]>;
    label: z.ZodString;
    keychainAccount: z.ZodString;
    lastValidatedAt: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["unknown", "valid", "invalid"]>;
}, "strip", z.ZodTypeAny, {
    status: "unknown" | "valid" | "invalid";
    id: string;
    providerId: "openai" | "gemini" | "deepl";
    label: string;
    keychainAccount: string;
    lastValidatedAt: string | null;
}, {
    status: "unknown" | "valid" | "invalid";
    id: string;
    providerId: "openai" | "gemini" | "deepl";
    label: string;
    keychainAccount: string;
    lastValidatedAt: string | null;
}>;
export declare const GlossaryEntrySchema: z.ZodObject<{
    id: z.ZodString;
    sourceTerm: z.ZodString;
    targetTerm: z.ZodNullable<z.ZodString>;
    ruleType: z.ZodEnum<["never_translate", "always_translate", "preserve", "name_map"]>;
    caseSensitive: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodNullable<z.ZodString>;
    priority: z.ZodDefault<z.ZodNumber>;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    updatedAt: string;
    sourceTerm: string;
    targetTerm: string | null;
    ruleType: "never_translate" | "always_translate" | "preserve" | "name_map";
    caseSensitive: boolean;
    notes: string | null;
    priority: number;
}, {
    id: string;
    updatedAt: string;
    sourceTerm: string;
    targetTerm: string | null;
    ruleType: "never_translate" | "always_translate" | "preserve" | "name_map";
    notes: string | null;
    caseSensitive?: boolean | undefined;
    priority?: number | undefined;
}>;
export declare const ProjectGlossaryEntrySchema: z.ZodObject<{
    id: z.ZodString;
    sourceTerm: z.ZodString;
    targetTerm: z.ZodNullable<z.ZodString>;
    ruleType: z.ZodEnum<["never_translate", "always_translate", "preserve", "name_map"]>;
    caseSensitive: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodNullable<z.ZodString>;
    priority: z.ZodDefault<z.ZodNumber>;
    updatedAt: z.ZodString;
} & {
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    updatedAt: string;
    sourceTerm: string;
    targetTerm: string | null;
    ruleType: "never_translate" | "always_translate" | "preserve" | "name_map";
    caseSensitive: boolean;
    notes: string | null;
    priority: number;
    projectId: string;
}, {
    id: string;
    updatedAt: string;
    sourceTerm: string;
    targetTerm: string | null;
    ruleType: "never_translate" | "always_translate" | "preserve" | "name_map";
    notes: string | null;
    projectId: string;
    caseSensitive?: boolean | undefined;
    priority?: number | undefined;
}>;
export declare const ProjectMetadataSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    sourceFilePath: z.ZodString;
    sourceType: z.ZodEnum<["epub", "pdf"]>;
    status: z.ZodEnum<["idle", "extracting", "ready", "translating", "paused", "paused_recoverable", "paused_error_waiting_user", "completed", "failed", "cancelled"]>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    lastOpenedAt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "translating" | "idle" | "extracting" | "ready" | "paused" | "paused_recoverable" | "paused_error_waiting_user" | "completed" | "failed" | "cancelled";
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    sourceFilePath: string;
    sourceType: "epub" | "pdf";
    lastOpenedAt: string | null;
}, {
    status: "translating" | "idle" | "extracting" | "ready" | "paused" | "paused_recoverable" | "paused_error_waiting_user" | "completed" | "failed" | "cancelled";
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    sourceFilePath: string;
    sourceType: "epub" | "pdf";
    lastOpenedAt: string | null;
}>;
export declare const SourceDocumentMetadataSchema: z.ZodObject<{
    projectId: z.ZodString;
    title: z.ZodDefault<z.ZodString>;
    author: z.ZodNullable<z.ZodString>;
    language: z.ZodDefault<z.ZodString>;
    chaptersCount: z.ZodNumber;
    hasImages: z.ZodDefault<z.ZodBoolean>;
    hasFootnotes: z.ZodDefault<z.ZodBoolean>;
    tocAvailable: z.ZodDefault<z.ZodBoolean>;
    drmStatus: z.ZodDefault<z.ZodEnum<["unknown", "none", "blocked"]>>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    title: string;
    author: string | null;
    language: string;
    chaptersCount: number;
    hasImages: boolean;
    hasFootnotes: boolean;
    tocAvailable: boolean;
    drmStatus: "unknown" | "none" | "blocked";
}, {
    projectId: string;
    author: string | null;
    chaptersCount: number;
    title?: string | undefined;
    language?: string | undefined;
    hasImages?: boolean | undefined;
    hasFootnotes?: boolean | undefined;
    tocAvailable?: boolean | undefined;
    drmStatus?: "unknown" | "none" | "blocked" | undefined;
}>;
export declare const ChapterSchema: z.ZodObject<{
    id: z.ZodString;
    projectId: z.ZodString;
    index: z.ZodNumber;
    title: z.ZodString;
    sourceRef: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    projectId: string;
    title: string;
    index: number;
    sourceRef: string | null;
}, {
    id: string;
    projectId: string;
    title: string;
    index: number;
    sourceRef: string | null;
}>;
export declare const SectionSchema: z.ZodObject<{
    id: z.ZodString;
    chapterId: z.ZodString;
    index: z.ZodNumber;
    kind: z.ZodDefault<z.ZodEnum<["paragraphs", "title", "footnote"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    index: number;
    chapterId: string;
    kind: "title" | "paragraphs" | "footnote";
}, {
    id: string;
    index: number;
    chapterId: string;
    kind?: "title" | "paragraphs" | "footnote" | undefined;
}>;
export declare const ParagraphSchema: z.ZodObject<{
    id: z.ZodString;
    projectId: z.ZodString;
    sectionId: z.ZodString;
    index: z.ZodNumber;
    sourceText: z.ZodString;
    sourceInlineMarks: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    translationText: z.ZodDefault<z.ZodString>;
    state: z.ZodDefault<z.ZodEnum<["pending", "translating", "translated", "edited", "approved", "locked", "skipped", "unresolved", "error"]>>;
    isLocked: z.ZodDefault<z.ZodBoolean>;
    isSkipped: z.ZodDefault<z.ZodBoolean>;
    issueFlag: z.ZodDefault<z.ZodBoolean>;
    contextHash: z.ZodNullable<z.ZodString>;
    providerTrace: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>;
    revision: z.ZodDefault<z.ZodNumber>;
    updatedAt: z.ZodString;
    lineageParentId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    updatedAt: string;
    projectId: string;
    index: number;
    sectionId: string;
    sourceText: string;
    sourceInlineMarks: Record<string, any>;
    translationText: string;
    state: "pending" | "translating" | "translated" | "edited" | "approved" | "locked" | "skipped" | "unresolved" | "error";
    isLocked: boolean;
    isSkipped: boolean;
    issueFlag: boolean;
    contextHash: string | null;
    providerTrace: Record<string, any> | null;
    revision: number;
    lineageParentId: string | null;
}, {
    id: string;
    updatedAt: string;
    projectId: string;
    index: number;
    sectionId: string;
    sourceText: string;
    contextHash: string | null;
    providerTrace: Record<string, any> | null;
    sourceInlineMarks?: Record<string, any> | undefined;
    translationText?: string | undefined;
    state?: "pending" | "translating" | "translated" | "edited" | "approved" | "locked" | "skipped" | "unresolved" | "error" | undefined;
    isLocked?: boolean | undefined;
    isSkipped?: boolean | undefined;
    issueFlag?: boolean | undefined;
    revision?: number | undefined;
    lineageParentId?: string | null | undefined;
}>;
export declare const TranslationStateSchema: z.ZodObject<{
    projectId: z.ZodString;
    runId: z.ZodString;
    providerId: z.ZodEnum<["openai", "gemini", "deepl"]>;
    modelId: z.ZodString;
    mode: z.ZodEnum<["independent", "contextual"]>;
    contextWindow: z.ZodNumber;
    progress: z.ZodNumber;
    active: z.ZodBoolean;
    startedAt: z.ZodString;
    pausedAt: z.ZodNullable<z.ZodString>;
    completedAt: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["idle", "extracting", "ready", "translating", "paused", "paused_recoverable", "paused_error_waiting_user", "completed", "failed", "cancelled"]>;
}, "strip", z.ZodTypeAny, {
    contextWindow: number;
    status: "translating" | "idle" | "extracting" | "ready" | "paused" | "paused_recoverable" | "paused_error_waiting_user" | "completed" | "failed" | "cancelled";
    providerId: "openai" | "gemini" | "deepl";
    projectId: string;
    runId: string;
    modelId: string;
    mode: "independent" | "contextual";
    progress: number;
    active: boolean;
    startedAt: string;
    pausedAt: string | null;
    completedAt: string | null;
}, {
    contextWindow: number;
    status: "translating" | "idle" | "extracting" | "ready" | "paused" | "paused_recoverable" | "paused_error_waiting_user" | "completed" | "failed" | "cancelled";
    providerId: "openai" | "gemini" | "deepl";
    projectId: string;
    runId: string;
    modelId: string;
    mode: "independent" | "contextual";
    progress: number;
    active: boolean;
    startedAt: string;
    pausedAt: string | null;
    completedAt: string | null;
}>;
export declare const ErrorStateSchema: z.ZodObject<{
    id: z.ZodString;
    projectId: z.ZodString;
    runId: z.ZodNullable<z.ZodString>;
    scope: z.ZodEnum<["project", "chapter", "paragraph", "export"]>;
    providerId: z.ZodNullable<z.ZodEnum<["openai", "gemini", "deepl"]>>;
    modelId: z.ZodNullable<z.ZodString>;
    chapterId: z.ZodNullable<z.ZodString>;
    paragraphId: z.ZodNullable<z.ZodString>;
    errorType: z.ZodEnum<["invalid_api_key", "timeout", "rate_limit", "quota_exceeded", "provider_unavailable", "malformed_response", "parse_failure", "export_failure", "disk_write_failure", "unknown"]>;
    httpStatus: z.ZodNullable<z.ZodNumber>;
    rawCode: z.ZodNullable<z.ZodString>;
    normalizedMessage: z.ZodString;
    probableCause: z.ZodNullable<z.ZodString>;
    recoverable: z.ZodBoolean;
    userActionRequired: z.ZodBoolean;
    createdAt: z.ZodString;
    resolvedAt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    providerId: "openai" | "gemini" | "deepl" | null;
    projectId: string;
    chapterId: string | null;
    runId: string | null;
    modelId: string | null;
    scope: "project" | "chapter" | "paragraph" | "export";
    paragraphId: string | null;
    errorType: "invalid_api_key" | "timeout" | "rate_limit" | "quota_exceeded" | "provider_unavailable" | "malformed_response" | "parse_failure" | "export_failure" | "disk_write_failure" | "unknown";
    httpStatus: number | null;
    rawCode: string | null;
    normalizedMessage: string;
    probableCause: string | null;
    recoverable: boolean;
    userActionRequired: boolean;
    resolvedAt: string | null;
}, {
    id: string;
    createdAt: string;
    providerId: "openai" | "gemini" | "deepl" | null;
    projectId: string;
    chapterId: string | null;
    runId: string | null;
    modelId: string | null;
    scope: "project" | "chapter" | "paragraph" | "export";
    paragraphId: string | null;
    errorType: "invalid_api_key" | "timeout" | "rate_limit" | "quota_exceeded" | "provider_unavailable" | "malformed_response" | "parse_failure" | "export_failure" | "disk_write_failure" | "unknown";
    httpStatus: number | null;
    rawCode: string | null;
    normalizedMessage: string;
    probableCause: string | null;
    recoverable: boolean;
    userActionRequired: boolean;
    resolvedAt: string | null;
}>;
export declare const ExportProfileSchema: z.ZodObject<{
    id: z.ZodString;
    projectId: z.ZodNullable<z.ZodString>;
    name: z.ZodString;
    outputFormat: z.ZodEnum<["epub", "pdf"]>;
    layout: z.ZodEnum<["single", "bilingual-stacked", "bilingual-sidebyside"]>;
    fontFamily: z.ZodString;
    fontSize: z.ZodNumber;
    textColor: z.ZodString;
    backgroundColor: z.ZodString;
    paragraphSpacing: z.ZodNumber;
    margins: z.ZodObject<{
        top: z.ZodNumber;
        right: z.ZodNumber;
        bottom: z.ZodNumber;
        left: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        top: number;
        right: number;
        bottom: number;
        left: number;
    }, {
        top: number;
        right: number;
        bottom: number;
        left: number;
    }>;
    headingStyles: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    tocOptions: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    includeImages: z.ZodDefault<z.ZodBoolean>;
    includeMetadata: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    projectId: string | null;
    name: string;
    outputFormat: "epub" | "pdf";
    layout: "single" | "bilingual-stacked" | "bilingual-sidebyside";
    fontFamily: string;
    fontSize: number;
    textColor: string;
    backgroundColor: string;
    paragraphSpacing: number;
    margins: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    headingStyles: Record<string, any>;
    tocOptions: Record<string, any>;
    includeImages: boolean;
    includeMetadata: boolean;
}, {
    id: string;
    createdAt: string;
    projectId: string | null;
    name: string;
    outputFormat: "epub" | "pdf";
    layout: "single" | "bilingual-stacked" | "bilingual-sidebyside";
    fontFamily: string;
    fontSize: number;
    textColor: string;
    backgroundColor: string;
    paragraphSpacing: number;
    margins: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    headingStyles?: Record<string, any> | undefined;
    tocOptions?: Record<string, any> | undefined;
    includeImages?: boolean | undefined;
    includeMetadata?: boolean | undefined;
}>;
//# sourceMappingURL=entities.d.ts.map