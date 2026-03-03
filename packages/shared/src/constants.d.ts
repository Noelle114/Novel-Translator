import { z } from 'zod';
export declare const APP_SERVICE_NAME = "mtn-translator-desktop";
export declare const DEFAULT_APP_SETTINGS: {
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
};
export declare const IsoDateTimeSchema: z.ZodUnion<[z.ZodString, z.ZodString]>;
//# sourceMappingURL=constants.d.ts.map