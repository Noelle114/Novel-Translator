import { useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { ScrollArea } from '../../components/ui/scroll-area'
import { cn } from '../../lib/utils'
import type { Paragraph, ProjectMetadata } from '@mtn/shared'
import type { AppText } from '../../app/types'

interface ChapterSidebarProps {
  currentProject: ProjectMetadata | null
  onGoToLibrary: () => void
  paragraphs: Paragraph[]
  selectedChapterId: string | null
  onSelectChapter: (chapterId: string | null) => void
  text: AppText
  translateState: (state: string) => string
}

export function ChapterSidebar({
  currentProject,
  onGoToLibrary,
  paragraphs,
  selectedChapterId,
  onSelectChapter,
  text,
  translateState
}: ChapterSidebarProps) {
  /** Bölümleri paragraflardan türet */
  const chapters = useMemo(() => {
    const map = new Map<string, { id: string; count: number; approvedCount: number }>()
    for (const p of paragraphs) {
      const id = p.sectionId ?? 'default'
      const existing = map.get(id)
      if (existing) {
        existing.count++
        if (p.state === 'approved' || p.state === 'translated') existing.approvedCount++
      } else {
        map.set(id, {
          id,
          count: 1,
          approvedCount: p.state === 'approved' || p.state === 'translated' ? 1 : 0
        })
      }
    }
    return [...map.values()]
  }, [paragraphs])

  /** İstatistikler */
  const stats = useMemo(() => {
    const total = paragraphs.length
    const approved = paragraphs.filter((p) => p.state === 'approved').length
    const translated = paragraphs.filter((p) => p.state === 'translated' || p.state === 'edited').length
    const pending = paragraphs.filter((p) => p.state === 'pending').length
    const errors = paragraphs.filter((p) => p.state === 'error').length
    return { total, approved, translated, pending, errors }
  }, [paragraphs])

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-border bg-muted/10">
      {/* Geri butonu + Proje adı */}
      <div className="flex flex-col gap-1 border-b border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 justify-start gap-1.5 px-2 text-xs text-muted-foreground"
          onClick={onGoToLibrary}
        >
          <ArrowLeft className="h-3 w-3" />
          {text.tabs.library}
        </Button>
        {currentProject && (
          <p className="line-clamp-2 px-2 text-xs font-semibold leading-snug" title={currentProject.name}>
            {currentProject.name}
          </p>
        )}
      </div>

      {/* Bölüm listesi */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Tümü seçeneği */}
          <button
            type="button"
            className={cn(
              'w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors',
              selectedChapterId === null
                ? 'bg-accent font-medium text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            )}
            onClick={() => onSelectChapter(null)}
          >
            {text.allStates} ({paragraphs.length})
          </button>

          {chapters.map((chapter, index) => {
            const progressPct = chapter.count > 0 ? Math.round((chapter.approvedCount / chapter.count) * 100) : 0
            return (
              <button
                key={chapter.id}
                type="button"
                className={cn(
                  'w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors',
                  selectedChapterId === chapter.id
                    ? 'bg-accent font-medium text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
                onClick={() => onSelectChapter(chapter.id)}
              >
                <span className="flex items-center justify-between">
                  <span className="truncate">{text.chapterLabel} {index + 1}</span>
                  <span className="shrink-0 text-[10px] opacity-70">{progressPct}%</span>
                </span>
              </button>
            )
          })}
        </div>
      </ScrollArea>

      {/* Alt istatistik */}
      <div className="border-t border-border p-3 text-xs text-muted-foreground">
        <div className="grid grid-cols-2 gap-1">
          <span>{text.statsTotal}: {stats.total}</span>
          <span>{text.statsApproved}: {stats.approved}</span>
          <span>{text.statsTranslated}: {stats.translated}</span>
          <span className={stats.errors > 0 ? 'text-destructive' : ''}>{text.statsErrors}: {stats.errors}</span>
        </div>
      </div>
    </aside>
  )
}
