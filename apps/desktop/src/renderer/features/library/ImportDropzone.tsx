import type { DragEvent } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { cn } from '../../lib/utils'
import type { AppText, ImportFeedback } from '../../app/types'

interface ImportDropzoneProps {
  importFeedback: ImportFeedback | null
  importName: string
  importPath: string
  isDropActive: boolean
  isImporting: boolean
  onCreateProject: () => void | Promise<void>
  onDropZoneDragLeave: (event: DragEvent<HTMLDivElement>) => void
  onDropZoneDragOver: (event: DragEvent<HTMLDivElement>) => void
  onDropZoneDrop: (event: DragEvent<HTMLDivElement>) => void
  onPickImportFile: () => void | Promise<void>
  setImportName: (value: string) => void
  text: AppText
}

export function ImportDropzone({
  importFeedback,
  importName,
  importPath,
  isDropActive,
  isImporting,
  onCreateProject,
  onDropZoneDragLeave,
  onDropZoneDragOver,
  onDropZoneDrop,
  onPickImportFile,
  setImportName,
  text
}: ImportDropzoneProps) {
  const hasFile = importPath.trim().length > 0

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Drag & Drop alanı */}
      <div
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors',
          isDropActive
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
        )}
        onDragOver={onDropZoneDragOver}
        onDragLeave={onDropZoneDragLeave}
        onDrop={onDropZoneDrop}
        onClick={() => void onPickImportFile()}
      >
        <Upload className={cn('h-8 w-8 transition-colors', isDropActive ? 'text-primary' : 'text-muted-foreground')} />
        <div className="space-y-1">
          <p className="text-sm font-medium">{hasFile ? importPath.split(/[\\/]/).pop() : text.dropFile}</p>
          <p className="text-xs text-muted-foreground">{text.pickFromDisk}</p>
        </div>
      </div>

      {/* Proje adı */}
      {hasFile && (
        <Input
          placeholder={text.projectNameOptional}
          value={importName}
          onChange={(e) => setImportName(e.target.value)}
        />
      )}

      {/* Geri bildirim */}
      {importFeedback && (
        <p
          className={cn(
            'text-xs',
            importFeedback.type === 'error' ? 'text-destructive' : 'text-green-600 dark:text-green-400'
          )}
        >
          {importFeedback.message}
        </p>
      )}

      {/* İçe Aktar butonu */}
      {hasFile && (
        <Button onClick={() => void onCreateProject()} disabled={isImporting} className="w-full">
          {isImporting ? text.importing : text.importToLibrary}
        </Button>
      )}
    </div>
  )
}
