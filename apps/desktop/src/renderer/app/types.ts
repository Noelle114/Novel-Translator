import type { Dispatch, DragEvent, ReactNode, SetStateAction } from 'react'
import type {
  AppSettings,
  ErrorState,
  ExportProfile,
  Paragraph,
  ProjectMetadata,
  ProviderSettings
} from '@mtn/shared'
import { translations, type AppLanguage, type AppTheme } from '../i18n'

export type AppText = (typeof translations)[AppLanguage]

export type JobState = {
  state: string
  progress: number
}

export type TranslationForm = {
  providerId: ProviderId
  modelId: string
  mode: 'independent' | 'contextual'
  contextWindow: number
  retryCount: number
  timeoutMs: number
  temperature?: number
  glossaryMergeBehavior: 'project_over_global' | 'global_over_project'
}

export type ProviderId = 'openai' | 'gemini' | 'deepl'

export type ProviderDraft = {
  model: string
  timeoutMs: number
  retryCount: number
  temperature: number
  credentialLabel: string
  apiKey: string
}

export type ProviderModelInfo = {
  id: string
  name: string
}

export type AppTab = 'library' | 'workspace' | 'settings'

export type ImportFeedback = {
  type: 'success' | 'error'
  message: string
}

export interface CollapsibleSectionProps {
  children: ReactNode
  className?: string
  defaultOpen?: boolean
  hideLabel: string
  showLabel: string
  title: string
}

export interface LibraryTabProps {
  currentProjectId: string | null
  importFeedback: ImportFeedback | null
  importName: string
  importPath: string
  isDropActive: boolean
  isImporting: boolean
  onCreateProject: () => void | Promise<void>
  onDropZoneDragLeave: (event: DragEvent<HTMLDivElement>) => void
  onDropZoneDragOver: (event: DragEvent<HTMLDivElement>) => void
  onDropZoneDrop: (event: DragEvent<HTMLDivElement>) => void
  onOpenProjectFromLibrary: (projectId: string) => void | Promise<void>
  onPickImportFile: () => void | Promise<void>
  onProjectDeleteRequested: (project: ProjectMetadata) => void
  onRefreshProjects: () => void | Promise<void>
  projects: ProjectMetadata[]
  setImportName: Dispatch<SetStateAction<string>>
  text: AppText
  translateState: (state: string) => string
}

export interface ParagraphActionPatch {
  [key: string]: unknown
}

export interface WorkspaceTabProps {
  canPauseRun: boolean
  canResumeRun: boolean
  canStartRun: boolean
  canStopRun: boolean
  currentProject: ProjectMetadata | null
  errors: ErrorState[]
  exportDestinationPath: string
  exportProfile: ExportProfile
  filteredParagraphs: Paragraph[]
  isExportPanelOpen: boolean
  isExporting: boolean
  isRunActionBusy: boolean
  isRunTranslating: boolean
  jobState: JobState
  localizedJobState: string
  onGoToLibrary: () => void
  onExportWithCustomization: () => void | Promise<void>
  onCloseExportWizard: () => void
  onMergeWithNext: (paragraphId: string) => void | Promise<void>
  onOpenExportWizard: () => void
  onPauseTranslation: () => void | Promise<void>
  onPickExportDestination: () => void | Promise<void>
  onDeleteError: (errorId: string) => void | Promise<void>
  onResolveError: (errorId: string) => void | Promise<void>
  onResumeTranslation: () => void | Promise<void>
  onRetryParagraph: (paragraphId: string, alternative: boolean) => void | Promise<void>
  onSearchChange: (value: string) => void
  onSetExportProfile: Dispatch<SetStateAction<ExportProfile>>
  onSetParagraphDraft: (paragraphId: string, value: string) => void
  onSetSplitIndex: (paragraphId: string, value: string) => void
  onSplitParagraph: (paragraphId: string) => void | Promise<void>
  onStartTranslation: () => void | Promise<void>
  onStateFilterChange: (value: string) => void
  onStopTranslation: () => void | Promise<void>
  onUpdateParagraph: (paragraphId: string, patch: ParagraphActionPatch) => void | Promise<void>
  paragraphDrafts: Record<string, string>
  paragraphStateValues: string[]
  search: string
  splitIndexes: Record<string, string>
  stateFilter: string
  text: AppText
  translateState: (state: string) => string
  translationForm: TranslationForm
}

export interface SettingsTabProps {
  language: AppLanguage
  onFetchLatestModels: (providerId: ProviderId) => void | Promise<void>
  onSaveProvider: (providerId: ProviderId) => void | Promise<void>
  onSaveTechnicalSettings: () => void | Promise<void>
  onSelectTranslationProvider: (providerId: ProviderId) => void
  onSetSelectedSettingsProvider: Dispatch<SetStateAction<ProviderId>>
  onSetSettings: Dispatch<SetStateAction<AppSettings | null>>
  onSetTranslationForm: Dispatch<SetStateAction<TranslationForm>>
  onUpdateSelectedProviderDraft: (patch: Partial<ProviderDraft>) => void
  providerCatalog: Record<ProviderId, { label: string; defaultModel: string; modelSuggestions: string[] }>
  providerIds: ProviderId[]
  providerModelLoadState: Record<ProviderId, boolean>
  providerSaveLoadState: Record<ProviderId, boolean>
  providersCount: number
  runProviderModels: ProviderModelInfo[]
  selectedProviderDraft: ProviderDraft
  selectedProviderModels: ProviderModelInfo[]
  selectedProviderNotice: ImportFeedback | null
  selectedProviderSavedConfig: ProviderSettings | null
  selectedSettingsProvider: ProviderId
  settings: AppSettings | null
  text: AppText
  translationForm: TranslationForm
}

export interface RendererViewModel {
  dialogs: {
    isDeletingProject: boolean
    onCloseDeleteDialog: () => void
    onConfirmDeleteProject: () => void | Promise<void>
    projectPendingDelete: ProjectMetadata | null
    text: AppText
  }
  library: LibraryTabProps
  settings: SettingsTabProps
  shell: {
    activeTab: AppTab
    appTabs: AppTab[]
    language: AppLanguage
    onSetActiveTab: Dispatch<SetStateAction<AppTab>>
    onSetLanguage: Dispatch<SetStateAction<AppLanguage>>
    onSetTheme: Dispatch<SetStateAction<AppTheme>>
    text: AppText
    theme: AppTheme
  }
  toaster: {
    theme: AppTheme
  }
  workspace: WorkspaceTabProps
}
