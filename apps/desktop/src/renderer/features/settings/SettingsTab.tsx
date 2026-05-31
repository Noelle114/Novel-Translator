import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import type { SettingsTabProps } from '../../app/types'

export function SettingsTab({
  language,
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
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="section-reveal">
        <CardHeader>
          <CardTitle>{text.technicalDefaults}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label htmlFor="technical-context-window" className="text-xs font-medium">
              {text.contextWindowRange}
            </label>
            <Input
              id="technical-context-window"
              type="number"
              min={0}
              max={3}
              value={settings?.technicalDefaults.contextWindow ?? 2}
              onChange={(event) => {
                const value = Number(event.target.value)
                onSetSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        technicalDefaults: {
                          ...prev.technicalDefaults,
                          contextWindow: value
                        }
                      }
                    : prev
                )
              }}
            />
          </div>
          <div>
            <label htmlFor="technical-retry-count" className="text-xs font-medium">
              {text.retryCount}
            </label>
            <Input
              id="technical-retry-count"
              type="number"
              min={0}
              max={10}
              value={settings?.technicalDefaults.retryCount ?? 2}
              onChange={(event) => {
                const value = Number(event.target.value)
                onSetSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        technicalDefaults: {
                          ...prev.technicalDefaults,
                          retryCount: value
                        }
                      }
                    : prev
                )
              }}
            />
          </div>
          <div>
            <label htmlFor="technical-timeout-ms" className="text-xs font-medium">
              {text.timeoutMs}
            </label>
            <Input
              id="technical-timeout-ms"
              type="number"
              min={500}
              value={settings?.technicalDefaults.timeoutMs ?? 30000}
              onChange={(event) => {
                const value = Number(event.target.value)
                onSetSettings((prev) =>
                  prev
                    ? {
                        ...prev,
                        technicalDefaults: {
                          ...prev.technicalDefaults,
                          timeoutMs: value
                        }
                      }
                    : prev
                )
              }}
            />
          </div>
          <Button variant="secondary" onClick={() => void onSaveTechnicalSettings()} disabled={!settings}>
            {text.saveTechnicalDefaults}
          </Button>
        </CardContent>
      </Card>

      <Card className="section-reveal">
        <CardHeader>
          <CardTitle>{text.aiProviderProfiles}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">{text.providerProfileHint}</p>

          <div className="grid grid-cols-3 gap-2">
            {providerIds.map((providerId) => (
              <Button
                key={providerId}
                variant={selectedSettingsProvider === providerId ? 'secondary' : 'outline'}
                onClick={() => onSetSelectedSettingsProvider(providerId)}
              >
                {providerCatalog[providerId].label}
              </Button>
            ))}
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/60 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                {providerCatalog[selectedSettingsProvider].label} {text.modelListSuffix}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedProviderModels.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  className={`rounded-full border px-2.5 py-1 text-xs transition ${
                    selectedProviderDraft.model === model.id
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-ring/50'
                  }`}
                  onClick={() => {
                    onUpdateSelectedProviderDraft({ model: model.id })
                    if (translationForm.providerId === selectedSettingsProvider) {
                      onSetTranslationForm((prev) => ({ ...prev, modelId: model.id }))
                    }
                  }}
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="provider-model" className="text-xs font-medium">
                {text.modelId}
              </label>
              <Input
                id="provider-model"
                list="provider-model-list"
                value={selectedProviderDraft.model}
                onChange={(event) => {
                  const nextModelId = event.target.value
                  onUpdateSelectedProviderDraft({ model: nextModelId })
                  if (translationForm.providerId === selectedSettingsProvider) {
                    onSetTranslationForm((prev) => ({ ...prev, modelId: nextModelId }))
                  }
                }}
                placeholder={text.modelPlaceholder}
              />
              <datalist id="provider-model-list">
                {selectedProviderModels.map((model) => (
                  <option key={model.id} value={model.id} label={model.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="provider-timeout" className="text-xs font-medium">
                {text.timeoutMs}
              </label>
              <Input
                id="provider-timeout"
                type="number"
                min={500}
                value={selectedProviderDraft.timeoutMs}
                onChange={(event) => onUpdateSelectedProviderDraft({ timeoutMs: Number(event.target.value) })}
              />
            </div>
            <div>
              <label htmlFor="provider-retry" className="text-xs font-medium">
                {text.retryCount}
              </label>
              <Input
                id="provider-retry"
                type="number"
                min={0}
                max={10}
                value={selectedProviderDraft.retryCount}
                onChange={(event) => onUpdateSelectedProviderDraft({ retryCount: Number(event.target.value) })}
              />
            </div>
            <div>
              <label htmlFor="provider-temperature" className="text-xs font-medium">
                {text.tempShort}
              </label>
              <Input
                id="provider-temperature"
                type="number"
                min={0}
                max={2}
                step={0.1}
                value={selectedProviderDraft.temperature}
                onChange={(event) => onUpdateSelectedProviderDraft({ temperature: Number(event.target.value) })}
              />
            </div>
            <div>
              <label htmlFor="provider-credential-label" className="text-xs font-medium">
                {text.credentialLabel}
              </label>
              <Input
                id="provider-credential-label"
                value={selectedProviderDraft.credentialLabel}
                onChange={(event) => onUpdateSelectedProviderDraft({ credentialLabel: event.target.value })}
                placeholder={text.credentialLabel}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="provider-api-key" className="text-xs font-medium">
                {text.apiKeyOptional}
              </label>
              <Input
                id="provider-api-key"
                type="password"
                value={selectedProviderDraft.apiKey}
                onChange={(event) => onUpdateSelectedProviderDraft({ apiKey: event.target.value })}
                placeholder={text.apiKey}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => void onSaveProvider(selectedSettingsProvider)}
              disabled={providerSaveLoadState[selectedSettingsProvider]}
            >
              {providerSaveLoadState[selectedSettingsProvider]
                ? text.saving
                : `${language === 'tr' ? 'Kaydet' : 'Save'} ${providerCatalog[selectedSettingsProvider].label} ${
                    language === 'tr' ? 'Ayarlarini' : 'Settings'
                  }`}
            </Button>
            <p className="text-xs text-muted-foreground">
              {text.configured}: {selectedProviderSavedConfig ? text.yes : text.no} | {text.totalConfiguredProviders}:{' '}
              {providersCount}
            </p>
          </div>
          {selectedProviderNotice && (
            <p className={`text-xs ${selectedProviderNotice.type === 'error' ? 'text-destructive' : 'text-primary'}`}>
              {selectedProviderNotice.message}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="section-reveal xl:col-span-2">
        <CardHeader>
          <CardTitle>{text.runDefaults}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{text.activeProviderForTranslation}</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {providerIds.map((providerId) => (
                <Button
                  key={providerId}
                  variant={translationForm.providerId === providerId ? 'secondary' : 'outline'}
                  onClick={() => onSelectTranslationProvider(providerId)}
                >
                  {providerCatalog[providerId].label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label htmlFor="run-model-id" className="text-xs font-medium">
                {text.runModelId}
              </label>
              <Input
                id="run-model-id"
                list="run-provider-model-list"
                value={translationForm.modelId}
                onChange={(event) => onSetTranslationForm((prev) => ({ ...prev, modelId: event.target.value }))}
                placeholder={text.modelId}
              />
              <datalist id="run-provider-model-list">
                {runProviderModels.map((model) => (
                  <option key={model.id} value={model.id} label={model.name} />
                ))}
              </datalist>
            </div>
            <div className="rounded-md border border-border bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                {providerCatalog[translationForm.providerId].label} {text.loadedFromProfile}
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <span>
                  {text.timeoutShort}: {translationForm.timeoutMs} ms
                </span>
                <span>
                  {text.retryShort}: {translationForm.retryCount}
                </span>
                <span>
                  {text.tempShort}: {translationForm.temperature ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label htmlFor="run-context-window" className="text-xs font-medium">
                {text.contextWindow}
              </label>
              <Input
                id="run-context-window"
                type="number"
                min={0}
                max={3}
                value={translationForm.contextWindow}
                onChange={(event) =>
                  onSetTranslationForm((prev) => ({ ...prev, contextWindow: Number(event.target.value) }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={translationForm.mode === 'contextual' ? 'secondary' : 'outline'}
                onClick={() => onSetTranslationForm((prev) => ({ ...prev, mode: 'contextual' }))}
              >
                {text.contextual}
              </Button>
              <Button
                variant={translationForm.mode === 'independent' ? 'secondary' : 'outline'}
                onClick={() => onSetTranslationForm((prev) => ({ ...prev, mode: 'independent' }))}
              >
                {text.independent}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={translationForm.glossaryMergeBehavior === 'project_over_global' ? 'secondary' : 'outline'}
              onClick={() =>
                onSetTranslationForm((prev) => ({
                  ...prev,
                  glossaryMergeBehavior: 'project_over_global'
                }))
              }
            >
              {text.projectGlossaryFirst}
            </Button>
            <Button
              variant={translationForm.glossaryMergeBehavior === 'global_over_project' ? 'secondary' : 'outline'}
              onClick={() =>
                onSetTranslationForm((prev) => ({
                  ...prev,
                  glossaryMergeBehavior: 'global_over_project'
                }))
              }
            >
              {text.globalGlossaryFirst}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">{text.providerSwitchHint}</p>
        </CardContent>
      </Card>
    </div>
  )
}
