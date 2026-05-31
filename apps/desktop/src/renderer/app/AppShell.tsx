import type { ReactNode } from 'react'
import { AppHeader } from '../components/layout/AppHeader'
import type { AppPage, RendererViewModel } from './types'

type AppShellProps = RendererViewModel['shell'] & {
  children: ReactNode
}

export function AppShell({ activePage, children, language, onGoToPage, onSetLanguage, onSetTheme, text, theme }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppHeader
        activePage={activePage}
        language={language}
        onGoToLibrary={() => onGoToPage('library' as AppPage)}
        onGoToSettings={() => onGoToPage('settings' as AppPage)}
        onSetLanguage={onSetLanguage}
        onSetTheme={onSetTheme}
        text={text}
        theme={theme}
      />
      <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
