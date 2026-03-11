import { app, shell, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { basename, dirname, extname, join, resolve } from 'path'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  watch,
  writeFileSync
} from 'fs'
import SaxonJS from 'saxon-js'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function normalizePath(inputPath) {
  const resolvedPath = resolve(inputPath)
  const slashPath = resolvedPath.replace(/\\/g, '/')
  return process.platform === 'win32' ? slashPath.toLowerCase() : slashPath
}

function compareByName(a, b) {
  return a.name.localeCompare(b.name)
}

function isWithinRoot(rootPath, targetPath) {
  const normalizedRoot = normalizePath(rootPath)
  const normalizedTarget = normalizePath(targetPath)
  return normalizedTarget === normalizedRoot || normalizedTarget.startsWith(`${normalizedRoot}/`)
}

function listDirectoryChildren(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true })
  const folders = []
  const files = []

  for (const entry of entries) {
    const childPath = join(dirPath, entry.name)
    if (entry.isDirectory()) {
      folders.push({
        type: 'folder',
        name: entry.name,
        path: childPath
      })
      continue
    }
    if (entry.isFile()) {
      files.push({
        type: 'file',
        name: entry.name,
        path: childPath
      })
    }
  }

  folders.sort(compareByName)
  files.sort(compareByName)
  return [...folders, ...files]
}

let activeProjectRoot = ''
let projectWatcher = null

function stopProjectWatcher() {
  if (projectWatcher) {
    projectWatcher.close()
    projectWatcher = null
  }
}

function broadcastProjectWatchEvent(event) {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send('project-watch-event', event)
  }
}

function startProjectWatcher(rootPath) {
  stopProjectWatcher()

  try {
    projectWatcher = watch(rootPath, { recursive: true }, (eventType, filename) => {
      if (!filename) return

      const changedPath = join(rootPath, filename.toString())
      let changeType = 'changed'
      if (eventType === 'rename') {
        changeType = existsSync(changedPath) ? 'created' : 'deleted'
      }

      broadcastProjectWatchEvent({
        type: changeType,
        path: changedPath
      })
    })
  } catch (error) {
    console.error('Failed to start project watcher', error)
    projectWatcher = null
  }
}

function assertInActiveRoot(targetPath) {
  if (!activeProjectRoot) {
    throw new Error('No project is currently open')
  }
  if (!isWithinRoot(activeProjectRoot, targetPath)) {
    throw new Error('Path is outside the active project root')
  }
}

async function openProjectFolder(browserWindow) {
  const result = await dialog.showOpenDialog(browserWindow, {
    properties: ['openDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) return null

  const rootPath = result.filePaths[0]
  activeProjectRoot = rootPath
  startProjectWatcher(rootPath)

  return {
    type: 'folder',
    name: basename(rootPath),
    path: rootPath
  }
}

//MENU

const isMac = process.platform === 'darwin'
const template = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ]
        }
      ]
    : []),
  {
    label: 'File',
    submenu: [
      {
        label: 'New Project',
        accelerator: isMac ? 'Cmd+Shift+N' : 'Ctrl+Shift+N',
        click: (_menuItem, browserWindow) => {
          const targetWindow = browserWindow || BrowserWindow.getFocusedWindow()
          if (!targetWindow) return
          targetWindow.webContents.send('menu-open-project')
        }
      },
      {
        label: 'Save',
        accelerator: isMac ? 'Cmd+S' : 'Ctrl+S',
        click: (_menuItem, browserWindow) => {
          const targetWindow = browserWindow || BrowserWindow.getFocusedWindow()
          if (!targetWindow) return
          targetWindow.webContents.send('menu-save')
        }
      },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
            }
          ]
        : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
        : [{ role: 'close' }])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

const sefRelativePath = join('resources', 'xslt', 'xml-to-html.sef.json')
let sefCache = null

function resolveSefPath() {
  const candidates = [
    join(process.resourcesPath, 'xslt', 'xml-to-html.sef.json'),
    join(process.resourcesPath, sefRelativePath),
    join(app.getAppPath(), sefRelativePath),
    join(__dirname, '../renderer/assets/xml-to-html.sef.json'),
    join(process.cwd(), 'src', 'renderer', 'src', 'lib', 'xslt', 'xml-to-html.sef.json'),
    join(process.cwd(), 'contract-editor-desktop', 'src', 'renderer', 'src', 'lib', 'xslt', 'xml-to-html.sef.json')
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }
  throw new Error('SaxonJS SEF not found. Tried: ' + candidates.join(', '))
}

function getSefText() {
  if (!sefCache) {
    const sefPath = resolveSefPath()
    sefCache = readFileSync(sefPath, 'utf-8')
  }
  return sefCache
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('xml-to-html', async (_event, xmlString) => {
  if (!xmlString || typeof xmlString !== 'string') return ''
  try {
    const result = SaxonJS.transform({
      stylesheetText: getSefText(),
      sourceText: xmlString,
      destination: 'serialized'
    })
    return result.principalResult || ''
  } catch (error) {
    console.error('XML transform failed', error)
    throw error
  }
})

ipcMain.handle('open-project-folder', async (event) => {
  const targetWindow = BrowserWindow.fromWebContents(event.sender) || BrowserWindow.getFocusedWindow()
  if (!targetWindow) return null
  return openProjectFolder(targetWindow)
})

ipcMain.handle('list-children', async (_event, dirPath) => {
  if (!dirPath || typeof dirPath !== 'string') return []
  assertInActiveRoot(dirPath)
  return listDirectoryChildren(dirPath)
})

ipcMain.handle('read-file', async (_event, filePath) => {
  if (!filePath || typeof filePath !== 'string') return ''
  assertInActiveRoot(filePath)
  return readFileSync(filePath, 'utf-8')
})

ipcMain.handle('write-file', async (_event, filePath, content) => {
  if (!filePath || typeof filePath !== 'string') return false
  assertInActiveRoot(filePath)
  if (extname(filePath).toLowerCase() !== '.txt') {
    throw new Error('Only .txt files are supported')
  }
  writeFileSync(filePath, typeof content === 'string' ? content : '', 'utf-8')
  return true
})

ipcMain.handle('explorer-action', async (_event, payload) => {
  const { action, targetPath, name } = payload || {}
  if (!action || !targetPath || typeof targetPath !== 'string') {
    throw new Error('Invalid explorer action payload')
  }

  assertInActiveRoot(targetPath)

  if (action === 'create-file') {
    const nextPath = join(targetPath, name || 'untitled.txt')
    assertInActiveRoot(nextPath)
    writeFileSync(nextPath, '', 'utf-8')
    return { path: nextPath }
  }

  if (action === 'create-folder') {
    const nextPath = join(targetPath, name || 'new-folder')
    assertInActiveRoot(nextPath)
    mkdirSync(nextPath, { recursive: false })
    return { path: nextPath }
  }

  if (action === 'rename') {
    if (!name || typeof name !== 'string') {
      throw new Error('A new name is required for rename')
    }
    const parentPath = dirname(targetPath)
    const nextPath = join(parentPath, name)
    assertInActiveRoot(nextPath)
    renameSync(targetPath, nextPath)
    return { path: nextPath }
  }

  if (action === 'delete') {
    rmSync(targetPath, { recursive: true, force: false })
    return { deleted: true }
  }

  throw new Error(`Unknown explorer action: ${action}`)
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  stopProjectWatcher()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
