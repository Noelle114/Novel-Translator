import { EventEmitter } from 'node:events'
import PQueue from 'p-queue'
import {
  glossaryToPromptLines,
  mergeGlossary,
  normalizeProviderError
} from '@mtn/domain'
import {
  ErrorStateSchema,
  TranslationStateSchema,
  type ErrorState,
  type Paragraph,
  type ProviderId
} from '@mtn/shared'
import { AppDatabase } from '@mtn/storage'
import { CredentialService } from '../services/credential-service'
import { ProviderRegistry } from '../services/provider-registry'

const PQueueCtor = (PQueue as unknown as { default?: typeof PQueue }).default ?? PQueue

type RunConfig = {
  providerId: ProviderId
  modelId: string
  mode: 'independent' | 'contextual'
  contextWindow: number
  retryCount: number
  timeoutMs: number
  temperature?: number
  glossaryMergeBehavior: 'project_over_global' | 'global_over_project'
}

type ActiveRun = {
  runId: string
  projectId: string
  config: RunConfig
  paused: boolean
  stopped: boolean
  queue: PQueue
}

export type JobEvent =
  | { type: 'state'; projectId: string; runId: string; state: string; progress: number }
  | { type: 'error'; projectId: string; error: ErrorState }

export class TranslationJobOrchestrator extends EventEmitter {
  private activeRun: ActiveRun | null = null

  constructor(
    private readonly db: AppDatabase,
    private readonly credentials: CredentialService,
    private readonly providers: ProviderRegistry,
    private readonly logger: { info: (...args: any[]) => void; error: (...args: any[]) => void }
  ) {
    super()
  }

  getState(projectId: string): { projectId: string; state: string; progress: number } {
    const latest = this.db.getLatestRun(projectId)
    if (!latest) {
      return { projectId, state: 'idle', progress: 0 }
    }

    return {
      projectId,
      state: latest.status,
      progress: latest.progress
    }
  }

  async start(projectId: string, config: RunConfig): Promise<void> {
    const lock = this.db.getJobLock()
    if (lock.projectId && lock.projectId !== projectId && lock.state && ['translating', 'paused', 'paused_error_waiting_user'].includes(lock.state)) {
      throw new Error('Another project is currently active. Only one active translation job is allowed.')
    }

    if (this.activeRun && this.activeRun.projectId === projectId) {
      throw new Error('Project already has an active run in memory')
    }

    const runId = crypto.randomUUID()
    const run = TranslationStateSchema.parse({
      projectId,
      runId,
      providerId: config.providerId,
      modelId: config.modelId,
      mode: config.mode,
      contextWindow: config.contextWindow,
      progress: 0,
      active: true,
      startedAt: new Date().toISOString(),
      pausedAt: null,
      completedAt: null,
      status: 'translating'
    })

    this.db.setRunState(run)
    this.db.setJobLock(projectId, runId, 'translating')

    this.activeRun = {
      runId,
      projectId,
      config,
      paused: false,
      stopped: false,
      queue: new PQueueCtor({ concurrency: 1 })
    }

    this.emitEvent({
      type: 'state',
      projectId,
      runId,
      state: 'translating',
      progress: 0
    })

    void this.processActiveRun()
  }

  async pause(projectId: string): Promise<void> {
    if (!this.activeRun || this.activeRun.projectId !== projectId) {
      return
    }

    this.activeRun.paused = true
    const latest = this.db.getLatestRun(projectId)
    if (!latest) {
      return
    }

    this.db.setRunState({
      ...latest,
      active: false,
      status: 'paused',
      pausedAt: new Date().toISOString()
    })
    this.db.setJobLock(projectId, latest.runId, 'paused')

    this.emitEvent({
      type: 'state',
      projectId,
      runId: latest.runId,
      state: 'paused',
      progress: latest.progress
    })
  }

  async resume(projectId: string): Promise<void> {
    if (!this.activeRun || this.activeRun.projectId !== projectId) {
      throw new Error('No in-memory paused run to resume. Restart-based recovery is planned for next iteration.')
    }

    this.activeRun.paused = false
    const latest = this.db.getLatestRun(projectId)
    if (!latest) {
      return
    }

    this.db.setRunState({
      ...latest,
      active: true,
      status: 'translating',
      pausedAt: null
    })
    this.db.setJobLock(projectId, latest.runId, 'translating')

    this.emitEvent({
      type: 'state',
      projectId,
      runId: latest.runId,
      state: 'translating',
      progress: latest.progress
    })

    void this.processActiveRun()
  }

