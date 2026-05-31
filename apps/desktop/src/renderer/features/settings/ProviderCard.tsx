import { Loader2, Save } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { cn } from '../../lib/utils'
import type { AppText, ProviderDraft, ProviderModelInfo, ProviderId } from '../../app/types'

interface ProviderCardProps {
  isSaving: boolean
  modelOptions: ProviderModelInfo[]
  notice: { type: 'success' | 'error'; message: string } | null
  onSave: () => void | Promise<void>
  onUpdateDraft: (patch: Partial<ProviderDraft>) => void
  providerId: ProviderId
  providerLabel: string
  draft: ProviderDraft
  text: AppText
}

export function ProviderCard({
  isSaving,
  modelOptions,
  notice,
  onSave,
  onUpdateDraft,
  providerId,
  providerLabel,
  draft,
  text
}: ProviderCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">{providerLabel}</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Model seçici */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs text-muted-foreground">{text.model}</label>
          <Select value={draft.model} onValueChange={(v) => onUpdateDraft({ model: v })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder={text.modelPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-xs">{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* API Anahtarı */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs text-muted-foreground">{text.apiKeyOptional}</label>
          <Input
            type="password"
            className="h-8 text-xs"
            placeholder="sk-..."
            value={draft.apiKey}
            onChange={(e) => onUpdateDraft({ apiKey: e.target.value })}
          />
        </div>

        {/* Timeout */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">{text.timeoutShort} (ms)</label>
          <Input
            type="number"
            className="h-8 text-xs"
            value={draft.timeoutMs}
            onChange={(e) => onUpdateDraft({ timeoutMs: Number(e.target.value) })}
            min={500}
            max={180000}
          />
        </div>

        {/* Retry */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">{text.retryShort}</label>
          <Input
            type="number"
            className="h-8 text-xs"
            value={draft.retryCount}
            onChange={(e) => onUpdateDraft({ retryCount: Number(e.target.value) })}
            min={0}
            max={10}
          />
        </div>

        {/* Temperature (DeepL için gizle) */}
        {providerId !== 'deepl' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">{text.tempShort}</label>
            <Input
              type="number"
              className="h-8 text-xs"
              value={draft.temperature}
              onChange={(e) => onUpdateDraft({ temperature: Number(e.target.value) })}
              min={0}
              max={2}
              step={0.1}
            />
          </div>
        )}
      </div>

      {/* Bildirim */}
      {notice && (
        <p className={cn('mt-3 text-xs', notice.type === 'error' ? 'text-destructive' : 'text-green-600 dark:text-green-400')}>
          {notice.message}
        </p>
      )}

      {/* Kaydet butonu */}
      <Button
        size="sm"
        className="mt-4 h-8 gap-1.5 text-xs"
        onClick={() => void onSave()}
        disabled={isSaving}
      >
        {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
        {isSaving ? text.saving : `${providerLabel} ${text.configured}`}
      </Button>
    </div>
  )
}
