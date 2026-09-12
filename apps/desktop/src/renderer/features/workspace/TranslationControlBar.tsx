import { Pause, Play, Square, RotateCcw } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Progress } from '../../components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { cn } from '../../lib/utils'
import type { AppText, TranslationForm, ProviderModelInfo } from '../../app/types'

interface TranslationControlBarProps {
  canPauseRun: boolean
  canResumeRun: boolean
  canStartRun: boolean
  canStopRun: boolean
  isRunActionBusy: boolean
  jobState: { state: string; progress: number }
  localizedJobState: string
  onPauseTranslation: () => void | Promise<void>
  onResumeTranslation: () => void | Promise<void>
  onStartTranslation: () => void | Promise<void>
  onStopTranslation: () => void | Promise<void>
  onSetTranslationForm: (patch: Partial<TranslationForm>) => void
  runProviderModels: ProviderModelInfo[]
  text: AppText
  translationForm: TranslationForm
}

/** Durum → renk */
const stateColor: Record<string, string> = {
  translating: 'text-blue-600 dark:text-blue-400',
  paused: 'text-yellow-600 dark:text-yellow-400',
  paused_error_waiting_user: 'text-red-600 dark:text-red-400',
  completed: 'text-green-600 dark:text-green-400',
  failed: 'text-red-600 dark:text-red-400',
  cancelled: 'text-muted-foreground',
  idle: 'text-muted-foreground',
  ready: 'text-muted-foreground'
}

const PROVIDER_LABELS: Record<string, string> = { openai: 'OpenAI', gemini: 'Gemini', deepl: 'DeepL', deepseek: 'DeepSeek' }

export function TranslationControlBar({
  canPauseRun,
  canResumeRun,
  canStartRun,
  canStopRun,
  isRunActionBusy,
  jobState,
  localizedJobState,
  onPauseTranslation,
  onResumeTranslation,
  onStartTranslation,
  onStopTranslation,
  onSetTranslationForm,
  runProviderModels,
  text,
  translationForm
}: TranslationControlBarProps) {
  const progressPercent = Math.round(jobState.progress * 100)
  const isActive = jobState.state === 'translating' || jobState.state === 'paused' || jobState.state === 'paused_error_waiting_user'

  return (
    <div className="flex shrink-0 flex-col gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        {/* Sağlayıcı seçici (kompakt) */}
        <Select
          value={translationForm.providerId}
          onValueChange={(v) => onSetTranslationForm({ providerId: v as TranslationForm['providerId'] })}
        >
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['openai', 'gemini', 'deepl', 'deepseek'] as const).map((id) => (
              <SelectItem key={id} value={id} className="text-xs">
                {PROVIDER_LABELS[id]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Model seçici */}
        <Select
          value={translationForm.modelId}
          onValueChange={(v) => onSetTranslationForm({ modelId: v })}
        >
          <SelectTrigger className="h-8 w-40 text-xs">
            <SelectValue placeholder={text.model} />
          </SelectTrigger>
          <SelectContent>
            {runProviderModels.map((m) => (
              <SelectItem key={m.id} value={m.id} className="text-xs">
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Boşluk */}
        <div className="flex-1" />

        {/* Durum */}
        {isActive && (
          <span className={cn('text-xs font-medium', stateColor[jobState.state] ?? 'text-muted-foreground')}>
            {localizedJobState}
            {progressPercent > 0 && ` — ${progressPercent}%`}
          </span>
        )}

        {/* Kontrol butonları */}
        {canStartRun && (
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => void onStartTranslation()} disabled={isRunActionBusy}>
            <Play className="h-3 w-3" />
            {text.start}
          </Button>
        )}
        {canPauseRun && (
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={() => void onPauseTranslation()} disabled={isRunActionBusy}>
            <Pause className="h-3 w-3" />
            {text.pause}
          </Button>
        )}
        {canResumeRun && (
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={() => void onResumeTranslation()} disabled={isRunActionBusy}>
            <RotateCcw className="h-3 w-3" />
            {text.resume}
          </Button>
        )}
        {canStopRun && (
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => void onStopTranslation()} disabled={isRunActionBusy}>
            <Square className="h-3 w-3" />
            {text.stop}
          </Button>
        )}
      </div>

      {/* İlerleme çubuğu */}
      {isActive && (
        <Progress value={progressPercent} className="h-1" />
      )}
    </div>
  )
}
