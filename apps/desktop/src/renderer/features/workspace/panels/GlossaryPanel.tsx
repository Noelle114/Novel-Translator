import { BookMarked } from 'lucide-react'
import type { AppText } from '../../../app/types'

interface GlossaryPanelProps {
  text: AppText
}

/** Sözlük paneli — şimdilik placeholder, ileriye dönük */
export function GlossaryPanel({ text }: GlossaryPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{text.glossary}</h3>
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-4 text-center">
        <BookMarked className="h-5 w-5 text-muted-foreground/50" />
        <p className="text-xs text-muted-foreground">{text.glossaryComingSoon}</p>
      </div>
    </div>
  )
}
