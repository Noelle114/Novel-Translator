import type { ReactNode } from 'react'
import { Button } from '../components/ui/button'
import type { RendererViewModel } from './types'

type AppShellProps = RendererViewModel['shell'] & {
  children: ReactNode
}

export function AppShell({
  activeTab,
  appTabs,
  children,
  language,
  onSetActiveTab,
  onSetLanguage,
  onSetTheme,
  text,
  theme
}: AppShellProps) {
  return (
    <div className="surface-gradient mx-auto flex min-h-screen w-full max-w-[1720px] flex-col gap-4 p-4 md:p-6">
      <header className="section-reveal rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur md:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{text.appName}</p>
            <h1 className="text-balance font-serif text-2xl font-semibold leading-tight text-foreground md:text-3xl">
              {text.appTitle}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-[15px]">{text.appSubtitle}</p>
          </div>

          <div className="flex flex-col gap-3 xl:min-w-[520px] xl:items-end">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background/70 px-2 py-1">
                <span>{text.languageLabel}</span>
                <Button
                  size="sm"
                  className="rounded-sm"
                  variant={language === 'tr' ? 'secondary' : 'outline'}
                  onClick={() => onSetLanguage('tr')}
                >
                  TR
                </Button>
                <Button
                  size="sm"
                  className="rounded-sm"
                  variant={language === 'en' ? 'secondary' : 'outline'}
                  onClick={() => onSetLanguage('en')}
                >
                  EN
                </Button>
              </div>
              <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background/70 px-2 py-1">
                <span>{text.themeLabel}</span>
                <Button
                  size="sm"
                  className="rounded-sm"
                  variant={theme === 'dark' ? 'secondary' : 'outline'}
                  onClick={() => onSetTheme('dark')}
                >
                  {text.dark}
                </Button>
                <Button
                  size="sm"
                  className="rounded-sm"
                  variant={theme === 'light' ? 'secondary' : 'outline'}
                  onClick={() => onSetTheme('light')}
                >
                  {text.light}
                </Button>
              </div>
            </div>

            <nav className="inline-flex w-full rounded-xl border border-border/80 bg-muted/70 p-1 md:w-auto">
              {appTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'
                  }`}
                  onClick={() => onSetActiveTab(tab)}
                >
                  {text.tabs[tab]}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="stagger section-reveal flex-1">{children}</main>
    </div>
  )
}
