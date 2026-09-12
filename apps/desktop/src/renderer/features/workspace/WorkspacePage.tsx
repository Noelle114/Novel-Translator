import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Separator } from '../../components/ui/separator'
import { ScrollArea } from '../../components/ui/scroll-area'
import { TranslationControlBar } from './TranslationControlBar'
import { ChapterSidebar } from './ChapterSidebar'
import { ParagraphList } from './ParagraphList'
import { ErrorPanel } from './panels/ErrorPanel'
import { GlossaryPanel } from './panels/GlossaryPanel'
import { ExportPanel } from './panels/ExportPanel'
import type { ProviderModelInfo, TranslationForm, WorkspaceTabProps } from '../../app/types'

type WorkspacePageProps = WorkspaceTabProps & {
  runProviderModels: ProviderModelInfo[]
  onSetTranslationForm: (patch: Partial<TranslationForm>) => void
}

/** Collapsible sağ panel bölümü */
function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between py-2 text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</span>
        {open ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
      </button>
      {open && <div className="pb-3">{children}</div>}
      <Separator />
    </div>
  )
}

export function WorkspacePage({
  canPauseRun,
  canResumeRun,
  canStartRun,
  canStopRun,
  currentProject,
  errors,
  exportDestinationPath,
  exportProfile,
  filteredParagraphs,
  glossary,
  isExporting,
  isRunActionBusy,
  isRunTranslating,
  jobState,
  localizedJobState,
  onGoToLibrary,
  onExportWithCustomization,
  onMergeWithNext,
  onPauseTranslation,
  onPickExportDestination,
  onDeleteError,
  onResolveError,
  onResumeTranslation,
  onRetryParagraph,
  onSearchChange,
  onSetExportProfile,
  onSetSplitIndex,
  onSplitParagraph,
  onStartTranslation,
  onStateFilterChange,
  onStopTranslation,
  onUpdateParagraph,
  onApproveAll,
  paragraphStateValues,
  runProviderModels,
  search,
  splitIndexes,
  stateFilter,
  text,
  translateState,
  translationForm,
  onSetTranslationForm
}: WorkspacePageProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)

  // Tüm paragraflar chapter filtresine göre dar
  const allParagraphs = filteredParagraphs  // zaten search+state filtreli, chapter da uygula
  const chapterFilteredParagraphs = selectedChapterId === null
    ? allParagraphs
    : allParagraphs.filter((p) => (p.sectionId ?? 'default') === selectedChapterId)

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sol sidebar: Chapter listesi */}
      <ChapterSidebar
        currentProject={currentProject}
        onGoToLibrary={onGoToLibrary}
        paragraphs={filteredParagraphs}
        selectedChapterId={selectedChapterId}
        onSelectChapter={setSelectedChapterId}
        text={text}
        translateState={translateState}
      />

      {/* Orta alan: Kontrol çubuğu + Paragraf listesi */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TranslationControlBar
          canPauseRun={canPauseRun}
          canResumeRun={canResumeRun}
          canStartRun={canStartRun}
          canStopRun={canStopRun}
          isRunActionBusy={isRunActionBusy}
          jobState={jobState}
          localizedJobState={localizedJobState}
          onPauseTranslation={onPauseTranslation}
          onResumeTranslation={onResumeTranslation}
          onStartTranslation={onStartTranslation}
          onStopTranslation={onStopTranslation}
          onSetTranslationForm={onSetTranslationForm}
          runProviderModels={runProviderModels}
          text={text}
          translationForm={translationForm}
        />

        <ParagraphList
          filteredParagraphs={chapterFilteredParagraphs}
          onMergeWithNext={onMergeWithNext}
          onRetryParagraph={onRetryParagraph}
          onSearchChange={onSearchChange}
          onSetSplitIndex={onSetSplitIndex}
          onSplitParagraph={onSplitParagraph}
          onStateFilterChange={onStateFilterChange}
          onUpdateParagraph={onUpdateParagraph}
          onApproveAll={onApproveAll}
          paragraphStateValues={paragraphStateValues}
          search={search}
          splitIndexes={splitIndexes}
          stateFilter={stateFilter}
          text={text}
          translateState={translateState}
        />
      </div>

      {/* Sağ panel: Durum + Hata + Sözlük + Dışa Aktar */}
      <aside className="flex w-[260px] shrink-0 flex-col border-l border-border bg-muted/10 overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="space-y-0 px-4 py-3">
            <PanelSection title={text.errorCenter}>
              <ErrorPanel
                errors={errors}
                onDeleteError={onDeleteError}
                onResolveError={onResolveError}
                text={text}
              />
            </PanelSection>

            <PanelSection title={text.glossary}>
              <GlossaryPanel text={text} {...glossary} />
            </PanelSection>

            <PanelSection title={text.export}>
              <ExportPanel
                exportDestinationPath={exportDestinationPath}
                exportProfile={exportProfile}
                isExporting={isExporting}
                onExportWithCustomization={onExportWithCustomization}
                onPickExportDestination={onPickExportDestination}
                onSetExportProfile={onSetExportProfile}
                text={text}
              />
            </PanelSection>
          </div>
        </ScrollArea>
      </aside>
    </div>
  )
}
