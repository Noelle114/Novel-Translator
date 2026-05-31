import { Search } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ScrollArea } from '../../components/ui/scroll-area'
import { ParagraphItem } from './ParagraphItem'
import type { Paragraph } from '@mtn/shared'
import type { AppText, ParagraphActionPatch } from '../../app/types'

interface ParagraphListProps {
  filteredParagraphs: Paragraph[]
  onMergeWithNext: (paragraphId: string) => void | Promise<void>
  onRetryParagraph: (paragraphId: string, alternative: boolean) => void | Promise<void>
  onSearchChange: (value: string) => void
  onSetParagraphDraft: (paragraphId: string, value: string) => void
  onSetSplitIndex: (paragraphId: string, value: string) => void
  onSplitParagraph: (paragraphId: string) => void | Promise<void>
  onStateFilterChange: (value: string) => void
  onUpdateParagraph: (paragraphId: string, patch: ParagraphActionPatch) => void | Promise<void>
  paragraphDrafts: Record<string, string>
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
  onSetParagraphDraft,
  onSetSplitIndex,
  onSplitParagraph,
  onStateFilterChange,
  onUpdateParagraph,
  paragraphDrafts,
  paragraphStateValues,
  search,
  splitIndexes,
  stateFilter,
  text,
  translateState
}: ParagraphListProps) {
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

        <span className="shrink-0 text-xs text-muted-foreground">{filteredParagraphs.length}</span>
      </div>

      {/* Paragraf listesi */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 p-4">
          {filteredParagraphs.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <p className="text-sm text-muted-foreground">{text.noParagraphsFound}</p>
            </div>
          ) : (
            filteredParagraphs.map((paragraph) => (
              <ParagraphItem
                key={paragraph.id}
                paragraph={paragraph}
                draftValue={paragraphDrafts[paragraph.id] ?? paragraph.translationText}
                splitIndexValue={splitIndexes[paragraph.id] ?? ''}
                onMergeWithNext={onMergeWithNext}
                onRetryParagraph={onRetryParagraph}
                onSetDraft={onSetParagraphDraft}
                onSetSplitIndex={onSetSplitIndex}
                onSplitParagraph={onSplitParagraph}
                onUpdateParagraph={onUpdateParagraph}
                text={text}
                translateState={translateState}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
