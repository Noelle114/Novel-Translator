import * as electron from 'electron'
import { ApiContractSchemas } from '@mtn/shared'
import { z } from 'zod'
import type { TranslationJobOrchestrator } from '../jobs/job-orchestrator'
import type { CredentialService } from '../services/credential-service'
import type { ExportService } from '../services/export-service'
import type { ProjectService } from '../services/project-service'
import type { ProviderRegistry } from '../services/provider-registry'
import type { AppDatabase } from '@mtn/storage'

type RegisterIpcDeps = {
  db: AppDatabase
  credentials: CredentialService
  projects: ProjectService
  exports: ExportService
  providers: ProviderRegistry
  jobs: TranslationJobOrchestrator
}

const { BrowserWindow, dialog, ipcMain } = electron

function validate(schema: any, input: unknown): any {
  return schema.parse(input)
}

const listModelsPayloadSchema = z.object({
  providerId: z.enum(['openai', 'gemini', 'deepl', 'deepseek']),
  apiKey: z.string().min(1).optional()
})

const pickExportPathPayloadSchema = z.object({
  projectName: z.string().min(1),
  outputFormat: z.enum(['epub', 'pdf'])
})

const exportStartWithPathSchema = z.object({
  projectId: z.string().uuid(),
  exportProfileId: z.string().uuid(),
  outputPath: z.string().min(1)
})

