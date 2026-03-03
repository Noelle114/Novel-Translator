import * as electron from 'electron'
import type { BrowserWindow as BrowserWindowType } from 'electron'

const { BrowserWindow } = electron

export function createMainWindow(preloadPath: string): BrowserWindowType {
  const window = new BrowserWindow({
    width: 1480,
    height: 940,
    minWidth: 1100,
    minHeight: 700,
    show: false,
    backgroundColor: '#f5f4ef',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  })

  window.once('ready-to-show', () => {
    window.show()
  })

  return window
}
