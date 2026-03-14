import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

let projectWatchListener = null

const api = {
  openProjectFolder: () => ipcRenderer.invoke('open-project-folder'),
  listChildren: (dirPath) => ipcRenderer.invoke('list-children', dirPath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  createFile: (targetPath, name) =>
    ipcRenderer.invoke('explorer-action', { action: 'create-file', targetPath, name }),
  createFolder: (targetPath, name) =>
    ipcRenderer.invoke('explorer-action', { action: 'create-folder', targetPath, name }),
  renamePath: (targetPath, name) =>
    ipcRenderer.invoke('explorer-action', { action: 'rename', targetPath, name }),
  deletePath: (targetPath) =>
    ipcRenderer.invoke('explorer-action', { action: 'delete', targetPath }),
  watchProject: (callback) => {
    if (projectWatchListener) {
      ipcRenderer.removeListener('project-watch-event', projectWatchListener)
    }

    projectWatchListener = (_event, payload) => callback(payload)
    ipcRenderer.on('project-watch-event', projectWatchListener)

    return () => {
      if (!projectWatchListener) return
      ipcRenderer.removeListener('project-watch-event', projectWatchListener)
      projectWatchListener = null
    }
  },
  unwatchProject: () => {
    if (!projectWatchListener) return
    ipcRenderer.removeListener('project-watch-event', projectWatchListener)
    projectWatchListener = null
  },
  onMenuOpenProject: (callback) => {
    const listener = () => callback()
    ipcRenderer.on('menu-open-project', listener)
    return () => ipcRenderer.removeListener('menu-open-project', listener)
  },
  onMenuSave: (callback) => {
    const listener = () => callback()
    ipcRenderer.on('menu-save', listener)
    return () => ipcRenderer.removeListener('menu-save', listener)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
