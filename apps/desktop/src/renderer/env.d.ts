/// <reference types="vite/client" />
import type { DesktopApi } from '../preload/index'

declare global {
  interface Window {
    api: DesktopApi
  }
}

export {}
