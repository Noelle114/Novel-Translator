import { BookOpen, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import type { ProjectMetadata } from '@mtn/shared'
import type { AppText } from '../../app/types'

/** Durum → renk eşlemesi */
const stateColorMap: Record<string, string> = {
  idle: 'bg-muted text-muted-foreground',
  ready: 'bg-muted text-muted-foreground',
  extracting: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  translating: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  paused_recoverable: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  paused_error_waiting_user: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  cancelled: 'bg-muted text-muted-foreground'
}

interface ProjectCardProps {
  currentProjectId: string | null
  project: ProjectMetadata
  onOpen: (projectId: string) => void
  onDeleteRequested: (project: ProjectMetadata) => void
  text: AppText
  translateState: (state: string) => string
}

export function ProjectCard({ currentProjectId, project, onOpen, onDeleteRequested, text, translateState }: ProjectCardProps) {
  const isActive = project.id === currentProjectId
  const stateColor = stateColorMap[project.status] ?? 'bg-muted text-muted-foreground'

  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
    : null

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border bg-card p-4 transition-all',
        isActive ? 'border-primary/50 shadow-sm' : 'border-border hover:border-border/80 hover:shadow-sm'
      )}
    >
      {/* Aktif badge */}
      {isActive && (
        <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
          {text.active}
        </span>
      )}

      {/* Başlık */}
      <div className="flex items-start gap-2 pr-12">
        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="line-clamp-2 text-sm font-medium leading-snug">{project.name}</p>
      </div>

      {/* Meta bilgiler */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded border border-border px-1.5 py-0.5 text-xs font-medium uppercase text-muted-foreground">
          {project.sourceType}
        </span>
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', stateColor)}>
          {translateState(project.status)}
        </span>
      </div>

      {formattedDate && <p className="text-xs text-muted-foreground">{formattedDate}</p>}

      {/* Eylemler */}
      <div className="flex items-center gap-2">
        <Button size="sm" className="flex-1" onClick={() => onOpen(project.id)}>
          {text.tabs.workspace}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 shrink-0 p-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
          onClick={() => onDeleteRequested(project)}
          title={text.deleteFromLibrary}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
