import { ArrowLeft } from 'lucide-react'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Separator } from '../../components/ui/separator'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ProviderCard } from './ProviderCard'
import type { SettingsTabProps } from '../../app/types'

export function SettingsPage({
  language,
  onGoToLibrary,
  onSaveProvider,
  onSaveTechnicalSettings,
  onSelectTranslationProvider,
  onSetSelectedSettingsProvider,
  onSetSettings,
  onSetTranslationForm,
  onUpdateSelectedProviderDraft,
  providerCatalog,
  providerIds,
  providerSaveLoadState,
  providersCount,
  runProviderModels,
  selectedProviderDraft,
  selectedProviderModels,
  selectedProviderNotice,
  selectedProviderSavedConfig,
  selectedSettingsProvider,
  settings,
  text,
  translationForm
}: SettingsTabProps) {
  return (
    <ScrollArea className="h-full">
      <div className="mx-auto max-w-4xl space-y-8 p-6">

        {/* Ana sayfaya dön */}
        <div>
          <Button variant="ghost" size="sm" className="-ml-1 gap-1.5 text-xs" onClick={onGoToLibrary}>
            <ArrowLeft className="h-3.5 w-3.5" />
            {text.tabs.library}
          </Button>
        </div>

        {/* Sağlayıcı profilleri */}
        <section>
          <div className="mb-4">
            <h2 className="text-sm font-semibold">{text.aiProviderProfiles}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{text.providerProfileHint}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {providerIds.map((providerId) => (
              <ProviderCard
                key={providerId}
                providerId={providerId}
                providerLabel={providerCatalog[providerId].label}
                draft={selectedSettingsProvider === providerId ? selectedProviderDraft : {
                  model: providerCatalog[providerId].defaultModel,
                  timeoutMs: 30000,
                  retryCount: 2,
                  temperature: 0.2,
                  credentialLabel: 'Default',
                  apiKey: ''
                }}
                modelOptions={selectedSettingsProvider === providerId ? selectedProviderModels : providerCatalog[providerId].modelSuggestions}
                notice={selectedSettingsProvider === providerId ? selectedProviderNotice : null}
                isSaving={providerSaveLoadState[providerId]}
                onSave={() => {
                  onSetSelectedSettingsProvider(providerId)
                  return onSaveProvider(providerId)
                }}
                onUpdateDraft={(patch) => {
                  onSetSelectedSettingsProvider(providerId)
                  onUpdateSelectedProviderDraft(patch)
                }}
                text={text}
              />
            ))}
          </div>
        </section>

        <Separator />

        {/* Çalıştırma varsayılanları */}
        <section>
          <div className="mb-4">
            <h2 className="text-sm font-semibold">{text.runDefaults}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{text.activeProviderForTranslation}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Sağlayıcı */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">{text.provider}</label>
              <Select
                value={translationForm.providerId}
                onValueChange={(v) => {
                  onSelectTranslationProvider(v as typeof translationForm.providerId)
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {providerIds.map((id) => (
                    <SelectItem key={id} value={id} className="text-xs">{providerCatalog[id].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model */}
            <div className="flex flex-col gap-1 sm:col-span-1">
              <label className="text-xs text-muted-foreground">{text.model}</label>
              <Select
                value={translationForm.modelId}
                onValueChange={(v) => onSetTranslationForm((prev: typeof translationForm) => ({ ...prev, modelId: v }))}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {runProviderModels.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-xs">{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mod */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">{text.mode}</label>
              <Select
                value={translationForm.mode}
                onValueChange={(v) => onSetTranslationForm((prev: typeof translationForm) => ({ ...prev, mode: v as 'independent' | 'contextual' }))}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contextual" className="text-xs">{text.contextual}</SelectItem>
                  <SelectItem value="independent" className="text-xs">{text.independent}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sözlük birleştirme */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">{text.glossaryPriority}</label>
              <Select
                value={translationForm.glossaryMergeBehavior}
                onValueChange={(v) => onSetTranslationForm((prev: typeof translationForm) => ({ ...prev, glossaryMergeBehavior: v as typeof translationForm.glossaryMergeBehavior }))}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project_over_global" className="text-xs">{text.projectGlossaryFirst}</SelectItem>
                  <SelectItem value="global_over_project" className="text-xs">{text.globalGlossaryFirst}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <Separator />

        {/* Teknik varsayılanlar */}
        {settings && (
          <section>
            <div className="mb-4">
              <h2 className="text-sm font-semibold">{text.technicalDefaults}</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">{text.contextWindowRange}</label>
                <Input
                  type="number"
                  className="h-8 text-xs"
                  value={settings.technicalDefaults.contextWindow}
                  onChange={(e) =>
                    onSetSettings((prev) =>
                      prev
                        ? { ...prev, technicalDefaults: { ...prev.technicalDefaults, contextWindow: Number(e.target.value) } }
                        : prev
                    )
                  }
                  min={0}
                  max={3}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">{text.retryCount}</label>
                <Input
                  type="number"
                  className="h-8 text-xs"
                  value={settings.technicalDefaults.retryCount}
                  onChange={(e) =>
                    onSetSettings((prev) =>
                      prev
                        ? { ...prev, technicalDefaults: { ...prev.technicalDefaults, retryCount: Number(e.target.value) } }
                        : prev
                    )
                  }
                  min={0}
                  max={10}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">{text.timeoutMs}</label>
                <Input
                  type="number"
                  className="h-8 text-xs"
                  value={settings.technicalDefaults.timeoutMs}
                  onChange={(e) =>
                    onSetSettings((prev) =>
                      prev
                        ? { ...prev, technicalDefaults: { ...prev.technicalDefaults, timeoutMs: Number(e.target.value) } }
                        : prev
                    )
                  }
                  min={500}
                />
              </div>
            </div>

            <Button
              size="sm"
              className="mt-4 h-8 text-xs"
              onClick={() => void onSaveTechnicalSettings()}
            >
              {text.saveTechnicalDefaults}
            </Button>
          </section>
        )}

      </div>
    </ScrollArea>
  )
}
