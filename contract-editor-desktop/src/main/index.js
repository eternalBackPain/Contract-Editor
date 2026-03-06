import { app, shell, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { basename, join, extname } from 'path'
import { readFileSync, existsSync, readdirSync } from 'fs'
import SaxonJS from 'saxon-js'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'


function buildProjectTree(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true })
  const folders = []
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const child = buildProjectTree(join(dirPath, entry.name))
      if (child.children.length > 0) {
        folders.push(child)
      }
      continue
    }

    if (entry.isFile() && extname(entry.name).toLowerCase() === '.txt') {
      files.push({
        type: 'file',
        name: entry.name,
        path: join(dirPath, entry.name)
      })
    }
  }

  folders.sort((a, b) => a.name.localeCompare(b.name))
  files.sort((a, b) => a.name.localeCompare(b.name))

  return {
    type: 'folder',
    name: basename(dirPath),
    path: dirPath,
    children: [...folders, ...files]
  }
}

async function selectProjectFolder(browserWindow) {
  const result = await dialog.showOpenDialog(browserWindow, {
    properties: ['openDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) return

  const rootPath = result.filePaths[0]
  const tree = buildProjectTree(rootPath)
  browserWindow.webContents.send('project-selected', tree)
}

//MENU

const isMac = process.platform === 'darwin'
const template = [
  // { role: 'appMenu' }
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
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {
        label: 'New Project',
        accelerator: isMac ? 'Cmd+Shift+N' : 'Ctrl+Shift+N',
        click: (_menuItem, browserWindow) => {
          const targetWindow = browserWindow || BrowserWindow.getFocusedWindow()
          if (!targetWindow) return
          selectProjectFolder(targetWindow)
        }
      },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
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
  // { role: 'viewMenu' }
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
  // { role: 'windowMenu' }
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

//CREATE WINDOW

function createWindow() {
  // Create the browser window.
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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}


// In command prompt, use the following command to compile the XSLT into a SEF file:
// cd C:\Users\johnn\Documents\GitHub\Contract-Editor\contract-editor-desktop\src\renderer\src\lib
// npx xslt3 -xsl:xslt/xml-to-html.xsl -export:xslt/xml-to-html.sef.json -nogo -t
// Then, copy the resulting sef.json into resources/xslt
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

ipcMain.handle('read-txt-file', async (_event, filePath) => {
  if (!filePath || typeof filePath !== 'string') return ''
  if (extname(filePath).toLowerCase() !== '.txt') {
    throw new Error('Only .txt files are supported')
  }
  return readFileSync(filePath, 'utf-8')
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