  async stop(projectId: string): Promise<void> {
    if (!this.activeRun || this.activeRun.projectId !== projectId) {
      return
    }

    this.activeRun.stopped = true
    this.activeRun.paused = false
    await this.activeRun.queue.onIdle()

    const latest = this.db.getLatestRun(projectId)
    if (latest) {
      this.db.setRunState({
        ...latest,
        active: false,
        status: 'cancelled',
        completedAt: new Date().toISOString()
      })
      this.emitEvent({
        type: 'state',
        projectId,
        runId: latest.runId,
        state: 'cancelled',
        progress: latest.progress
      })
    }

    this.db.setJobLock(null, null, 'idle')
    this.activeRun = null
  }

  async retryParagraph(projectId: string, paragraphId: string): Promise<void> {
    const latest = this.db.getLatestRun(projectId)
    if (!latest) {
      throw new Error('No run found for retry')
    }

    const runConfig = this.activeRun?.config ?? {
      providerId: latest.providerId,
      modelId: latest.modelId,
      mode: latest.mode,
      contextWindow: latest.contextWindow,
      retryCount: 2,
      timeoutMs: 30000,
      glossaryMergeBehavior: 'project_over_global' as const
    }

    await this.translateSingleParagraph(projectId, paragraphId, latest.runId, runConfig)
  }

  async alternativeParagraph(projectId: string, paragraphId: string): Promise<void> {
    await this.retryParagraph(projectId, paragraphId)
  }

  private async processActiveRun(): Promise<void> {
    const run = this.activeRun
    if (!run) {
      return
    }

    const paragraphs = this.db.listParagraphs(run.projectId)
    const total = paragraphs.filter((paragraph) => !paragraph.isLocked && !paragraph.isSkipped).length
    if (total === 0) {
      await this.completeRun(run.projectId, run.runId)
      return
    }

    let processed = paragraphs.filter((paragraph) => ['translated', 'edited', 'approved'].includes(paragraph.state)).length

    for (const paragraph of paragraphs) {
      if (!this.activeRun || this.activeRun.runId !== run.runId) {
        return
      }

      if (this.activeRun.stopped) {
        return
      }

      while (this.activeRun.paused) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        if (!this.activeRun || this.activeRun.stopped) {
          return
        }
      }

      if (paragraph.isLocked || paragraph.isSkipped || ['translated', 'edited', 'approved'].includes(paragraph.state)) {
        continue
      }

      await this.activeRun.queue.add(async () => {
        this.db.updateParagraph(run.projectId, paragraph.id, { state: 'translating' })
        await this.translateSingleParagraph(run.projectId, paragraph.id, run.runId, run.config)

        processed += 1
        const progress = Math.min(processed / total, 1)
        const latest = this.db.getLatestRun(run.projectId)
        if (latest) {
          this.db.setRunState({
            ...latest,
            progress,
            status: 'translating',
            active: true
          })
        }

        this.emitEvent({
          type: 'state',
          projectId: run.projectId,
          runId: run.runId,
          state: 'translating',
          progress
        })
      })

      if (!this.activeRun || this.activeRun.paused || this.activeRun.stopped) {
        return
      }
    }

    await run.queue.onIdle()
    if (!this.activeRun || this.activeRun.paused || this.activeRun.stopped) {
      return
    }

