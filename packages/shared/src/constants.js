import { z } from 'zod';
import { AppSettingsSchema } from './schemas/entities';
export const APP_SERVICE_NAME = 'mtn-translator-desktop';
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
        timeoutMs: 30000,
        fallbackOrder: ['openai', 'gemini', 'deepl'],
        glossaryMergeBehavior: 'project_over_global'
    },
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString()
});
export const IsoDateTimeSchema = z.string().datetime({ offset: true }).or(z.string());
