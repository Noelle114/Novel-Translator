import { useRef, useState } from 'react'
import { CheckCheck, Search } from 'lucide-react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ParagraphItem } from './ParagraphItem'
import type { Paragraph } from '@mtn/shared'
import type { AppText, ParagraphActionPatch } from '../../app/types'

interface ParagraphListProps {
  filteredParagraphs: Paragraph[]
  onMergeWithNext: (paragraphId: string) => void | Promise<void>
  onRetryParagraph: (paragraphId: string, alternative: boolean) => void | Promise<void>
  onSearchChange: (value: string) => void
  onSetSplitIndex: (paragraphId: string, value: string) => void
  onSplitParagraph: (paragraphId: string) => void | Promise<void>
  onStateFilterChange: (value: string) => void
  onUpdateParagraph: (paragraphId: string, patch: ParagraphActionPatch) => void | Promise<void>
  onApproveAll: () => void | Promise<void>
  paragraphStateValues: string[]
  search: string
  splitIndexes: Record<string, string>
  stateFilter: string
  text: AppText
  translateState: (state: string) => string
}

export function ParagraphList({
  filteredParagraphs,
  onMergeWithNext,
  onRetryParagraph,
  onSearchChange,
  onSetSplitIndex,
  onSplitParagraph,
  onStateFilterChange,
  onUpdateParagraph,
  onApproveAll,
  paragraphStateValues,
  search,
  splitIndexes,
  stateFilter,
  text,
  translateState
}: ParagraphListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const draftsRef = useRef<Record<string, string>>({})
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false)

  const virtualizer = useVirtualizer({
    count: filteredParagraphs.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 200,
    overscan: 10
  })

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Filtre çubuğu */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-background px-4 py-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-xs"
            placeholder={text.searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select value={stateFilter} onValueChange={onStateFilterChange}>
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">{text.allStates}</SelectItem>
            {paragraphStateValues.map((state) => (
              <SelectItem key={state} value={state} className="text-xs">
                {translateState(state)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 text-xs"
          onClick={() => setApproveConfirmOpen(true)}
        >
          <CheckCheck className="h-3.5 w-3.5" />
          {text.approveAll}
        </Button>

        <span className="shrink-0 text-xs text-muted-foreground">{filteredParagraphs.length}</span>
      </div>

      {/* Paragraf listesi (sanal) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {filteredParagraphs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-sm text-muted-foreground">{text.noParagraphsFound}</p>
          </div>
        ) : (
          <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const paragraph = filteredParagraphs[virtualItem.index]
              return (
                <div
                  key={paragraph.id}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  className="absolute left-0 top-0 w-full px-4 py-1.5"
                  style={{ transform: `translateY(${virtualItem.start}px)` }}
                >
                  <ParagraphItem
                    paragraph={paragraph}
                    draftsRef={draftsRef}
                    splitIndexValue={splitIndexes[paragraph.id] ?? ''}
                    onMergeWithNext={onMergeWithNext}
                    onRetryParagraph={onRetryParagraph}
                    onSetSplitIndex={onSetSplitIndex}
                    onSplitParagraph={onSplitParagraph}
                    onUpdateParagraph={onUpdateParagraph}
                    text={text}
                    translateState={translateState}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      <AlertDialog open={approveConfirmOpen} onOpenChange={setApproveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text.approveAllConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{text.approveAllConfirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{text.no}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setApproveConfirmOpen(false)
                void onApproveAll()
              }}
            >
              {text.yes}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
