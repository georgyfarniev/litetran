import {
  app,
  protocol,
  BrowserWindow,
  Tray,
  Menu,
  Request,
  globalShortcut,
  screen,
  ipcMain,
  Event,
  Rectangle
} from 'electron'
import * as path from 'path'
import * as url from 'url'
import { getSelectedText } from './platform'
import { Config } from './config'

const DEV_URL = 'http://localhost:3000'
const SHORTCUT = 'CommandOrControl+B'
const POPUP_CORNER_PADDING = 32
const MIN_WIDTH = 400
const MIN_HEIGHT = 400
const WINDOW_TITLE = 'LiteTran'
const TRAY_HINT = 'Show LiteTran'
const LOGO = path.normalize(`${__dirname}/../../public/logo.png`)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

class Application {
  private window?: BrowserWindow
  private tray?: Tray
  private config: Config = new Config()
  private quitting: boolean = false

  constructor() {
    app.on('ready', this.onReady.bind(this))
    app.on('before-quit', this.onBeforeQuit.bind(this))
    app.on('second-instance', this.onSecondInstance.bind(this))
    ipcMain.on('translated', this.popup.bind(this))
  }

  private registerShortcuts() {
    globalShortcut.register(SHORTCUT, this.translate.bind(this))
  }

  private calculateOptimalPopupPosition() {
    const { bounds } = screen.getPrimaryDisplay()
    const { width = 0, height = 0 } = this.window!.getBounds()
    let { x, y } = screen.getCursorScreenPoint()

    x += 16
    y += 16

    const p = POPUP_CORNER_PADDING
    const vDiff = (y + height) - (bounds.y + bounds.height) + p
    const hDiff = (x + width) - (bounds.x + bounds.width) + p

    return {
      x: hDiff > 0 ? x - hDiff : x,
      y: vDiff > 0 ? y - vDiff : y
    }
  }

  private popup() {
    const pos = this.calculateOptimalPopupPosition()

    this!.window!.setPosition(pos.x , pos.y)
    this.window?.show()
  }

  private async translate() {
    const selected = getSelectedText()
    this.window?.webContents.send('selection', selected)
  }

  private async quit() {
    await this.config.save({
      geometry: this.window?.getBounds()
    })
    this.quitting = true
    app.quit()
  }

  private activate() {
    this.window?.show()
  }

  private createWindow(geometry: Partial<Rectangle>) {
    const isDev = process.env.NODE_ENV === 'development'

    this.window = new BrowserWindow({
      icon: LOGO,
      title: WINDOW_TITLE,
      height: geometry.height,
      width: geometry.width,
      minWidth: MIN_WIDTH,
      minHeight: MIN_HEIGHT,
      x: geometry.x,
      y: geometry.y,
      webPreferences: {
        nodeIntegration: true
      }
    })

    this.window.on('close', this.onWindowClose.bind(this))
    this.window.removeMenu()

    if (isDev) {
      this.window.loadURL(DEV_URL)
      this.window.webContents.openDevTools({ mode: 'bottom' })
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

  private createTray() {
    const icon = LOGO
    this.tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Activate',
        type: 'normal',
        click: this.activate.bind(this)
      },
      {
        label: 'Exit',
        type: 'normal',
        click: this.quit.bind(this)
      },
    ])
    this.tray.setToolTip(TRAY_HINT)
    this.tray.setContextMenu(contextMenu)
    this.tray.on('click', this.activate.bind(this))
  }

  /* Event handlers */

  private onSecondInstance() {
    if (this.window) {
      this.activate()
    }
  }

  private onWindowClose(event: Event) {
    if (this.quitting) {
      return
    }

    event.preventDefault()
    this.window?.hide()
  }

  private async onReady() {
    const config = await this.config.read()

    this.createWindow(config.geometry)
    this.createTray()
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
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    console.log('application already running, exiting this instance')
    return app.quit()
  }

  new Application()
}

if (require.main === module) {
  main()
}
