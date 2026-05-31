import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { ScrollArea } from '../../../components/ui/scroll-area'
import type { ErrorState } from '@mtn/shared'
import type { AppText } from '../../../app/types'

interface ErrorPanelProps {
  errors: ErrorState[]
  onDeleteError: (errorId: string) => void | Promise<void>
  onResolveError: (errorId: string) => void | Promise<void>
  text: AppText
}

export function ErrorPanel({ errors, onDeleteError, onResolveError, text }: ErrorPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{text.errorCenter}</h3>
        {errors.length > 0 && (
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
            {errors.length}
          </span>
        )}
      </div>

      {errors.length === 0 ? (
        <p className="text-xs text-muted-foreground">{text.noErrors}</p>
      ) : (
        <ScrollArea className="max-h-48">
          <div className="space-y-2 pr-2">
            {errors.map((error) => (
              <div key={error.id} className="rounded-lg border border-destructive/20 bg-destructive/5 p-2.5">
                <p className="mb-1 text-xs font-medium text-destructive">{error.errorType}</p>
                {error.normalizedMessage && (
                  <p className="mb-2 text-xs text-muted-foreground line-clamp-2">{error.normalizedMessage}</p>
                )}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 gap-1 text-xs"
                    onClick={() => void onResolveError(error.id)}
                  >
                    <CheckCircle className="h-3 w-3" />
                    {text.markResolved}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => void onDeleteError(error.id)}
                    title={text.deleteError}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
