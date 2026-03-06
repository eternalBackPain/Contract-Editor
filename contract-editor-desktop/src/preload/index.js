import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  transformXmlToHtml: (xmlString) => ipcRenderer.invoke('xml-to-html', xmlString),
  readTxtFile: (filePath) => ipcRenderer.invoke('read-txt-file', filePath),
  writeTxtFile: (filePath, content) => ipcRenderer.invoke('write-txt-file', filePath, content),
  onProjectSelected: (callback) => {
    const listener = (_event, projectTree) => callback(projectTree)
    ipcRenderer.on('project-selected', listener)
    return () => ipcRenderer.removeListener('project-selected', listener)
  },
  onMenuSave: (callback) => {
    const listener = () => callback()
    ipcRenderer.on('menu-save', listener)
    return () => ipcRenderer.removeListener('menu-save', listener)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
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
