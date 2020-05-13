import { app, protocol, BrowserWindow, Request, globalShortcut } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { getSelectedText } from './platform'

const DEV_URL = 'http://localhost:3000'
const SHORTCUT = 'Ctrl+T'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

class Application {
  private window?: BrowserWindow

  constructor() {
    app.on('ready', this.onReady.bind(this))
    app.on('window-all-closed', this.onAllWindowClosed.bind(this))
    app.on('activate', this.onActivate.bind(this))
    app.on('before-quit', this.onBeforeQuit.bind(this))
  }

  private registerShortcuts() {
     globalShortcut.register(SHORTCUT, this.translate.bind(this))
  }

  private async translate() {
    const selected = getSelectedText()

    this!.window!.setTitle(selected)
    this!.window!.show()
   }

  private createWindow() {
    const isDev = process.env.NODE_ENV === 'development'

    this.window = new BrowserWindow({
      height: 600,
      width: 800,
      // frame: true
    })

    this.window.removeMenu()

    if (isDev) {
      this.window.loadURL(DEV_URL)
      this.window.webContents.openDevTools()
    } else {
      protocol.interceptFileProtocol(
        'file',
        this.onIntercept.bind(this),
        this.onInterceptError.bind(this)
      )
  
      this.window.loadURL(
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
    this.registerShortcuts()
  }

  private onBeforeQuit() {
    globalShortcut.unregisterAll()
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
  const litetranApp = new Application()
}

if (require.main === module) {
  main()
}
