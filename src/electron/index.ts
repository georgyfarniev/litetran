import { app, protocol, BrowserWindow, Request } from 'electron'
import * as path from 'path'
import * as url from 'url'

const DEV_URL = 'http://localhost:3000'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

function productionInterceptor(request: Request, callback: any) {
  const url = request.url.substr(7)    /* all urls start with 'file://' */
  const newPath = path.normalize(`${__dirname}/../../build/${url}`)
  callback(newPath)
}

function productionInterceptorError(err: Error) {
  if (err) {
    console.error('Failed to register protocol')
    process.exit(1)
  }
}

function createWindow() {
  const isDev = process.env.NODE_ENV === 'development'

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    frame: true
  })

  mainWindow.removeMenu()

  if (isDev) {
    mainWindow.loadURL(DEV_URL)
  } else {
    protocol.interceptFileProtocol(
      'file',
      productionInterceptor,
      productionInterceptorError
    )

    mainWindow.loadURL(
      url.format({
        pathname: 'index.html',
        protocol: 'file',
        slashes: true
      })
    )
  }

  mainWindow.webContents.openDevTools()
}


function main() {
  app.on('ready', createWindow)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
}

if (require.main === module) {
  main()
}