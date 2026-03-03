import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react'
import {
  type AppSettings,
  type ErrorState,
  type ExportProfile,
  type Paragraph,
  type ProjectMetadata,
  type ProviderSettings
} from '@mtn/shared'
import { localizeState, translations, type AppLanguage, type AppTheme } from '../i18n'
import { toast } from 'sonner'
import type { RendererViewModel } from './types'



type JobState = {
  state: string
  progress: number
}

type TranslationForm = {
  providerId: 'openai' | 'gemini' | 'deepl'
  modelId: string
  mode: 'independent' | 'contextual'
  contextWindow: number
  retryCount: number
  timeoutMs: number
  temperature?: number
  glossaryMergeBehavior: 'project_over_global' | 'global_over_project'
}

type ProviderId = TranslationForm['providerId']

type ProviderDraft = {
  model: string
  timeoutMs: number
  retryCount: number
  temperature: number
  credentialLabel: string
  apiKey: string
}

type ProviderModelInfo = {
  id: string
  name: string
}

type AppTab = 'library' | 'workspace' | 'settings'

type ImportFeedback = {
  type: 'success' | 'error'
  message: string
}

const initialTranslationForm: TranslationForm = {
  providerId: 'openai',
  modelId: 'gpt-4.1-mini',
  mode: 'contextual',
  contextWindow: 2,
  retryCount: 2,
  timeoutMs: 30000,
  temperature: 0.2,
  glossaryMergeBehavior: 'project_over_global'
}

const providerIds: ProviderId[] = ['openai', 'gemini', 'deepl']

const providerCatalog: Record<ProviderId, { label: string; defaultModel: string; modelSuggestions: string[] }> = {
  openai: {
    label: 'OpenAI',
    defaultModel: 'gpt-4.1-mini',
    modelSuggestions: ['gpt-4.1-mini', 'gpt-4.1', 'gpt-4o-mini']
  },
  gemini: {
    label: 'Gemini',
    defaultModel: 'gemini-2.0-flash',
    modelSuggestions: ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro']
  },
  deepl: {
    label: 'DeepL',
    defaultModel: 'deepl-default',
    modelSuggestions: ['deepl-default']
  }
}

const appTabs: AppTab[] = ['library', 'workspace', 'settings']
const paragraphStateValues = ['pending', 'translating', 'translated', 'edited', 'approved', 'locked', 'skipped', 'unresolved', 'error']

function createDefaultProviderDraft(providerId: ProviderId): ProviderDraft {
  return {
    model: providerCatalog[providerId].defaultModel,
    timeoutMs: 30000,
    retryCount: 2,
    temperature: 0.2,
    credentialLabel: 'Default',
    apiKey: ''
  }
}

function mapProvidersById(providerList: ProviderSettings[]): Partial<Record<ProviderId, ProviderSettings>> {
  const mapped: Partial<Record<ProviderId, ProviderSettings>> = {}
  for (const provider of providerList) {
    mapped[provider.providerId] = provider
  }
  return mapped
}

function buildProviderDrafts(providerList: ProviderSettings[]): Record<ProviderId, ProviderDraft> {
  const mappedProviders = mapProvidersById(providerList)
  return {
    openai: mappedProviders.openai
      ? {
          ...createDefaultProviderDraft('openai'),
          model: mappedProviders.openai.defaultModel,
          timeoutMs: mappedProviders.openai.timeoutMs,
          retryCount: mappedProviders.openai.retryCount,
          temperature: mappedProviders.openai.temperature ?? 0.2
        }
      : createDefaultProviderDraft('openai'),
    gemini: mappedProviders.gemini
      ? {
          ...createDefaultProviderDraft('gemini'),
          model: mappedProviders.gemini.defaultModel,
          timeoutMs: mappedProviders.gemini.timeoutMs,
          retryCount: mappedProviders.gemini.retryCount,
          temperature: mappedProviders.gemini.temperature ?? 0.2
        }
      : createDefaultProviderDraft('gemini'),
    deepl: mappedProviders.deepl
      ? {
          ...createDefaultProviderDraft('deepl'),
          model: mappedProviders.deepl.defaultModel,
          timeoutMs: mappedProviders.deepl.timeoutMs,
          retryCount: mappedProviders.deepl.retryCount,
          temperature: mappedProviders.deepl.temperature ?? 0.2
        }
      : createDefaultProviderDraft('deepl')
  }
}

function getDefaultModelOptions(providerId: ProviderId): ProviderModelInfo[] {
  return providerCatalog[providerId].modelSuggestions.map((modelId) => ({ id: modelId, name: modelId }))
}

