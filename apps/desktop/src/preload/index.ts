import * as electron from 'electron'
import type { IpcRendererEvent } from 'electron'
import type { ErrorState } from '@mtn/shared'

const { contextBridge, ipcRenderer } = electron

type JobEvent =
  | { type: 'state'; projectId: string; runId: string; state: string; progress: number }
  | { type: 'error'; projectId: string; error: ErrorState }

const api = {
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    updateTechnical: (payload: unknown) => ipcRenderer.invoke('settings:updateTechnical', payload),
    listProviders: () => ipcRenderer.invoke('settings:providers:list'),
    upsertProvider: (payload: unknown) => ipcRenderer.invoke('settings:providers:upsert', payload),
    listModels: (payload: unknown) => ipcRenderer.invoke('settings:providers:listModels', payload)
  },
  credentials: {
    set: (payload: unknown) => ipcRenderer.invoke('credentials:set', payload),
    delete: (payload: unknown) => ipcRenderer.invoke('credentials:delete', payload),
    get: (payload: unknown) => ipcRenderer.invoke('credentials:get', payload)
  },
  projects: {
    createFromFile: (payload: unknown) => ipcRenderer.invoke('projects:createFromFile', payload),
    list: () => ipcRenderer.invoke('projects:list'),
    open: (payload: unknown) => ipcRenderer.invoke('projects:open', payload),
    delete: (payload: unknown) => ipcRenderer.invoke('projects:delete', payload)
  },
  files: {
    pickImport: () => ipcRenderer.invoke('files:pickImport'),
    pickExportPath: (payload: unknown) => ipcRenderer.invoke('files:pickExportPath', payload)
  },
  translation: {
    start: (payload: unknown) => ipcRenderer.invoke('translation:start', payload),
    pause: (payload: unknown) => ipcRenderer.invoke('translation:pause', payload),
    resume: (payload: unknown) => ipcRenderer.invoke('translation:resume', payload),
    stop: (payload: unknown) => ipcRenderer.invoke('translation:stop', payload),
    retryParagraph: (payload: unknown) => ipcRenderer.invoke('translation:retryParagraph', payload),
    alternativeParagraph: (payload: unknown) => ipcRenderer.invoke('translation:alternativeParagraph', payload)
  },
  editor: {
    listParagraphs: (payload: unknown) => ipcRenderer.invoke('editor:listParagraphs', payload),
    updateParagraph: (payload: unknown) => ipcRenderer.invoke('editor:updateParagraph', payload),
    splitParagraph: (payload: unknown) => ipcRenderer.invoke('editor:splitParagraph', payload),
    mergeParagraph: (payload: unknown) => ipcRenderer.invoke('editor:mergeParagraph', payload)
  },
  export: {
    start: (payload: unknown) => ipcRenderer.invoke('export:start', payload),
    startWithPath: (payload: unknown) => ipcRenderer.invoke('export:startWithPath', payload),
    listProfiles: (payload: unknown) => ipcRenderer.invoke('export:profiles:list', payload),
    upsertProfile: (payload: unknown) => ipcRenderer.invoke('export:profiles:upsert', payload)
  },
  jobs: {
    getState: (payload: unknown) => ipcRenderer.invoke('jobs:getState', payload),
    subscribe: (projectId: string, callback: (event: JobEvent) => void) => {
      const listener = (_event: IpcRendererEvent, event: JobEvent) => {
        if (event.projectId === projectId) {
          callback(event)
        }
      }
      ipcRenderer.on('jobs:event', listener)
      return () => {
        ipcRenderer.removeListener('jobs:event', listener)
      }
    }
  },
  errors: {
    list: (payload: unknown) => ipcRenderer.invoke('errors:list', payload),
    resolve: (payload: unknown) => ipcRenderer.invoke('errors:resolve', payload),
    delete: (payload: unknown) => ipcRenderer.invoke('errors:delete', payload)
  }
}

contextBridge.exposeInMainWorld('api', api)

export type DesktopApi = typeof api
export type { JobEvent }

