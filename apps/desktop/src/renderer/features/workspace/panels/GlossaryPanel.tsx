import { BookMarked, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import type { AppText, GlossaryPanelProps } from '../../../app/types'

export function GlossaryPanel({
  text,
  scope,
  onScopeChange,
  entries,
  importText,
  onImportTextChange,
  onImportText,
  onImportFile,
  onDelete,
  busy,
  notice
}: GlossaryPanelProps & { text: AppText }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-1">
        <Button
          variant={scope === 'project' ? 'secondary' : 'outline'}
          size="sm"
          className="h-7"
          onClick={() => onScopeChange('project')}
        >
          {text.projectGlossary}
        </Button>
        <Button
          variant={scope === 'global' ? 'secondary' : 'outline'}
          size="sm"
          className="h-7"
          onClick={() => onScopeChange('global')}
        >
          {text.globalGlossary}
        </Button>
      </div>

      <Textarea
        value={importText}
        onChange={(event) => onImportTextChange(event.target.value)}
        placeholder={text.glossaryImportHint}
        className="min-h-[60px] text-xs"
      />

      <div className="grid grid-cols-2 gap-1">
        <Button
          size="sm"
          className="h-7"
          disabled={busy || importText.trim().length === 0}
          onClick={() => void onImportText()}
        >
          {text.glossaryImport}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7"
          disabled={busy}
          onClick={() => void onImportFile()}
        >
          {text.glossaryImportFile}
        </Button>
      </div>

      {notice && (
        <p className={`text-xs ${notice.type === 'error' ? 'text-destructive' : 'text-primary'}`}>
          {notice.message}
        </p>
      )}

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-border py-3 text-center">
          <BookMarked className="h-4 w-4 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">{text.glossaryEmpty}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-1">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-card px-2 py-1"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{entry.sourceTerm}</p>
                {entry.targetTerm && (
                  <p className="truncate text-xs text-muted-foreground">{entry.targetTerm}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                disabled={busy}
                title={text.glossaryDelete}
                onClick={() => void onDelete(entry.id)}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
