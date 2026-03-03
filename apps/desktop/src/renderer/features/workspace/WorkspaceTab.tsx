import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../../components/ui/alert-dialog'
import type { WorkspaceTabProps } from '../../app/types'
import { ParagraphItem } from './ParagraphItem'
import { useEffect, useState } from 'react'

const EXPORT_FONT_OPTIONS = [
  'Literata',
  'IBM Plex Serif',
  'Merriweather',
  'Noto Serif',
  'Noto Sans',
  'Inter',
  'Arial',
  'Georgia',
  'Times New Roman'
]

export function WorkspaceTab({
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
  onGoToLibrary,
  onCloseExportWizard,
  onDeleteError,
  onExportWithCustomization,
  onMergeWithNext,
  onOpenExportWizard,
  onPauseTranslation,
  onPickExportDestination,
  onResolveError,
  onResumeTranslation,
  onRetryParagraph,
  onSearchChange,
  onSetExportProfile,
  onSetParagraphDraft,
  onSetSplitIndex,
  onSplitParagraph,
  onStartTranslation,
  onStateFilterChange,
  onStopTranslation,
  onUpdateParagraph,
  paragraphDrafts,
  paragraphStateValues,
  search,
  splitIndexes,
  stateFilter,
  text,
  translateState,
  translationForm
}: WorkspaceTabProps) {
  if (!currentProject) {
    return (
      <Card className="section-reveal">
        <CardHeader>
          <CardTitle>{text.tabs.workspace}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{text.workspaceEmpty}</p>
          <Button variant="secondary" onClick={onGoToLibrary}>
            {text.goToLibrary}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1.25fr)_420px]">
      <div className="space-y-4">
        <Card className="section-reveal">
          <CardHeader>
            <CardTitle>{text.editor}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 grid gap-2 md:grid-cols-[1fr_190px]">
              <Input
                placeholder={text.searchPlaceholder}
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
              <select
                className="h-10 rounded-md border border-border/80 bg-card px-3 text-sm text-foreground"
                value={stateFilter}
                onChange={(event) => onStateFilterChange(event.target.value)}
              >
                <option value="all">{text.allStates}</option>
                {paragraphStateValues.map((state) => (
                  <option key={state} value={state}>
                    {translateState(state)}
                  </option>
                ))}
              </select>
            </div>

            <div className="max-h-[68vh] space-y-3 overflow-auto pr-1">
              {filteredParagraphs.map((paragraph) => (
                <ParagraphItem
                  key={paragraph.id}
                  paragraph={paragraph}
                  draftValue={paragraphDrafts[paragraph.id] ?? ''}
                  splitIndexValue={splitIndexes[paragraph.id] ?? ''}
                  onSetDraft={onSetParagraphDraft}
                  onSetSplitIndex={onSetSplitIndex}
                  onUpdateParagraph={onUpdateParagraph}
                  onRetryParagraph={onRetryParagraph}
                  onSplitParagraph={onSplitParagraph}
                  onMergeWithNext={onMergeWithNext}
                  text={text}
                  translateState={translateState}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4">
        <Card className="section-reveal">
          <CardHeader>
            <CardTitle>{currentProject.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {text.source}: {currentProject.sourceType.toUpperCase()} | {text.status}: {translateState(currentProject.status)}
            </p>
            <div className="rounded-lg border border-border/70 bg-muted/50 px-3 py-3 text-xs">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span>
                  {text.state}: <span className="font-semibold">{localizedJobState}</span>
                </span>
                <span>{Math.round(jobState.progress * 100)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all ${isRunTranslating ? 'bg-primary' : 'bg-accent'}`}
                  style={{ width: `${Math.round(jobState.progress * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="section-reveal">
          <CardHeader>
            <CardTitle>{text.translationControls}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {text.provider}: {translationForm.providerId} | {text.model}: {translationForm.modelId} | {text.mode}:{' '}
              {translationForm.mode === 'contextual' ? text.contextual : text.independent}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void onStartTranslation()} disabled={!canStartRun}>
                {isRunActionBusy && !isRunTranslating ? text.working : text.start}
              </Button>
              <Button variant="outline" onClick={() => void onPauseTranslation()} disabled={!canPauseRun}>
                {text.pause}
              </Button>
              <Button variant="outline" onClick={() => void onResumeTranslation()} disabled={!canResumeRun}>
                {text.resume}
              </Button>
              <Button variant="outline" onClick={() => void onStopTranslation()} disabled={!canStopRun}>
                {text.stop}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{text.translationHint}</p>
          </CardContent>
        </Card>

        <Card className="section-reveal">
          <CardHeader>
            <CardTitle>{text.export}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" onClick={onOpenExportWizard}>
                {text.openExportWizard}
              </Button>
              <p className="text-xs text-muted-foreground">{text.exportHint}</p>
            </div>

            <div className="rounded-lg border border-border/70 bg-muted/40 p-3 text-xs text-muted-foreground">
              {text.profileName}: <span className="font-medium text-foreground">{exportProfile.name}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="section-reveal">
          <CardHeader>
            <CardTitle>{text.errorCenter}</CardTitle>
          </CardHeader>
          <CardContent className="max-h-64 space-y-2 overflow-auto">
            {errors.length === 0 && <p className="text-sm text-muted-foreground">{text.noErrors}</p>}
            {errors.map((error) => (
              <div key={error.id} className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
                <div className="font-medium">{error.errorType}</div>
                <div className="text-xs text-destructive">{error.normalizedMessage}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span>
                    {text.provider}: {error.providerId ?? '-'}
                  </span>
                  <span>
                    {text.model}: {error.modelId ?? '-'}
                  </span>
                  <span>
                    {text.paragraph}: {error.paragraphId ?? '-'}
                  </span>
                </div>
                {!error.resolvedAt && (
                  <Button size="sm" className="mt-2" onClick={() => void onResolveError(error.id)}>
                    {text.markResolved}
                  </Button>
                )}
                <Button size="sm" variant="destructive" className="mt-2 ml-2" onClick={() => void onDeleteError(error.id)}>
                  {text.deleteError}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>

      <AlertDialog open={isExportPanelOpen} onOpenChange={(open) => (!open ? onCloseExportWizard() : undefined)}>
        <AlertDialogContent className="max-h-[86vh] w-[min(1200px,95vw)] max-w-none overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>{text.customizeExport}</AlertDialogTitle>
            <AlertDialogDescription>{text.exportHint}</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3 rounded-lg border border-border/70 bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{text.exportSectionBasic}</p>
              <div>
                <label htmlFor="export-profile-name" className="mb-1 block text-xs font-medium text-muted-foreground">
                  {text.profileName}
                </label>
                <Input
                  id="export-profile-name"
                  value={exportProfile.name}
                  onChange={(event) => onSetExportProfile((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder={text.profileName}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={exportProfile.outputFormat === 'epub' ? 'secondary' : 'outline'}
                  onClick={() => onSetExportProfile((prev) => ({ ...prev, outputFormat: 'epub' }))}
                >
                  EPUB
                </Button>
                <Button
                  variant={exportProfile.outputFormat === 'pdf' ? 'secondary' : 'outline'}
                  onClick={() => onSetExportProfile((prev) => ({ ...prev, outputFormat: 'pdf' }))}
                >
                  PDF
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={exportProfile.layout === 'single' ? 'secondary' : 'outline'}
                  onClick={() => onSetExportProfile((prev) => ({ ...prev, layout: 'single' }))}
                >
                  {text.layoutSingle}
                </Button>
                <Button
                  variant={exportProfile.layout === 'bilingual-stacked' ? 'secondary' : 'outline'}
                  onClick={() => onSetExportProfile((prev) => ({ ...prev, layout: 'bilingual-stacked' }))}
                >
                  {text.layoutBilingualStacked}
                </Button>
                <Button
                  variant={exportProfile.layout === 'bilingual-sidebyside' ? 'secondary' : 'outline'}
                  onClick={() => onSetExportProfile((prev) => ({ ...prev, layout: 'bilingual-sidebyside' }))}
                >
                  {text.layoutBilingualSideBySide}
                </Button>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-border/70 bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{text.exportSectionTypography}</p>
              <div>
                <label htmlFor="export-font-family-select" className="mb-1 block text-xs font-medium text-muted-foreground">
                  {text.fontFamily}
                </label>
                <select
                  id="export-font-family-select"
                  className="h-10 w-full rounded-md border border-border/80 bg-card px-3 text-sm text-foreground"
                  value={EXPORT_FONT_OPTIONS.includes(exportProfile.fontFamily) ? exportProfile.fontFamily : '__custom'}
                  onChange={(event) => {
                    if (event.target.value === '__custom') {
                      return
                    }
                    onSetExportProfile((prev) => ({ ...prev, fontFamily: event.target.value }))
                  }}
                >
                  {EXPORT_FONT_OPTIONS.map((fontName) => (
                    <option key={fontName} value={fontName}>
                      {fontName}
                    </option>
                  ))}
                  <option value="__custom">Custom</option>
                </select>
              </div>
              {!EXPORT_FONT_OPTIONS.includes(exportProfile.fontFamily) && (
                <div>
                  <label htmlFor="export-font-family-custom" className="mb-1 block text-xs font-medium text-muted-foreground">
                    {text.fontFamily}
                  </label>
                  <Input
                    id="export-font-family-custom"
                    value={exportProfile.fontFamily}
                    onChange={(event) => onSetExportProfile((prev) => ({ ...prev, fontFamily: event.target.value }))}
                    placeholder="Font name"
                  />
                </div>
              )}
              <div className="rounded-md border border-border/60 bg-card/50 px-3 py-2 text-sm text-muted-foreground">
                <span style={{ fontFamily: exportProfile.fontFamily }}>The quick brown fox jumps over the lazy dog.</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="export-font-size" className="mb-1 block text-xs font-medium text-muted-foreground">
                    {text.fontSize}
                  </label>
                  <Input
                    id="export-font-size"
                    type="number"
                    min={8}
                    max={48}
                    value={exportProfile.fontSize}
                    onChange={(event) => onSetExportProfile((prev) => ({ ...prev, fontSize: Number(event.target.value) }))}
                  />
                </div>
                <div>
                  <label htmlFor="export-paragraph-spacing" className="mb-1 block text-xs font-medium text-muted-foreground">
                    {text.paragraphSpacing}
                  </label>
                  <Input
                    id="export-paragraph-spacing"
                    type="number"
                    min={0}
                    max={64}
                    value={exportProfile.paragraphSpacing}
                    onChange={(event) => onSetExportProfile((prev) => ({ ...prev, paragraphSpacing: Number(event.target.value) }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-border/70 bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{text.exportSectionColors}</p>
              <div className="grid grid-cols-2 gap-3">
                <ExportColorField
                  id="export-source-color"
                  label={text.sourceTextColor}
                  value={exportProfile.sourceTextColor ?? exportProfile.textColor}
                  onCommit={(value) => onSetExportProfile((prev) => ({ ...prev, sourceTextColor: value }))}
                />
                <ExportColorField
                  id="export-translated-color"
                  label={text.translatedTextColor}
                  value={exportProfile.translatedTextColor ?? exportProfile.textColor}
                  onCommit={(value) => onSetExportProfile((prev) => ({ ...prev, translatedTextColor: value }))}
                />
                <ExportColorField
                  id="export-text-color"
                  label={text.textColor}
                  value={exportProfile.textColor}
                  onCommit={(value) => onSetExportProfile((prev) => ({ ...prev, textColor: value }))}
                />
                <ExportColorField
                  id="export-background-color"
                  label={text.backgroundColor}
                  value={exportProfile.backgroundColor}
                  onCommit={(value) => onSetExportProfile((prev) => ({ ...prev, backgroundColor: value }))}
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-border/70 bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{text.exportSectionPage}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">{text.marginTop}</label>
                  <Input
                    type="number"
                    min={0}
                    max={200}
                    value={exportProfile.margins.top}
                    onChange={(event) =>
                      onSetExportProfile((prev) => ({
                        ...prev,
                        margins: { ...prev.margins, top: Number(event.target.value) }
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">{text.marginRight}</label>
                  <Input
                    type="number"
                    min={0}
                    max={200}
                    value={exportProfile.margins.right}
                    onChange={(event) =>
                      onSetExportProfile((prev) => ({
                        ...prev,
                        margins: { ...prev.margins, right: Number(event.target.value) }
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">{text.marginBottom}</label>
                  <Input
                    type="number"
                    min={0}
                    max={200}
                    value={exportProfile.margins.bottom}
                    onChange={(event) =>
                      onSetExportProfile((prev) => ({
                        ...prev,
                        margins: { ...prev.margins, bottom: Number(event.target.value) }
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">{text.marginLeft}</label>
                  <Input
                    type="number"
                    min={0}
                    max={200}
                    value={exportProfile.margins.left}
                    onChange={(event) =>
                      onSetExportProfile((prev) => ({
                        ...prev,
                        margins: { ...prev.margins, left: Number(event.target.value) }
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={exportProfile.includeImages ? 'secondary' : 'outline'}
                  onClick={() => onSetExportProfile((prev) => ({ ...prev, includeImages: !prev.includeImages }))}
                >
                  {exportProfile.includeImages ? text.imagesOn : text.imagesOff}
                </Button>
                <Button
                  variant={exportProfile.includeMetadata ? 'secondary' : 'outline'}
                  onClick={() => onSetExportProfile((prev) => ({ ...prev, includeMetadata: !prev.includeMetadata }))}
                >
                  {exportProfile.includeMetadata ? text.metadataOn : text.metadataOff}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
            <Input readOnly value={exportDestinationPath} placeholder={text.noExportLocation} />
            <Button variant="outline" onClick={() => void onPickExportDestination()} disabled={isExporting}>
              {text.chooseLocation}
            </Button>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCloseExportWizard}>{text.close}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void onExportWithCustomization()} disabled={isExporting}>
              {isExporting ? text.exporting : text.exportNow}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

type ExportColorFieldProps = {
  id: string
  label: string
  value: string
  onCommit: (value: string) => void
}

function ExportColorField({ id, label, value, onCommit }: ExportColorFieldProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  function commit() {
    if (draft !== value) {
      onCommit(draft)
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Input
        id={id}
        type="color"
        value={draft}
        onInput={(event) => setDraft(event.currentTarget.value)}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onBlur={commit}
        onPointerUp={commit}
        onKeyUp={(event) => {
          if (event.key === 'Enter') {
            commit()
          }
        }}
      />
    </div>
  )
}
