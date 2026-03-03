import path from 'node:path'
import fs from 'node:fs'
import * as electron from 'electron'
import { AppDatabase, buildRuntimePaths, ensureRuntimePaths } from '@mtn/storage'
import { registerIpc } from './ipc/register-ipc'
import { TranslationJobOrchestrator } from './jobs/job-orchestrator'
import { createMainWindow } from './security/create-window'
import { CredentialService } from './services/credential-service'
import { ExportService } from './services/export-service'
import { createLogger } from './services/logger'
import { ProjectService } from './services/project-service'
import { ProviderRegistry } from './services/provider-registry'

let database: AppDatabase | null = null
const { app, BrowserWindow } = electron

// Keep scrollbars CSS-stylable across Windows builds by disabling Chromium overlay scrollbars.
app.commandLine.appendSwitch('disable-features', 'OverlayScrollbar')

async function bootstrap(): Promise<void> {
  const runtimePaths = buildRuntimePaths(app.getPath('userData'))
  ensureRuntimePaths(runtimePaths)

  const logger = createLogger(runtimePaths.logsDir)
  logger.info({ root: runtimePaths.root }, 'App bootstrap start')

  database = new AppDatabase(runtimePaths.dbPath)

  const credentials = new CredentialService()
  const providers = new ProviderRegistry()
  const projectService = new ProjectService(database, runtimePaths.projectsDir)
  const exportService = new ExportService(database, runtimePaths.projectsDir)
  const jobs = new TranslationJobOrchestrator(database, credentials, providers, logger)

  registerIpc({
    db: database,
    credentials,
    providers,
    projects: projectService,
    exports: exportService,
    jobs
  })

  const preloadCandidates = [
    path.join(__dirname, '../preload/index.cjs'),
    path.join(__dirname, '../preload/index.js'),
    path.join(__dirname, '../preload/index.mjs')
  ]
  const preload = preloadCandidates.find((candidate) => fs.existsSync(candidate)) ?? preloadCandidates[0]
  const window = createMainWindow(preload)

  if (process.env.ELECTRON_RENDERER_URL) {
    await window.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    await window.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  logger.info('App bootstrap complete')
}

app.whenReady().then(() => {
  void bootstrap()

  app.on('activate', () => {
    if (process.platform === 'darwin' && BrowserWindow.getAllWindows().length === 0) {
      void bootstrap()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  database?.close()
  database = null
})