    await this.completeRun(run.projectId, run.runId)
  }

  private async completeRun(projectId: string, runId: string): Promise<void> {
    const latest = this.db.getLatestRun(projectId)
    if (!latest) {
      return
    }

    this.db.setRunState({
      ...latest,
      status: 'completed',
      active: false,
      progress: 1,
      completedAt: new Date().toISOString()
    })
    this.db.setJobLock(null, null, 'idle')

    this.emitEvent({
      type: 'state',
      projectId,
      runId,
      state: 'completed',
      progress: 1
    })

    this.activeRun = null
  }

  private async translateSingleParagraph(projectId: string, paragraphId: string, runId: string, config: RunConfig): Promise<void> {
    const paragraph = this.db.getParagraph(projectId, paragraphId)
    if (!paragraph) {
      throw new Error('Paragraph not found')
    }

    const providerSetting = this.db.getProviderSetting(config.providerId)
    if (!providerSetting?.credentialRefId) {
      await this.pauseByError(projectId, runId, paragraph, config, new Error('No credential configured for selected provider'))
      return
    }

    const credentialRef = this.db.getCredentialRef(providerSetting.credentialRefId)
    if (!credentialRef) {
      await this.pauseByError(projectId, runId, paragraph, config, new Error('Credential reference not found'))
      return
    }

    const apiKey = await this.credentials.get(credentialRef)
    if (!apiKey) {
      await this.pauseByError(projectId, runId, paragraph, config, new Error('API key not found in keychain'))
      return
    }

    const adapter = this.providers.get(config.providerId)
    const allParagraphs = this.db.listParagraphs(projectId)
    const contextParagraphs = this.buildContextParagraphs(allParagraphs, paragraph, config)

    const globalGlossary = this.db.listGlobalGlossary()
    const projectGlossary = this.db.listProjectGlossary(projectId)
    const mergedGlossary = mergeGlossary(globalGlossary, projectGlossary, config.glossaryMergeBehavior)

    try {
      const response = await adapter.translate({
        providerId: config.providerId,
        modelId: config.modelId,
        sourceText: paragraph.sourceText,
        sourceLanguage: 'en',
        targetLanguage: 'tr',
        contextParagraphs,
        glossaryLines: glossaryToPromptLines(mergedGlossary),
        apiKey,
        timeoutMs: config.timeoutMs,
        temperature: config.temperature
      })

      this.db.updateParagraph(projectId, paragraphId, {
        translationText: response.translatedText,
        state: 'translated',
        providerTrace: {
          providerId: config.providerId,
          modelId: config.modelId,
          runId,
          translatedAt: new Date().toISOString()
        }
      })
    } catch (error) {
      await this.pauseByError(projectId, runId, paragraph, config, error)
    }
  }

  private buildContextParagraphs(allParagraphs: Paragraph[], current: Paragraph, config: RunConfig): string[] {
    if (config.mode !== 'contextual' || config.contextWindow <= 0) {
      return []
    }

    const ordered = [...allParagraphs].sort((a, b) => a.index - b.index)
    const currentIndex = ordered.findIndex((item) => item.id === current.id)
    if (currentIndex <= 0) {
      return []
    }

    const start = Math.max(0, currentIndex - config.contextWindow)
    return ordered.slice(start, currentIndex).map((item) => item.sourceText)
  }

  private async pauseByError(
    projectId: string,
    runId: string,
    paragraph: Paragraph,
    config: RunConfig,
    error: unknown
  ): Promise<void> {
    const adapter = this.providers.get(config.providerId)
    const normalized = adapter
      ? adapter.normalizeError(error, config.modelId)
      : normalizeProviderError({ providerId: config.providerId, modelId: config.modelId, message: String(error) })

    const errorState = ErrorStateSchema.parse({
      id: crypto.randomUUID(),
      projectId,
      runId,
      scope: 'paragraph',
      providerId: config.providerId,
      modelId: config.modelId,
      chapterId: null,
      paragraphId: paragraph.id,
      errorType: normalized.errorType,
      httpStatus: normalized.httpStatus,
      rawCode: normalized.rawCode,
      normalizedMessage: normalized.normalizedMessage,
      probableCause: normalized.probableCause,
      recoverable: normalized.recoverable,
      userActionRequired: normalized.userActionRequired,
      createdAt: new Date().toISOString(),
      resolvedAt: null
    })

    this.db.addError(errorState)
    this.db.updateParagraph(projectId, paragraph.id, { state: 'error' })

    const latest = this.db.getLatestRun(projectId)
    if (latest) {
      this.db.setRunState({
        ...latest,
        active: false,
        status: 'paused_error_waiting_user',
        pausedAt: new Date().toISOString()
      })
    }

    this.db.setJobLock(projectId, runId, 'paused_error_waiting_user')

    if (this.activeRun && this.activeRun.projectId === projectId) {
      this.activeRun.paused = true
    }

    this.emitEvent({
      type: 'error',
      projectId,
      error: errorState
    })
    this.emitEvent({
      type: 'state',
      projectId,
      runId,
      state: 'paused_error_waiting_user',
      progress: latest?.progress ?? 0
    })

    this.logger.error({ projectId, paragraphId: paragraph.id, error: normalized }, 'Paragraph translation failed')
  }

  private emitEvent(event: JobEvent): void {
    this.emit('event', event)
  }
}