function mergeModelOptions(
  providerId: ProviderId,
  primary: ProviderModelInfo[],
  extraModelIds: string[] = []
): ProviderModelInfo[] {
  const deduped = new Map<string, ProviderModelInfo>()
  for (const model of primary) {
    const trimmed = model.id.trim()
    if (!trimmed) {
      continue
    }
    deduped.set(trimmed, { id: trimmed, name: model.name || trimmed })
  }

  for (const modelId of extraModelIds) {
    const trimmed = modelId.trim()
    if (!trimmed) {
      continue
    }
    if (!deduped.has(trimmed)) {
      deduped.set(trimmed, { id: trimmed, name: trimmed })
    }
  }

  const merged = [...deduped.values()]
  if (merged.length > 0) {
    return merged
  }
  return getDefaultModelOptions(providerId)
}

function buildProviderModelOptions(providerList: ProviderSettings[]): Record<ProviderId, ProviderModelInfo[]> {
  const mappedProviders = mapProvidersById(providerList)
  return {
    openai: mergeModelOptions('openai', getDefaultModelOptions('openai'), [mappedProviders.openai?.defaultModel ?? '']),
    gemini: mergeModelOptions('gemini', getDefaultModelOptions('gemini'), [mappedProviders.gemini?.defaultModel ?? '']),
    deepl: mergeModelOptions('deepl', getDefaultModelOptions('deepl'), [mappedProviders.deepl?.defaultModel ?? ''])
  }
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function ensureNonEmpty(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim() ?? ''
  return trimmed.length > 0 ? trimmed : fallback
}

function hasSupportedImportExtension(filePath: string): boolean {
  const lowered = filePath.toLowerCase()
  return lowered.endsWith('.epub') || lowered.endsWith('.pdf')
}

function deriveProjectName(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/')
  const fileName = normalized.split('/').pop() ?? filePath
  return fileName.replace(/\.[^/.]+$/, '')
}

function extractFilePath(file: File): string | null {
  const withNativePath = file as File & { path?: string }
  return typeof withNativePath.path === 'string' ? withNativePath.path : null
}

function resolveInitialLanguage(): AppLanguage {
  try {
    const stored = window.localStorage.getItem('mtn.language')
    return stored === 'en' || stored === 'tr' ? stored : 'tr'
  } catch {
    return 'tr'
  }
}

function resolveInitialTheme(): AppTheme {
  try {
    const stored = window.localStorage.getItem('mtn.theme')
    return stored === 'light' || stored === 'dark' ? stored : 'dark'
  } catch {
    return 'dark'
  }
}
export function useRendererViewModel(): RendererViewModel {


  const [activeTab, setActiveTab] = useState<AppTab>('library')
  const [language, setLanguage] = useState<AppLanguage>(() => resolveInitialLanguage())
  const [theme, setTheme] = useState<AppTheme>(() => resolveInitialTheme())
  const text = translations[language]

  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [providers, setProviders] = useState<ProviderSettings[]>([])
  const [projects, setProjects] = useState<ProjectMetadata[]>([])
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([])
  const [paragraphDrafts, setParagraphDrafts] = useState<Record<string, string>>({})
  const [jobState, setJobState] = useState<JobState>({ state: 'idle', progress: 0 })
  const [errors, setErrors] = useState<ErrorState[]>([])
  const [translationForm, setTranslationForm] = useState<TranslationForm>(initialTranslationForm)

  const [importPath, setImportPath] = useState('')
  const [importName, setImportName] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [isDeletingProject, setIsDeletingProject] = useState(false)
  const [isDropActive, setIsDropActive] = useState(false)
  const [importFeedback, setImportFeedback] = useState<ImportFeedback | null>(null)
  const [projectPendingDelete, setProjectPendingDelete] = useState<ProjectMetadata | null>(null)

  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState<string>('all')
  const [splitIndexes, setSplitIndexes] = useState<Record<string, string>>({})
  const [isRunActionBusy, setIsRunActionBusy] = useState(false)

  const [selectedSettingsProvider, setSelectedSettingsProvider] = useState<ProviderId>('openai')
  const [providerDrafts, setProviderDrafts] = useState<Record<ProviderId, ProviderDraft>>({
    openai: createDefaultProviderDraft('openai'),
    gemini: createDefaultProviderDraft('gemini'),
    deepl: createDefaultProviderDraft('deepl')
  })
  const [providerModelOptions, setProviderModelOptions] = useState<Record<ProviderId, ProviderModelInfo[]>>({
    openai: getDefaultModelOptions('openai'),
    gemini: getDefaultModelOptions('gemini'),
    deepl: getDefaultModelOptions('deepl')
  })
  const [providerModelLoadState, setProviderModelLoadState] = useState<Record<ProviderId, boolean>>({
    openai: false,
    gemini: false,
    deepl: false
  })
  const [providerSaveLoadState, setProviderSaveLoadState] = useState<Record<ProviderId, boolean>>({
    openai: false,
    gemini: false,
    deepl: false
  })
  const [providerNotice, setProviderNotice] = useState<Record<ProviderId, ImportFeedback | null>>({
    openai: null,
    gemini: null,
    deepl: null
  })

  const [exportProfile, setExportProfile] = useState<ExportProfile>({
    id: crypto.randomUUID(),
    projectId: null,
    name: text.exportDefaultName,
    outputFormat: 'epub',
    layout: 'single',
    fontFamily: 'Literata',
    fontSize: 12,
    textColor: '#1b1f23',
    sourceTextColor: '#4b5563',
    translatedTextColor: '#0f172a',
    backgroundColor: '#ffffff',
    paragraphSpacing: 8,
    margins: { top: 36, right: 36, bottom: 36, left: 36 },
    headingStyles: {},
    tocOptions: {},
    includeImages: true,
    includeMetadata: true,
    createdAt: new Date().toISOString()
  })
  const [isExportPanelOpen, setIsExportPanelOpen] = useState(false)
  const [exportDestinationPath, setExportDestinationPath] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const jobStateRef = useRef<JobState>({ state: 'idle', progress: 0 })

  const currentProject = useMemo(
    () => projects.find((project) => project.id === currentProjectId) ?? null,
    [projects, currentProjectId]
  )

  const providersById = useMemo(() => mapProvidersById(providers), [providers])
  const selectedProviderDraft = providerDrafts[selectedSettingsProvider]
  const selectedProviderModels = providerModelOptions[selectedSettingsProvider]
  const runProviderModels = providerModelOptions[translationForm.providerId]
  const selectedProviderSavedConfig = providersById[selectedSettingsProvider] ?? null
  const selectedProviderNotice = providerNotice[selectedSettingsProvider]
  const isRunTranslating = jobState.state === 'translating'
  const isRunPaused = jobState.state === 'paused' || jobState.state === 'paused_error_waiting_user'
  const canStartRun = !!currentProjectId && !isRunActionBusy && !isRunTranslating
  const canPauseRun = !!currentProjectId && !isRunActionBusy && isRunTranslating
  const canResumeRun = !!currentProjectId && !isRunActionBusy && isRunPaused
  const canStopRun = !!currentProjectId && !isRunActionBusy && (isRunTranslating || isRunPaused)
  const localizedJobState = localizeState(language, jobState.state)

  const filteredParagraphs = useMemo(() => {
    return paragraphs.filter((paragraph) => {
      const bySearch =
        search.length === 0 ||
        paragraph.sourceText.toLowerCase().includes(search.toLowerCase()) ||
        paragraph.translationText.toLowerCase().includes(search.toLowerCase())

      const byState = stateFilter === 'all' || paragraph.state === stateFilter
      return bySearch && byState
    })
  }, [paragraphs, search, stateFilter])

  const translateState = (state: string) => localizeState(language, state)

  useEffect(() => {
    try {
      window.localStorage.setItem('mtn.language', language)
    } catch {
      // no-op
    }
  }, [language])

  useEffect(() => {
    try {
      window.localStorage.setItem('mtn.theme', theme)
    } catch {
      // no-op
    }
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    void bootstrap()
  }, [])

  useEffect(() => {
    if (!currentProjectId) {
      return
    }

    const unsubscribe = window.api.jobs.subscribe(currentProjectId, (event) => {
      if (event.type === 'state') {
        const previousState = jobStateRef.current.state
        jobStateRef.current = { state: event.state, progress: event.progress }
        setJobState({ state: event.state, progress: event.progress })
        if (event.state === 'completed') {
          void refreshParagraphs(currentProjectId)
        }
        if (event.state !== previousState) {
          if (event.state === 'translating') {
            toast.success(text.toastTranslationStarted)
          } else if (event.state === 'paused') {
            toast.message(text.toastTranslationPaused)
          } else if (event.state === 'paused_error_waiting_user') {
            toast.error(text.toastTranslationPausedError)
          } else if (event.state === 'completed') {
            toast.success(text.toastTranslationCompleted)
          } else if (event.state === 'cancelled') {
            toast.message(text.toastTranslationStopped)
          }
        }
      }
      if (event.type === 'error') {
        setErrors((prev) => [event.error, ...prev])
        toast.error(event.error.errorType, {
          description: event.error.normalizedMessage
        })
      }
    })

    return unsubscribe
  }, [currentProjectId, text])

  async function bootstrap() {
    const [nextSettings, nextProviders, nextProjects] = await Promise.all([
      window.api.settings.get(),
      window.api.settings.listProviders(),
      window.api.projects.list()
    ])

    const nextProviderDrafts = buildProviderDrafts(nextProviders)
    const restoredKeys = await Promise.all(
      providerIds.map(async (providerId) => {
        const response = (await window.api.credentials.get({ provider: providerId })) as { key: string | null }
        return [providerId, response.key ?? ''] as const
      })
    )
    for (const [providerId, key] of restoredKeys) {
      nextProviderDrafts[providerId].apiKey = key
    }
    const nextProvidersById = mapProvidersById(nextProviders)
    const nextProviderModelOptions = buildProviderModelOptions(nextProviders)

    setSettings(nextSettings)
    setProviders(nextProviders)
    setProviderDrafts(nextProviderDrafts)
    setProviderModelOptions(nextProviderModelOptions)
    setProjects(nextProjects)
    setTranslationForm((prev) => ({
      ...prev,
      modelId: nextProvidersById[prev.providerId]?.defaultModel ?? nextProviderDrafts[prev.providerId].model,
      timeoutMs: nextProvidersById[prev.providerId]?.timeoutMs ?? nextProviderDrafts[prev.providerId].timeoutMs,
      retryCount: nextProvidersById[prev.providerId]?.retryCount ?? nextProviderDrafts[prev.providerId].retryCount,
      temperature: nextProvidersById[prev.providerId]?.temperature ?? nextProviderDrafts[prev.providerId].temperature,
      contextWindow: nextSettings?.technicalDefaults.contextWindow ?? prev.contextWindow,
      glossaryMergeBehavior:
        nextSettings?.technicalDefaults.glossaryMergeBehavior ?? prev.glossaryMergeBehavior
    }))

    if (nextSettings?.activeProjectId) {
      await openProject(nextSettings.activeProjectId)
    }
  }

  async function openProject(projectId: string) {
    const opened = await window.api.projects.open({ projectId })
    setCurrentProjectId(projectId)
    setExportDestinationPath('')
    setIsExportPanelOpen(false)
    setParagraphs(opened.paragraphs)
    setParagraphDrafts(Object.fromEntries(opened.paragraphs.map((entry: Paragraph) => [entry.id, entry.translationText])))
    const [state, projectErrors] = await Promise.all([
      window.api.jobs.getState({ projectId }),
      window.api.errors.list({ projectId })
    ])

    jobStateRef.current = state
    setJobState(state)
    setErrors(projectErrors)
  }

  async function openProjectFromLibrary(projectId: string) {
    await openProject(projectId)
    setActiveTab('workspace')
  }

  async function handleConfirmDeleteProject(project: ProjectMetadata) {
    setIsDeletingProject(true)
    try {
      await window.api.projects.delete({ projectId: project.id })
      setProjects((prev) => prev.filter((entry) => entry.id !== project.id))

      if (currentProjectId === project.id) {
        setCurrentProjectId(null)
        setParagraphs([])
        setParagraphDrafts({})
        setErrors([])
        setJobState({ state: 'idle', progress: 0 })
        setActiveTab('library')
      }

      toast.success(text.toastProjectDeleted, { description: project.name })
      setProjectPendingDelete(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : text.toastProjectDeleteFailed
      toast.error(text.toastProjectDeleteFailed, { description: message })
    } finally {
      setIsDeletingProject(false)
    }
  }

  async function refreshProjects() {
    const nextProjects = await window.api.projects.list()
    setProjects(nextProjects)
  }

  async function refreshParagraphs(projectId: string) {
    const nextParagraphs = await window.api.editor.listParagraphs({ projectId })
    setParagraphs(nextParagraphs)
    setParagraphDrafts(Object.fromEntries(nextParagraphs.map((entry: Paragraph) => [entry.id, entry.translationText])))
  }

  function applyImportPath(rawPath: string): boolean {
    const normalizedPath = rawPath.trim()
    if (!normalizedPath || !hasSupportedImportExtension(normalizedPath)) {
      setImportFeedback({ type: 'error', message: text.feedbackOnlyPdfEpub })
      return false
    }

    setImportPath(normalizedPath)
    setImportName((prev) => (prev.trim().length > 0 ? prev : deriveProjectName(normalizedPath)))
    setImportFeedback(null)
    return true
  }

  async function handlePickImportFile() {
    const selectedPath = await window.api.files.pickImport()
    if (!selectedPath) {
      return
    }

    applyImportPath(selectedPath)
  }

  function handleDropZoneDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDropActive(true)
  }

  function handleDropZoneDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDropActive(false)
  }

  function handleDropZoneDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDropActive(false)

    const droppedFile = event.dataTransfer.files.item(0)
    if (!droppedFile) {
      setImportFeedback({ type: 'error', message: text.feedbackNoDropFile })
      return
    }

    const droppedPath = extractFilePath(droppedFile)
    if (!droppedPath) {
      setImportFeedback({ type: 'error', message: text.feedbackNoDropPath })
      return
    }

    applyImportPath(droppedPath)
  }

  function updateProviderDraft(providerId: ProviderId, patch: Partial<ProviderDraft>) {
    setProviderDrafts((prev) => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        ...patch
      }
    }))
    setProviderNotice((prev) => ({
      ...prev,
      [providerId]: null
    }))
  }

  function handleSelectTranslationProvider(providerId: ProviderId) {
    setSelectedSettingsProvider(providerId)
    const savedProvider = providersById[providerId]
    const providerDraft = providerDrafts[providerId]
    setTranslationForm((prev) => ({
      ...prev,
      providerId,
      modelId: savedProvider?.defaultModel ?? providerDraft.model,
      timeoutMs: savedProvider?.timeoutMs ?? providerDraft.timeoutMs,
      retryCount: savedProvider?.retryCount ?? providerDraft.retryCount,
      temperature: savedProvider?.temperature ?? providerDraft.temperature
    }))
  }

  async function handleFetchLatestModels(providerId: ProviderId) {
    const draft = providerDrafts[providerId]
    setProviderModelLoadState((prev) => ({ ...prev, [providerId]: true }))
    setProviderNotice((prev) => ({ ...prev, [providerId]: null }))

    try {
      const fetched = (await window.api.settings.listModels({
        providerId,
        apiKey: draft.apiKey.trim() || undefined
      })) as ProviderModelInfo[]

      const filtered = fetched.filter((model) => {
        if (!model?.id) {
          return false
        }
        if (providerId === 'openai') {
          return model.id.startsWith('gpt-') || /^o[1-9]/.test(model.id)
        }
        if (providerId === 'gemini') {
          return model.id.startsWith('gemini-')
        }
        return true
      })

      const merged = mergeModelOptions(
        providerId,
        filtered.length > 0 ? filtered : getDefaultModelOptions(providerId),
        [draft.model]
      )

      setProviderModelOptions((prev) => ({ ...prev, [providerId]: merged }))
      if (!merged.some((model) => model.id === draft.model)) {
        const firstModel = merged[0]?.id ?? providerCatalog[providerId].defaultModel
        setProviderDrafts((prev) => ({
          ...prev,
          [providerId]: { ...prev[providerId], model: firstModel }
        }))
        if (translationForm.providerId === providerId) {
          setTranslationForm((prev) => ({ ...prev, modelId: firstModel }))
        }
      }

      setProviderNotice((prev) => ({
        ...prev,
        [providerId]: {
          type: 'success',
          message:
            language === 'tr'
              ? `${providerCatalog[providerId].label} icin ${merged.length} model alindi.`
              : `Fetched ${merged.length} models from ${providerCatalog[providerId].label}.`
        }
      }))
      toast.success(
        language === 'tr'
          ? `${providerCatalog[providerId].label} modelleri guncellendi`
          : `${providerCatalog[providerId].label} models updated`,
        {
          description: language === 'tr' ? `${merged.length} model yuklendi` : `${merged.length} models loaded`
        }
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : text.feedbackFetchModelsFailed
      setProviderNotice((prev) => ({
        ...prev,
        [providerId]: { type: 'error', message }
      }))
      toast.error(text.toastModelFetchFailed, { description: message })
    } finally {
      setProviderModelLoadState((prev) => ({ ...prev, [providerId]: false }))
    }
  }

  async function handleSaveTechnicalSettings() {
    if (!settings) {
      return
    }

    const updated = await window.api.settings.updateTechnical(settings.technicalDefaults)
    setSettings(updated)
  }

  async function handleSaveProvider(providerId: ProviderId) {
    const draft = providerDrafts[providerId]
    const currentProviderSettings = providersById[providerId]
    const enteredApiKey = draft.apiKey.trim()
    const nextCredentialRefId =
      enteredApiKey.length > 0
        ? (currentProviderSettings?.credentialRefId ?? crypto.randomUUID())
        : currentProviderSettings?.credentialRefId

    setProviderSaveLoadState((prev) => ({ ...prev, [providerId]: true }))
    setProviderNotice((prev) => ({ ...prev, [providerId]: null }))

    try {
      const upserted = await window.api.settings.upsertProvider({
        providerId,
        defaultModel: draft.model,
        timeoutMs: Number(draft.timeoutMs),
        retryCount: Number(draft.retryCount),
        temperature: Number(draft.temperature),
        rateLimitPolicy: 'strict_pause',
        credentialRefId: nextCredentialRefId,
        updatedAt: new Date().toISOString()
      })

      if (enteredApiKey.length > 0 && nextCredentialRefId) {
        const keychainAccount = `${providerId}:default`
        await window.api.credentials.set({
          provider: providerId,
          keyRef: {
            id: nextCredentialRefId,
            providerId,
            label: draft.credentialLabel,
            keychainAccount,
            lastValidatedAt: null,
            status: 'unknown'
          },
          key: enteredApiKey
        })
      }

      setProviders((prev) => {
        const next = prev.filter((entry) => entry.providerId !== upserted.providerId)
        return [...next, upserted]
      })

      setProviderModelOptions((prev) => ({
        ...prev,
        [providerId]: mergeModelOptions(providerId, prev[providerId], [upserted.defaultModel])
      }))

      setTranslationForm((prev) => {
        if (prev.providerId !== upserted.providerId) {
          return prev
        }

        return {
          ...prev,
          modelId: upserted.defaultModel,
          timeoutMs: upserted.timeoutMs,
          retryCount: upserted.retryCount,
          temperature: upserted.temperature
        }
      })

      setProviderDrafts((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          model: upserted.defaultModel,
          timeoutMs: upserted.timeoutMs,
          retryCount: upserted.retryCount,
          temperature: upserted.temperature ?? prev[providerId].temperature
        }
      }))

      setProviderNotice((prev) => ({
        ...prev,
        [providerId]: {
          type: 'success',
          message: enteredApiKey.length > 0 ? text.feedbackSaveAndKey : text.feedbackSettingsSaved
        }
      }))
      toast.success(`${providerCatalog[providerId].label} ${language === 'tr' ? 'kaydedildi' : 'saved'}`, {
        description: enteredApiKey.length > 0 ? text.feedbackSettingsAndKeyStored : text.feedbackSettingsStored
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : text.feedbackProviderSaveFailed
      setProviderNotice((prev) => ({
        ...prev,
        [providerId]: { type: 'error', message }
      }))
      toast.error(text.toastProviderSaveFailed, { description: message })
    } finally {
      setProviderSaveLoadState((prev) => ({ ...prev, [providerId]: false }))
    }
  }

  async function handleCreateProject() {
    const sourcePath = importPath.trim()
    if (!hasSupportedImportExtension(sourcePath)) {
      setImportFeedback({ type: 'error', message: text.feedbackChooseEpubPdf })
      return
    }

    setIsImporting(true)
    setImportFeedback(null)
    try {
      const created = await window.api.projects.createFromFile({
        path: sourcePath,
        importOptions: {
          name: importName.trim() || undefined
        }
      })

      await refreshProjects()
      await openProject(created.id)
      setImportPath('')
      setImportName('')
      setImportFeedback({ type: 'success', message: text.feedbackImportOpened })
      setActiveTab('workspace')
      toast.success(text.toastImportCompleted)
    } catch (error) {
      const message = error instanceof Error ? error.message : text.feedbackImportFailed
      setImportFeedback({ type: 'error', message })
      toast.error(text.toastImportFailed, { description: message })
    } finally {
      setIsImporting(false)
    }
  }

  async function handleStartTranslation() {
    if (!currentProjectId) {
      toast.error(text.toastSelectProjectFirst)
      return
    }

    setIsRunActionBusy(true)
    try {
      await window.api.translation.start({
        projectId: currentProjectId,
        runConfig: {
          ...translationForm,
          contextWindow: Number(translationForm.contextWindow),
          retryCount: Number(translationForm.retryCount),
          timeoutMs: Number(translationForm.timeoutMs)
        }
      })
      const nextState = { state: 'translating', progress: jobStateRef.current.progress }
      jobStateRef.current = nextState
      setJobState(nextState)
      toast.success(text.toastRunActive)
    } catch (error) {
      const message = error instanceof Error ? error.message : text.toastStartFailed
      toast.error(text.toastStartFailed, { description: message })
    } finally {
      setIsRunActionBusy(false)
    }
  }

  async function handlePauseTranslation() {
    if (!currentProjectId) {
      toast.error(text.toastSelectProjectFirst)
      return
    }

    setIsRunActionBusy(true)
    try {
      await window.api.translation.pause({ projectId: currentProjectId })
      toast.message(text.toastPauseSent)
    } catch (error) {
      const message = error instanceof Error ? error.message : text.toastPauseFailed
      toast.error(text.toastPauseFailed, { description: message })
    } finally {
      setIsRunActionBusy(false)
    }
  }

  async function handleResumeTranslation() {
    if (!currentProjectId) {
      toast.error(text.toastSelectProjectFirst)
      return
    }

    setIsRunActionBusy(true)
    try {
      await window.api.translation.resume({ projectId: currentProjectId })
      toast.message(text.toastResumeSent)
    } catch (error) {
      const message = error instanceof Error ? error.message : text.toastResumeFailed
      toast.error(text.toastResumeFailed, { description: message })
    } finally {
      setIsRunActionBusy(false)
    }
  }

  async function handleStopTranslation() {
    if (!currentProjectId) {
      toast.error(text.toastSelectProjectFirst)
      return
    }

    setIsRunActionBusy(true)
    try {
      await window.api.translation.stop({ projectId: currentProjectId })
      const nextState = { state: 'cancelled', progress: jobStateRef.current.progress }
      jobStateRef.current = nextState
      setJobState(nextState)
      toast.message(text.toastStopSent)
    } catch (error) {
      const message = error instanceof Error ? error.message : text.toastStopFailed
      toast.error(text.toastStopFailed, { description: message })
    } finally {
      setIsRunActionBusy(false)
    }
  }

  async function updateParagraph(paragraphId: string, patch: Record<string, unknown>) {
    if (!currentProjectId) {
      return
    }

    const updated = await window.api.editor.updateParagraph({
      projectId: currentProjectId,
      paragraphId,
      patch
    })

    setParagraphs((prev) => prev.map((entry) => (entry.id === updated.id ? updated : entry)))
    setParagraphDrafts((prev) => ({ ...prev, [paragraphId]: updated.translationText }))
  }

  async function splitParagraph(paragraphId: string) {
    if (!currentProjectId) {
      return
    }

    const raw = splitIndexes[paragraphId]
    const splitIndex = Number(raw)
    if (!splitIndex || splitIndex < 1) {
      return
    }

    await window.api.editor.splitParagraph({
      projectId: currentProjectId,
      paragraphId,
      splitIndex
    })

    await refreshParagraphs(currentProjectId)
  }

  async function mergeWithNext(paragraphId: string) {
    if (!currentProjectId) {
      return
    }

    const ordered = [...paragraphs].sort((a, b) => a.index - b.index)
    const currentIndex = ordered.findIndex((entry) => entry.id === paragraphId)
    if (currentIndex < 0 || currentIndex === ordered.length - 1) {
      return
    }

    const secondParagraphId = ordered[currentIndex + 1]?.id
    if (!secondParagraphId) {
      return
    }

    await window.api.editor.mergeParagraph({
      projectId: currentProjectId,
      firstParagraphId: paragraphId,
      secondParagraphId
    })

    await refreshParagraphs(currentProjectId)
  }

  async function runRetry(paragraphId: string, alternative: boolean) {
    if (!currentProjectId) {
      return
    }

    if (alternative) {
      await window.api.translation.alternativeParagraph({
        projectId: currentProjectId,
        paragraphId,
        sameModel: true
      })
    } else {
      await window.api.translation.retryParagraph({
        projectId: currentProjectId,
        paragraphId,
        sameModel: true
      })
    }

    await refreshParagraphs(currentProjectId)
  }

  function handleOpenExportWizard() {
    if (!currentProject) {
      toast.error(text.toastSelectProjectFirst)
      return
    }
    setIsExportPanelOpen(true)
    toast.message(text.toastExportCustomizationOpened)
  }

  function handleCloseExportWizard() {
    setIsExportPanelOpen(false)
  }

  async function handlePickExportDestination() {
    if (!currentProject) {
      toast.error(text.toastSelectProjectFirst)
      return
    }

    const selectedPath = await window.api.files.pickExportPath({
      projectName: currentProject.name,
      outputFormat: exportProfile.outputFormat
    })

    if (!selectedPath) {
      toast.message(text.toastExportPathCancelled)
      return
    }

    setExportDestinationPath(selectedPath)
    toast.success(text.toastExportPathSelected, { description: selectedPath })
  }

  async function handleExportWithCustomization() {
    if (!currentProjectId || !currentProject) {
      toast.error(text.toastSelectProjectFirst)
      return
    }

    if (!exportDestinationPath) {
      toast.error(text.toastChooseExportFirst)
      return
    }

    setIsExporting(true)
    const loadingToastId = toast.loading(text.toastExportInProgress)
    try {
      const normalizedProfile: ExportProfile = {
        ...exportProfile,
        name: ensureNonEmpty(exportProfile.name, text.exportDefaultName),
        fontFamily: ensureNonEmpty(exportProfile.fontFamily, 'Literata'),
        textColor: ensureNonEmpty(exportProfile.textColor, '#1b1f23'),
        sourceTextColor: ensureNonEmpty(exportProfile.sourceTextColor, exportProfile.textColor || '#1b1f23'),
        translatedTextColor: ensureNonEmpty(exportProfile.translatedTextColor, exportProfile.textColor || '#1b1f23'),
        backgroundColor: ensureNonEmpty(exportProfile.backgroundColor, '#ffffff')
      }
      setExportProfile(normalizedProfile)

      const profile = await window.api.export.upsertProfile({
        ...normalizedProfile,
        projectId: currentProjectId,
        createdAt: normalizedProfile.createdAt || new Date().toISOString()
      })

      const result = await window.api.export.startWithPath({
        projectId: currentProjectId,
        exportProfileId: profile.id,
        outputPath: exportDestinationPath
      })

      toast.success(text.toastExportCompleted, {
        id: loadingToastId,
        description: result.outputPath
      })
      setIsExportPanelOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : text.toastExportFailed
      toast.error(text.toastExportFailed, {
        id: loadingToastId,
        description: message
      })
    } finally {
      setIsExporting(false)
    }
  }

  async function resolveError(errorId: string) {
    await window.api.errors.resolve({
      errorId,
      action: 'mark_unresolved_and_continue'
    })
    toast.success(text.toastErrorResolved)

    if (currentProjectId) {
      const nextErrors = await window.api.errors.list({ projectId: currentProjectId })
      setErrors(nextErrors)
    }
  }

  async function deleteError(errorId: string) {
    try {
      await window.api.errors.delete({ errorId })
      toast.success(text.toastErrorDeleted)
      setErrors((prev) => prev.filter((entry) => entry.id !== errorId))
    } catch (error) {
      const message = error instanceof Error ? error.message : text.toastErrorDeleteFailed
      toast.error(text.toastErrorDeleteFailed, { description: message })
    }
  }
  const viewModel: RendererViewModel = {
    shell: {
      activeTab,
      appTabs,
      language,
      onSetActiveTab: setActiveTab,
      onSetLanguage: setLanguage,
      onSetTheme: setTheme,
      text,
      theme
    },
    library: {
      currentProjectId,
      importFeedback,
      importName,
      importPath,
      isDropActive,
      isImporting,
      onCreateProject: handleCreateProject,
      onDropZoneDragLeave: handleDropZoneDragLeave,
      onDropZoneDragOver: handleDropZoneDragOver,
      onDropZoneDrop: handleDropZoneDrop,
      onOpenProjectFromLibrary: openProjectFromLibrary,
      onPickImportFile: handlePickImportFile,
      onProjectDeleteRequested: setProjectPendingDelete,
      onRefreshProjects: refreshProjects,
      projects,
      setImportName,
      text,
      translateState
    },
    workspace: {
      canPauseRun,
      canResumeRun,
      canStartRun,
      canStopRun,
      currentProject,
      errors,
      exportDestinationPath,
      exportProfile,
      filteredParagraphs,
      isExportPanelOpen,
      isExporting,
      isRunActionBusy,
      isRunTranslating,
      jobState,
      localizedJobState,
      onGoToLibrary: () => setActiveTab('library'),
      onExportWithCustomization: handleExportWithCustomization,
      onMergeWithNext: mergeWithNext,
      onOpenExportWizard: handleOpenExportWizard,
      onCloseExportWizard: handleCloseExportWizard,
      onPauseTranslation: handlePauseTranslation,
      onPickExportDestination: handlePickExportDestination,
      onDeleteError: deleteError,
      onResolveError: resolveError,
      onResumeTranslation: handleResumeTranslation,
      onRetryParagraph: runRetry,
      onSearchChange: setSearch,
      onSetExportProfile: setExportProfile,
      onSetParagraphDraft: (paragraphId, value) => {
        setParagraphDrafts((prev) => ({
          ...prev,
          [paragraphId]: value
        }))
      },
      onSetSplitIndex: (paragraphId, value) => {
        setSplitIndexes((prev) => ({
          ...prev,
          [paragraphId]: value
        }))
      },
      onSplitParagraph: splitParagraph,
      onStartTranslation: handleStartTranslation,
      onStateFilterChange: setStateFilter,
      onStopTranslation: handleStopTranslation,
      onUpdateParagraph: updateParagraph,
      paragraphDrafts,
      paragraphStateValues,
      search,
      splitIndexes,
      stateFilter,
      text,
      translateState,
      translationForm
    },
    settings: {
      language,
      onFetchLatestModels: handleFetchLatestModels,
      onSaveProvider: handleSaveProvider,
      onSaveTechnicalSettings: handleSaveTechnicalSettings,
      onSelectTranslationProvider: handleSelectTranslationProvider,
      onSetSelectedSettingsProvider: setSelectedSettingsProvider,
      onSetSettings: setSettings,
      onSetTranslationForm: setTranslationForm,
      onUpdateSelectedProviderDraft: (patch) => updateProviderDraft(selectedSettingsProvider, patch),
      providerCatalog,
      providerIds,
      providerModelLoadState,
      providerSaveLoadState,
      providersCount: providers.length,
      runProviderModels,
      selectedProviderDraft,
      selectedProviderModels,
      selectedProviderNotice,
      selectedProviderSavedConfig,
      selectedSettingsProvider,
      settings,
      text,
      translationForm
    },
    dialogs: {
      isDeletingProject,
      onCloseDeleteDialog: () => setProjectPendingDelete(null),
      onConfirmDeleteProject: () => {
        if (projectPendingDelete) {
          return handleConfirmDeleteProject(projectPendingDelete)
        }
      },
      projectPendingDelete,
      text
    },
    toaster: {
      theme
    }
  }
  return viewModel
}