export function registerIpc(deps: RegisterIpcDeps): void {
  deps.jobs.on('event', (event: unknown) => {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send('jobs:event', event)
    }
  })

  ipcMain.handle('settings:get', async () => deps.db.getAppSettings())
  ipcMain.handle('settings:updateTechnical', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['settings:updateTechnical'], payload)
    return deps.db.updateTechnicalSettings(safe)
  })
  ipcMain.handle('settings:providers:list', async () => deps.db.listProviderSettings())
  ipcMain.handle('settings:providers:upsert', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['settings:providers:upsert'], payload)
    return deps.db.upsertProviderSettings(safe)
  })
  ipcMain.handle('settings:providers:listModels', async (_event, payload) => {
    const safe = validate(listModelsPayloadSchema, payload)
    let apiKey = safe.apiKey?.trim() || null

    if (!apiKey) {
      const providerSettings = deps.db.getProviderSetting(safe.providerId)
      if (providerSettings?.credentialRefId) {
        const credentialRef = deps.db.getCredentialRef(providerSettings.credentialRefId)
        if (credentialRef) {
          apiKey = await deps.credentials.get(credentialRef)
        }
      }
    }

    if (!apiKey) {
      throw new Error('API key required. Save key first or paste key before fetching models.')
    }

    const adapter = deps.providers.get(safe.providerId)
    const models = await adapter.getModels(apiKey)
    return models
  })

  ipcMain.handle('credentials:set', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['credentials:set'], payload)
    deps.db.upsertCredentialRef(safe.keyRef)
    await deps.credentials.set(safe.keyRef, safe.key)
    return { ok: true as const }
  })

  ipcMain.handle('credentials:delete', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['credentials:delete'], payload)
    const ref = deps.db.getCredentialRef(safe.keyRefId)
    if (ref) {
      await deps.credentials.delete(ref.keychainAccount)
      deps.db.deleteCredentialRef(safe.keyRefId)
    }
    return { ok: true as const }
  })
  ipcMain.handle('credentials:get', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['credentials:get'], payload)
    const providerSettings = deps.db.getProviderSetting(safe.provider)
    if (!providerSettings?.credentialRefId) {
      return { key: null as null }
    }

    const ref = deps.db.getCredentialRef(providerSettings.credentialRefId)
    if (!ref) {
      return { key: null as null }
    }

    const key = await deps.credentials.get(ref)
    return { key }
  })

  ipcMain.handle('projects:createFromFile', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['projects:createFromFile'], payload)
    return deps.projects.createFromFile(safe.path, safe.importOptions?.name)
  })

  ipcMain.handle('projects:list', async () => deps.projects.listProjects())
  ipcMain.handle('projects:delete', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['projects:delete'], payload)
    await deps.projects.deleteProject(safe.projectId)
    return { ok: true as const }
  })
  ipcMain.handle('files:pickImport', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Book files', extensions: ['epub', 'pdf'] }
      ]
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    return result.filePaths[0] ?? null
  })
  ipcMain.handle('files:pickExportPath', async (_event, payload) => {
    const safe = validate(pickExportPathPayloadSchema, payload)
    const now = new Date().toISOString().replaceAll(':', '-')
    const defaultName = `${now}-${safe.projectName}.${safe.outputFormat}`

    const result = await dialog.showSaveDialog({
      title: 'Choose export location',
      defaultPath: defaultName,
      filters: [
        { name: safe.outputFormat.toUpperCase(), extensions: [safe.outputFormat] }
      ]
    })

    if (result.canceled || !result.filePath) {
      return null
    }

    return result.filePath
  })

  ipcMain.handle('projects:open', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['projects:open'], payload)
    return deps.projects.openProject(safe.projectId)
  })

  ipcMain.handle('translation:start', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['translation:start'], payload)
    await deps.jobs.start(safe.projectId, safe.runConfig)
    return { ok: true as const }
  })

  ipcMain.handle('translation:pause', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['translation:pause'], payload)
    await deps.jobs.pause(safe.projectId)
    return { ok: true as const }
  })

  ipcMain.handle('translation:resume', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['translation:resume'], payload)
    await deps.jobs.resume(safe.projectId)
    return { ok: true as const }
  })

  ipcMain.handle('translation:stop', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['translation:stop'], payload)
    await deps.jobs.stop(safe.projectId)
    return { ok: true as const }
  })

  ipcMain.handle('translation:retryParagraph', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['translation:retryParagraph'], payload)
    await deps.jobs.retryParagraph(safe.projectId, safe.paragraphId)
    return { ok: true as const }
  })

  ipcMain.handle('translation:alternativeParagraph', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['translation:alternativeParagraph'], payload)
    await deps.jobs.alternativeParagraph(safe.projectId, safe.paragraphId)
    return { ok: true as const }
  })

  ipcMain.handle('editor:listParagraphs', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['editor:listParagraphs'], payload)
    return deps.db.listParagraphs(safe.projectId, safe.sectionId)
  })

  ipcMain.handle('editor:updateParagraph', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['editor:updateParagraph'], payload)
    return deps.db.updateParagraph(safe.projectId, safe.paragraphId, safe.patch)
  })

  ipcMain.handle('editor:splitParagraph', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['editor:splitParagraph'], payload)
    const result = deps.db.splitParagraph(safe.projectId, safe.paragraphId, safe.splitIndex)
    return [...result]
  })

  ipcMain.handle('editor:mergeParagraph', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['editor:mergeParagraph'], payload)
    return deps.db.mergeParagraphs(safe.projectId, safe.firstParagraphId, safe.secondParagraphId)
  })

  ipcMain.handle('export:start', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['export:start'], payload)
    const outputPath = await deps.exports.start(safe.projectId, safe.exportProfileId)
    return { outputPath }
  })
  ipcMain.handle('export:startWithPath', async (_event, payload) => {
    const safe = validate(exportStartWithPathSchema, payload)
    const outputPath = await deps.exports.start(safe.projectId, safe.exportProfileId, safe.outputPath)
    return { outputPath }
  })

  ipcMain.handle('export:profiles:list', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['export:profiles:list'], payload)
    return deps.db.listExportProfiles(safe.projectId)
  })

  ipcMain.handle('export:profiles:upsert', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['export:profiles:upsert'], payload)
    return deps.db.upsertExportProfile(safe)
  })

  ipcMain.handle('jobs:getState', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['jobs:getState'], payload)
    return deps.jobs.getState(safe.projectId)
  })

  ipcMain.handle('errors:list', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['errors:list'], payload)
    return deps.db.listErrors(safe.projectId)
  })

  ipcMain.handle('errors:resolve', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['errors:resolve'], payload)
    deps.db.resolveError(safe.errorId)
    return { ok: true as const }
  })

  ipcMain.handle('errors:delete', async (_event, payload) => {
    const safe = validate(ApiContractSchemas['errors:delete'], payload)
    deps.db.deleteError(safe.errorId)
    return { ok: true as const }
  })
}

