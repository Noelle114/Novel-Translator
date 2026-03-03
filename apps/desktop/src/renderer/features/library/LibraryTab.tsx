import { Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import type { LibraryTabProps } from '../../app/types'

export function LibraryTab({
  currentProjectId,
  importFeedback,
  importName,
  importPath,
  isDropActive,
  isImporting,
  onCreateProject,
  onDropZoneDragLeave,
  onDropZoneDragOver,
  onDropZoneDrop,
  onOpenProjectFromLibrary,
  onPickImportFile,
  onProjectDeleteRequested,
  onRefreshProjects,
  projects,
  setImportName,
  text,
  translateState
}: LibraryTabProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_380px]">
      <Card className="section-reveal">
        <CardHeader>
          <CardTitle>{text.importToLibrary}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
              isDropActive ? 'border-primary/70 bg-primary/10' : 'border-border/80 bg-muted/60'
            }`}
            onDragEnter={onDropZoneDragOver}
            onDragOver={onDropZoneDragOver}
            onDragLeave={onDropZoneDragLeave}
            onDrop={onDropZoneDrop}
          >
            <p className="text-base font-semibold">{text.dropFile}</p>
            <p className="mt-1 text-sm text-muted-foreground">{text.pickFromDisk}</p>
            <Button type="button" variant="secondary" className="mt-4" onClick={() => void onPickImportFile()}>
              {text.chooseFile}
            </Button>
          </div>

          {importPath && (
            <div className="rounded-lg border border-border/70 bg-background/70 px-3 py-2 text-xs text-muted-foreground">
              {text.selected}: {importPath}
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label htmlFor="import-project-name" className="mb-1 block text-xs font-medium text-muted-foreground">
                {text.projectNameOptional}
              </label>
              <Input
                id="import-project-name"
                placeholder={text.libraryItemName}
                value={importName}
                onChange={(event) => setImportName(event.target.value)}
              />
            </div>
            <Button onClick={() => void onCreateProject()} disabled={!importPath || isImporting}>
              {isImporting ? text.importing : text.importToLibrary}
            </Button>
          </div>

          {importFeedback && (
            <p className={`text-sm ${importFeedback.type === 'error' ? 'text-destructive' : 'text-primary'}`}>
              {importFeedback.message}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="section-reveal h-fit">
        <CardHeader>
          <CardTitle>{text.yourLibrary}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {projects.length === 0 && (
            <p className="rounded-lg border border-border/70 bg-muted/70 p-3 text-sm text-muted-foreground">
              {text.noBooksImported}
            </p>
          )}

          {projects.map((project) => (
            <div key={project.id} className="group relative">
              <button
                type="button"
                className={`w-full rounded-lg border px-3 py-3 pr-12 text-left transition ${
                  project.id === currentProjectId
                    ? 'border-primary/60 bg-primary/10'
                    : 'border-border/70 bg-card hover:bg-muted/60'
                }`}
                onClick={() => void onOpenProjectFromLibrary(project.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {project.sourceType.toUpperCase()} - {translateState(project.status)}
                    </div>
                  </div>
                  {project.id === currentProjectId && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {text.active}
                    </span>
                  )}
                </div>
              </button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="pointer-events-none absolute right-2 top-2 h-8 w-8 border border-border bg-card p-0 text-muted-foreground opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 hover:text-destructive"
                onClick={(event) => {
                  event.stopPropagation()
                  onProjectDeleteRequested(project)
                }}
                aria-label={`${text.deleteFromLibrary}: ${project.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" className="w-full" onClick={() => void onRefreshProjects()}>
            {text.refreshLibrary}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
