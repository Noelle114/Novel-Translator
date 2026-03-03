import { z } from 'zod';
export declare const CreateProjectFromFileSchema: z.ZodObject<{
    path: z.ZodString;
    importOptions: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
    }, {
        name?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    path: string;
    importOptions?: {
        name?: string | undefined;
    } | undefined;
}, {
    path: string;
    importOptions?: {
        name?: string | undefined;
    } | undefined;
}>;
export declare const TranslationRunConfigSchema: z.ZodObject<{
    providerId: z.ZodEnum<["openai", "gemini", "deepl"]>;
    modelId: z.ZodString;
    mode: z.ZodEnum<["independent", "contextual"]>;
    contextWindow: z.ZodNumber;
    retryCount: z.ZodNumber;
    timeoutMs: z.ZodNumber;
    temperature: z.ZodOptional<z.ZodNumber>;
    glossaryMergeBehavior: z.ZodEnum<["project_over_global", "global_over_project"]>;
}, "strip", z.ZodTypeAny, {
    contextWindow: number;
    retryCount: number;
    timeoutMs: number;
    glossaryMergeBehavior: "project_over_global" | "global_over_project";
    providerId: "openai" | "gemini" | "deepl";
    modelId: string;
    mode: "independent" | "contextual";
    temperature?: number | undefined;
}, {
    contextWindow: number;
    retryCount: number;
    timeoutMs: number;
    glossaryMergeBehavior: "project_over_global" | "global_over_project";
    providerId: "openai" | "gemini" | "deepl";
    modelId: string;
    mode: "independent" | "contextual";
    temperature?: number | undefined;
}>;
export declare const UpdateParagraphPatchSchema: z.ZodObject<{
    translationText: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodDefault<z.ZodEnum<["pending", "translating", "translated", "edited", "approved", "locked", "skipped", "unresolved", "error"]>>>;
    isLocked: z.ZodOptional<z.ZodBoolean>;
    isSkipped: z.ZodOptional<z.ZodBoolean>;
    issueFlag: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    translationText?: string | undefined;
    state?: "pending" | "translating" | "translated" | "edited" | "approved" | "locked" | "skipped" | "unresolved" | "error" | undefined;
    isLocked?: boolean | undefined;
    isSkipped?: boolean | undefined;
    issueFlag?: boolean | undefined;
}, {
    translationText?: string | undefined;
    state?: "pending" | "translating" | "translated" | "edited" | "approved" | "locked" | "skipped" | "unresolved" | "error" | undefined;
    isLocked?: boolean | undefined;
    isSkipped?: boolean | undefined;
    issueFlag?: boolean | undefined;
}>;
export declare const ExportStartSchema: z.ZodObject<{
    projectId: z.ZodString;
    exportProfileId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    exportProfileId: string;
}, {
    projectId: string;
    exportProfileId: string;
}>;
export declare const ResolveErrorSchema: z.ZodObject<{
    errorId: z.ZodString;
    action: z.ZodEnum<["retry_same_model", "switch_provider_model", "skip_paragraph", "pause_project", "mark_unresolved_and_continue", "stop_all"]>;
}, "strip", z.ZodTypeAny, {
    errorId: string;
    action: "retry_same_model" | "switch_provider_model" | "skip_paragraph" | "pause_project" | "mark_unresolved_and_continue" | "stop_all";
}, {
    errorId: string;
    action: "retry_same_model" | "switch_provider_model" | "skip_paragraph" | "pause_project" | "mark_unresolved_and_continue" | "stop_all";
}>;
export declare const ApiContractSchemas: {
    'settings:get': z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    'settings:updateTechnical': z.ZodObject<{
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
    'settings:providers:list': z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    'settings:providers:upsert': z.ZodObject<{
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
    'credentials:set': z.ZodObject<{
        provider: z.ZodEnum<["openai", "gemini", "deepl"]>;
        keyRef: z.ZodObject<{
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
        key: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        provider: "openai" | "gemini" | "deepl";
        keyRef: {
            status: "unknown" | "valid" | "invalid";
            id: string;
            providerId: "openai" | "gemini" | "deepl";
            label: string;
            keychainAccount: string;
            lastValidatedAt: string | null;
        };
        key: string;
    }, {
        provider: "openai" | "gemini" | "deepl";
        keyRef: {
            status: "unknown" | "valid" | "invalid";
            id: string;
            providerId: "openai" | "gemini" | "deepl";
            label: string;
            keychainAccount: string;
            lastValidatedAt: string | null;
        };
        key: string;
    }>;
    'credentials:delete': z.ZodObject<{
        provider: z.ZodEnum<["openai", "gemini", "deepl"]>;
        keyRefId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        provider: "openai" | "gemini" | "deepl";
        keyRefId: string;
    }, {
        provider: "openai" | "gemini" | "deepl";
        keyRefId: string;
    }>;
    'projects:createFromFile': z.ZodObject<{
        path: z.ZodString;
        importOptions: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
        }, {
            name?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        importOptions?: {
            name?: string | undefined;
        } | undefined;
    }, {
        path: string;
        importOptions?: {
            name?: string | undefined;
        } | undefined;
    }>;
    'projects:open': z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    'projects:list': z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    'translation:start': z.ZodObject<{
        projectId: z.ZodString;
        runConfig: z.ZodObject<{
            providerId: z.ZodEnum<["openai", "gemini", "deepl"]>;
            modelId: z.ZodString;
            mode: z.ZodEnum<["independent", "contextual"]>;
            contextWindow: z.ZodNumber;
            retryCount: z.ZodNumber;
            timeoutMs: z.ZodNumber;
            temperature: z.ZodOptional<z.ZodNumber>;
            glossaryMergeBehavior: z.ZodEnum<["project_over_global", "global_over_project"]>;
        }, "strip", z.ZodTypeAny, {
            contextWindow: number;
            retryCount: number;
            timeoutMs: number;
            glossaryMergeBehavior: "project_over_global" | "global_over_project";
            providerId: "openai" | "gemini" | "deepl";
            modelId: string;
            mode: "independent" | "contextual";
            temperature?: number | undefined;
        }, {
            contextWindow: number;
            retryCount: number;
            timeoutMs: number;
            glossaryMergeBehavior: "project_over_global" | "global_over_project";
            providerId: "openai" | "gemini" | "deepl";
            modelId: string;
            mode: "independent" | "contextual";
            temperature?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        runConfig: {
            contextWindow: number;
            retryCount: number;
            timeoutMs: number;
            glossaryMergeBehavior: "project_over_global" | "global_over_project";
            providerId: "openai" | "gemini" | "deepl";
            modelId: string;
            mode: "independent" | "contextual";
            temperature?: number | undefined;
        };
    }, {
        projectId: string;
        runConfig: {
            contextWindow: number;
            retryCount: number;
            timeoutMs: number;
            glossaryMergeBehavior: "project_over_global" | "global_over_project";
            providerId: "openai" | "gemini" | "deepl";
            modelId: string;
            mode: "independent" | "contextual";
            temperature?: number | undefined;
        };
    }>;
    'translation:pause': z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    'translation:resume': z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    'translation:stop': z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    'translation:retryParagraph': z.ZodObject<{
        projectId: z.ZodString;
        paragraphId: z.ZodString;
        sameModel: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        paragraphId: string;
        sameModel: boolean;
    }, {
        projectId: string;
        paragraphId: string;
        sameModel?: boolean | undefined;
    }>;
    'translation:alternativeParagraph': z.ZodObject<{
        projectId: z.ZodString;
        paragraphId: z.ZodString;
        sameModel: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        paragraphId: string;
        sameModel: boolean;
    }, {
        projectId: string;
        paragraphId: string;
        sameModel?: boolean | undefined;
    }>;
    'editor:updateParagraph': z.ZodObject<{
        projectId: z.ZodString;
        paragraphId: z.ZodString;
        patch: z.ZodObject<{
            translationText: z.ZodOptional<z.ZodString>;
            state: z.ZodOptional<z.ZodDefault<z.ZodEnum<["pending", "translating", "translated", "edited", "approved", "locked", "skipped", "unresolved", "error"]>>>;
            isLocked: z.ZodOptional<z.ZodBoolean>;
            isSkipped: z.ZodOptional<z.ZodBoolean>;
            issueFlag: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            translationText?: string | undefined;
            state?: "pending" | "translating" | "translated" | "edited" | "approved" | "locked" | "skipped" | "unresolved" | "error" | undefined;
            isLocked?: boolean | undefined;
            isSkipped?: boolean | undefined;
            issueFlag?: boolean | undefined;
        }, {
            translationText?: string | undefined;
            state?: "pending" | "translating" | "translated" | "edited" | "approved" | "locked" | "skipped" | "unresolved" | "error" | undefined;
            isLocked?: boolean | undefined;
            isSkipped?: boolean | undefined;
            issueFlag?: boolean | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        paragraphId: string;
        patch: {
            translationText?: string | undefined;
            state?: "pending" | "translating" | "translated" | "edited" | "approved" | "locked" | "skipped" | "unresolved" | "error" | undefined;
            isLocked?: boolean | undefined;
            isSkipped?: boolean | undefined;
            issueFlag?: boolean | undefined;
        };
    }, {
        projectId: string;
        paragraphId: string;
        patch: {
            translationText?: string | undefined;
            state?: "pending" | "translating" | "translated" | "edited" | "approved" | "locked" | "skipped" | "unresolved" | "error" | undefined;
            isLocked?: boolean | undefined;
            isSkipped?: boolean | undefined;
            issueFlag?: boolean | undefined;
        };
    }>;
    'editor:splitParagraph': z.ZodObject<{
        projectId: z.ZodString;
        paragraphId: z.ZodString;
        splitIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        paragraphId: string;
        splitIndex: number;
    }, {
        projectId: string;
        paragraphId: string;
        splitIndex: number;
    }>;
    'editor:mergeParagraph': z.ZodObject<{
        projectId: z.ZodString;
        firstParagraphId: z.ZodString;
        secondParagraphId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        firstParagraphId: string;
        secondParagraphId: string;
    }, {
        projectId: string;
        firstParagraphId: string;
        secondParagraphId: string;
    }>;
    'editor:listParagraphs': z.ZodObject<{
        projectId: z.ZodString;
        sectionId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        sectionId?: string | undefined;
    }, {
        projectId: string;
        sectionId?: string | undefined;
    }>;
    'export:start': z.ZodObject<{
        projectId: z.ZodString;
        exportProfileId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        exportProfileId: string;
    }, {
        projectId: string;
        exportProfileId: string;
    }>;
    'export:profiles:list': z.ZodObject<{
        projectId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        projectId?: string | undefined;
    }, {
        projectId?: string | undefined;
    }>;
    'export:profiles:upsert': z.ZodObject<{
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
    'jobs:getState': z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    'errors:list': z.ZodObject<{
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    'errors:resolve': z.ZodObject<{
        errorId: z.ZodString;
        action: z.ZodEnum<["retry_same_model", "switch_provider_model", "skip_paragraph", "pause_project", "mark_unresolved_and_continue", "stop_all"]>;
    }, "strip", z.ZodTypeAny, {
        errorId: string;
        action: "retry_same_model" | "switch_provider_model" | "skip_paragraph" | "pause_project" | "mark_unresolved_and_continue" | "stop_all";
    }, {
        errorId: string;
        action: "retry_same_model" | "switch_provider_model" | "skip_paragraph" | "pause_project" | "mark_unresolved_and_continue" | "stop_all";
    }>;
};
export type IpcChannel = keyof typeof ApiContractSchemas;
export declare const ApiResponses: {
    'settings:get': z.ZodObject<{
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
    'settings:updateTechnical': z.ZodObject<{
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
    'settings:providers:list': z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    'settings:providers:upsert': z.ZodObject<{
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
    'credentials:set': z.ZodObject<{
        ok: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        ok: true;
    }, {
        ok: true;
    }>;
    'credentials:delete': z.ZodObject<{
        ok: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        ok: true;
    }, {
        ok: true;
    }>;
    'projects:createFromFile': z.ZodObject<{
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
    'projects:open': z.ZodObject<{
        project: z.ZodObject<{
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
        paragraphs: z.ZodArray<z.ZodObject<{
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
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        project: {
            status: "translating" | "idle" | "extracting" | "ready" | "paused" | "paused_recoverable" | "paused_error_waiting_user" | "completed" | "failed" | "cancelled";
            id: string;
            createdAt: string;
            updatedAt: string;
            name: string;
            sourceFilePath: string;
            sourceType: "epub" | "pdf";
            lastOpenedAt: string | null;
        };
        paragraphs: {
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
        }[];
    }, {
        project: {
            status: "translating" | "idle" | "extracting" | "ready" | "paused" | "paused_recoverable" | "paused_error_waiting_user" | "completed" | "failed" | "cancelled";
            id: string;
            createdAt: string;
            updatedAt: string;
            name: string;
            sourceFilePath: string;
            sourceType: "epub" | "pdf";
            lastOpenedAt: string | null;
        };
        paragraphs: {
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
        }[];
    }>;
    'projects:list': z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    'translation:start': z.ZodObject<{
        ok: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        ok: true;
    }, {
        ok: true;
    }>;
    'translation:pause': z.ZodObject<{
        ok: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        ok: true;
    }, {
        ok: true;
    }>;
    'translation:resume': z.ZodObject<{
        ok: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        ok: true;
    }, {
        ok: true;
    }>;
    'translation:stop': z.ZodObject<{
        ok: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        ok: true;
    }, {
        ok: true;
    }>;
    'translation:retryParagraph': z.ZodObject<{
        ok: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        ok: true;
    }, {
        ok: true;
    }>;
    'translation:alternativeParagraph': z.ZodObject<{
        ok: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        ok: true;
    }, {
        ok: true;
    }>;
    'editor:updateParagraph': z.ZodObject<{
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
    'editor:splitParagraph': z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    'editor:mergeParagraph': z.ZodObject<{
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
    'editor:listParagraphs': z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    'export:start': z.ZodObject<{
        outputPath: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        outputPath: string;
    }, {
        outputPath: string;
    }>;
    'export:profiles:list': z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    'export:profiles:upsert': z.ZodObject<{
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
    'jobs:getState': z.ZodObject<{
        projectId: z.ZodString;
        state: z.ZodString;
        progress: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        state: string;
        progress: number;
    }, {
        projectId: string;
        state: string;
        progress: number;
    }>;
    'errors:list': z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    'errors:resolve': z.ZodObject<{
        ok: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        ok: true;
    }, {
        ok: true;
    }>;
};
//# sourceMappingURL=ipc.d.ts.map