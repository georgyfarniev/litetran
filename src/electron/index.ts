import { app, protocol, BrowserWindow, Request } from 'electron'
import * as path from 'path'
import * as url from 'url'

const DEV_URL = 'http://localhost:3000'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

class Application {
  constructor() {
    app.on('ready', this.onReady.bind(this))
    app.on('window-all-closed', this.onAllWindowClosed.bind(this))
    app.on('activate', this.onActivate.bind(this))
    app.on('before-quit', this.onBeforeQuit.bind(this))
  }

  private createWindow() {
    const isDev = process.env.NODE_ENV === 'development'

    const mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      frame: true
    })

    mainWindow.removeMenu()

    if (isDev) {
      mainWindow.loadURL(DEV_URL)
      mainWindow.webContents.openDevTools()
    } else {
      protocol.interceptFileProtocol(
        'file',
        this.onIntercept.bind(this),
        this.onInterceptError.bind(this)
      )
  
      mainWindow.loadURL(
        url.format({
          pathname: 'index.html',
          protocol: 'file',
          slashes: true
        })
      )
    }
  }

  /* Event handlers */

  private onAllWindowClosed() {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }

  private onActivate() {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createWindow()
    }
  }

  private onReady() {
    this.createWindow()
  }

  private onBeforeQuit() {

  }

  private onIntercept(request: Request, callback: any) {
    const url = request.url.substr(7)    /* all urls start with 'file://' */
    const newPath = path.normalize(`${__dirname}/../../build/${url}`)
    callback(newPath)
  }
  
  private onInterceptError(err: Error) {
    if (err) {
      console.error('Failed to register protocol')
      process.exit(1)
    }
  }
}

function main() {
  const app = new Application()
}

if (require.main === module) {
  main()
}
