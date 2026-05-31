import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, Flag, Lock, LockOpen, RotateCcw, Save, SkipForward } from 'lucide-react'
import type { Paragraph } from '@mtn/shared'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { cn } from '../../lib/utils'
import type { AppText, ParagraphActionPatch } from '../../app/types'

const STATE_COLORS: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  translating: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  translated: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  edited: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  locked: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  skipped: 'bg-muted text-muted-foreground',
  unresolved: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
}

type ParagraphItemProps = {
  draftValue: string
  onMergeWithNext: (paragraphId: string) => void | Promise<void>
  onRetryParagraph: (paragraphId: string, alternative: boolean) => void | Promise<void>
  onSetDraft: (paragraphId: string, value: string) => void
  onSetSplitIndex: (paragraphId: string, value: string) => void
  onSplitParagraph: (paragraphId: string) => void | Promise<void>
  onUpdateParagraph: (paragraphId: string, patch: ParagraphActionPatch) => void | Promise<void>
  paragraph: Paragraph
  splitIndexValue: string
  text: AppText
  translateState: (state: string) => string
}

export function ParagraphItem({
  draftValue,
  onMergeWithNext,
  onRetryParagraph,
  onSetDraft,
  onSetSplitIndex,
  onSplitParagraph,
  onUpdateParagraph,
  paragraph,
  splitIndexValue,
  text,
  translateState
}: ParagraphItemProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const isDirty = draftValue !== paragraph.translationText
  const stateColor = STATE_COLORS[paragraph.state] ?? 'bg-muted text-muted-foreground'
  const isLocked = paragraph.isLocked
  const isSkipped = paragraph.isSkipped
  const isFlagged = paragraph.issueFlag

  return (
    <div className={cn('rounded-xl border bg-card transition-shadow hover:shadow-sm', isFlagged && 'border-orange-300 dark:border-orange-700')}>
      <div className="p-4">
        {/* Üst bar: index + durum */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">#{paragraph.index + 1}</span>
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', stateColor)}>
            {translateState(paragraph.state)}
          </span>
        </div>

        {/* Kaynak metin */}
        <div className="mb-2 rounded-md bg-muted/40 p-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{paragraph.sourceText}</p>
        </div>

        {/* Çeviri textarea */}
        <Textarea
          className="mb-3 min-h-[80px] resize-y text-sm"
          value={draftValue}
          onChange={(e) => onSetDraft(paragraph.id, e.target.value)}
          disabled={isLocked || isSkipped}
          placeholder="Çeviri..."
        />

        {/* Eylem butonları */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            size="sm"
            variant={isDirty ? 'default' : 'outline'}
            className="h-7 gap-1 text-xs"
            disabled={!isDirty || isLocked}
            onClick={() => void onUpdateParagraph(paragraph.id, { translationText: draftValue, state: 'edited' })}
          >
            <Save className="h-3 w-3" />
            {text.saveEdit}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 text-xs"
            disabled={isLocked || isSkipped}
            onClick={() => void onUpdateParagraph(paragraph.id, { state: 'approved' })}
          >
            <Check className="h-3 w-3" />
            {text.approve}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 text-xs"
            disabled={isLocked || isSkipped}
            onClick={() => void onRetryParagraph(paragraph.id, false)}
          >
            <RotateCcw className="h-3 w-3" />
            {text.retranslate}
          </Button>

          {/* Gelişmiş toggle */}
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto h-7 gap-1 text-xs text-muted-foreground"
            onClick={() => setShowAdvanced((prev) => !prev)}
          >
            {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showAdvanced ? text.hideAdvanced : text.showAdvanced}
          </Button>
        </div>

        {/* Gelişmiş bölüm */}
        {showAdvanced && (
          <div className="mt-3 border-t border-border pt-3">
            <div className="flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 text-xs"
                onClick={() => void onUpdateParagraph(paragraph.id, { isLocked: !isLocked, state: isLocked ? 'edited' : 'locked' })}
              >
                {isLocked ? <LockOpen className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {isLocked ? text.unlock : text.lock}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 text-xs"
                onClick={() => void onUpdateParagraph(paragraph.id, { isSkipped: !isSkipped, state: isSkipped ? 'pending' : 'skipped' })}
              >
                <SkipForward className="h-3 w-3" />
                {isSkipped ? text.unskip : text.skip}
              </Button>

              <Button
                size="sm"
                variant={isFlagged ? 'secondary' : 'outline'}
                className={cn('h-7 gap-1 text-xs', isFlagged && 'text-orange-600 dark:text-orange-400')}
                onClick={() => void onUpdateParagraph(paragraph.id, { issueFlag: !isFlagged })}
              >
                <Flag className="h-3 w-3" />
                {isFlagged ? text.unflag : text.flag}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                disabled={isLocked || isSkipped}
                onClick={() => void onRetryParagraph(paragraph.id, true)}
              >
                {text.alternative}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => void onMergeWithNext(paragraph.id)}
              >
                {text.mergeWithNext}
              </Button>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                className="h-7 w-24 rounded-md border border-input bg-background px-2 text-xs"
                placeholder={text.splitIndex}
                value={splitIndexValue}
                onChange={(e) => onSetSplitIndex(paragraph.id, e.target.value)}
                min={1}
              />
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                disabled={!splitIndexValue}
                onClick={() => void onSplitParagraph(paragraph.id)}
              >
                {text.split}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
