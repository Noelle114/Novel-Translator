import { BookOpen, Moon, Settings, Sun } from 'lucide-react'
import { Button } from '../ui/button'
import type { AppText } from '../../app/types'
import type { AppLanguage, AppTheme } from '../../i18n'

interface AppHeaderProps {
  /** Sayfa: settings sayfasındayken settings ikonu aktif görünür */
  activePage: string
  language: AppLanguage
  onGoToSettings: () => void
  onGoToLibrary: () => void
  onSetLanguage: (lang: AppLanguage) => void
  onSetTheme: (theme: AppTheme) => void
  text: AppText
  theme: AppTheme
}

export function AppHeader({ activePage, language, onGoToSettings, onGoToLibrary, onSetLanguage, onSetTheme, text, theme }: AppHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur">
      {/* Sol: Logo + İsim */}
      <button
        type="button"
        className="flex items-center gap-2 text-sm font-semibold tracking-tight transition-opacity hover:opacity-70"
        onClick={onGoToLibrary}
      >
        <BookOpen className="h-4 w-4 text-primary" />
        <span>{text.appName}</span>
      </button>

      {/* Sağ: Dil + Tema Toggle + Ayarlar */}
      <div className="flex items-center gap-1">
        {/* Dil seçici */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-semibold"
          onClick={() => onSetLanguage(language === 'tr' ? 'en' : language === 'en' ? 'zh' : 'tr')}
          title={text.languageLabel}
        >
          {language === 'tr' ? 'TR' : language === 'en' ? 'EN' : '中文'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onSetTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? text.light : text.dark}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button
          variant={activePage === 'settings' ? 'secondary' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onGoToSettings}
          title={text.tabs.settings}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
