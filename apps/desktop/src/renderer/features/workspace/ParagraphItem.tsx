import type { Paragraph } from '@mtn/shared'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import type { AppText, ParagraphActionPatch } from '../../app/types'
import { CollapsibleSection } from '../shared/CollapsibleSection'

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
  return (
    <article className="rounded-xl border border-border/70 bg-card/80 p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant={paragraph.state as any} label={translateState(paragraph.state)} />
        <span className="text-xs text-muted-foreground">#{paragraph.index}</span>
      </div>

      <p className="mb-3 whitespace-pre-wrap rounded-lg border border-border/70 bg-muted/70 p-3 text-sm leading-relaxed text-foreground">
        {paragraph.sourceText}
      </p>

      <Textarea
        value={draftValue}
        onChange={(event) => onSetDraft(paragraph.id, event.target.value)}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() =>
            onUpdateParagraph(paragraph.id, {
              translationText: draftValue,
              state: 'edited'
            })
          }
        >
          {text.saveEdit}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onUpdateParagraph(paragraph.id, { state: 'approved' })}>
          {text.approve}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onRetryParagraph(paragraph.id, false)}>
          {text.retranslate}
        </Button>
      </div>

      <CollapsibleSection
        className="mt-3"
        title={text.editor}
        showLabel={text.showAdvanced}
        hideLabel={text.hideAdvanced}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onUpdateParagraph(paragraph.id, {
                  isLocked: !paragraph.isLocked,
                  state: paragraph.isLocked ? 'edited' : 'locked'
                })
              }
            >
              {paragraph.isLocked ? text.unlock : text.lock}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onUpdateParagraph(paragraph.id, {
                  isSkipped: !paragraph.isSkipped,
                  state: paragraph.isSkipped ? 'pending' : 'skipped'
                })
              }
            >
              {paragraph.isSkipped ? text.unskip : text.skip}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateParagraph(paragraph.id, { issueFlag: !paragraph.issueFlag })}
            >
              {paragraph.issueFlag ? text.unflag : text.flag}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onRetryParagraph(paragraph.id, true)}>
              {text.alternative}
            </Button>
          </div>

          <div className="grid gap-2 md:grid-cols-[140px_auto_auto]">
            <Input
              type="number"
              min={1}
              placeholder={text.splitIndex}
              value={splitIndexValue}
              onChange={(event) => onSetSplitIndex(paragraph.id, event.target.value)}
            />
            <Button size="sm" variant="outline" onClick={() => onSplitParagraph(paragraph.id)}>
              {text.split}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onMergeWithNext(paragraph.id)}>
              {text.mergeWithNext}
            </Button>
          </div>
        </div>
      </CollapsibleSection>
    </article>
  )
}
