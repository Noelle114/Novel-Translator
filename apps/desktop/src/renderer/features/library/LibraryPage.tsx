import { Library, RefreshCw } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Separator } from '../../components/ui/separator'
import { ImportDropzone } from './ImportDropzone'
import { ProjectCard } from './ProjectCard'
import type { LibraryTabProps } from '../../app/types'

export function LibraryPage({
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
    <div className="flex h-full overflow-hidden">
      {/* Sol: Import paneli */}
      <aside className="flex w-80 shrink-0 flex-col gap-4 border-r border-border bg-muted/20 p-5">
        <div>
          <h2 className="text-sm font-semibold">{text.importToLibrary}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{text.importDropHint}</p>
        </div>

        <ImportDropzone
          importFeedback={importFeedback}
          importName={importName}
          importPath={importPath}
          isDropActive={isDropActive}
          isImporting={isImporting}
          onCreateProject={onCreateProject}
          onDropZoneDragLeave={onDropZoneDragLeave}
          onDropZoneDragOver={onDropZoneDragOver}
          onDropZoneDrop={onDropZoneDrop}
          onPickImportFile={onPickImportFile}
          setImportName={setImportName}
          text={text}
        />
      </aside>

      {/* Sağ: Proje listesi */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Üst bar */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <Library className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">{text.yourLibrary}</span>
            {projects.length > 0 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {projects.length}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => void onRefreshProjects()}
            title={text.refreshLibrary}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Proje kartları */}
        <div className="flex-1 overflow-y-auto p-5">
          {projects.length === 0 ? (
            /* Boş durum */
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <Library className="h-10 w-10 text-muted-foreground/40" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{text.noBooksImported}</p>
                <p className="mt-1 text-xs text-muted-foreground/60">{text.importFromSidebar}</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  currentProjectId={currentProjectId}
                  project={project}
                  onOpen={(id) => void onOpenProjectFromLibrary(id)}
                  onDeleteRequested={onProjectDeleteRequested}
                  text={text}
                  translateState={translateState}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
