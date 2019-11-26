'use strict'
const { app } = require('electron')
const { is } = require('electron-util')
const fs = require('fs')
const path = require('path')
const { windows, UPDATE_WINDOW } = require('./config')
const createUpdateWindow = require('./windows/update')
const { checkWheelChairVersion } = require('./Utils')
const { unregisterAll } = require('electron-localshortcut')
const unhandled = require('electron-unhandled')

// Handle unexepcted errors
unhandled();

// Check Wheelchair version
(async () => {
  await checkWheelChairVersion()
})()

// checks if extension folder is created
// if not create
try {
  if (!fs.existsSync(path.join(app.getAppPath(), '..\\extensions'))) {
    fs.mkdirSync(path.join(app.getAppPath(), '..\\extensions'))
  }
} catch (e) {}

app.commandLine.appendSwitch('disable-frame-rate-limit')
app.commandLine.appendSwitch('enable-quic')
app.commandLine.appendSwitch('high-dpi-support', 1)
app.commandLine.appendSwitch('ignore-gpu-blacklist')

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit()
}

app.on('second-instance', () => {
  if (windows[UPDATE_WINDOW]) {
    if (windows[UPDATE_WINDOW].isMinimized()) {
      windows[UPDATE_WINDOW].restore()
    }
    windows[UPDATE_WINDOW].show()
  }
})

app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit()
    process.exit()
  }
})

app.on('activate', async () => {
  if (!windows[UPDATE_WINDOW]) {
    windows[UPDATE_WINDOW] = await createUpdateWindow()
  }
})
app.once('before-quit', () => {
  unregisterAll()
  windows[UPDATE_WINDOW].close()
  process.exit()
})

app.once('ready', async () => {
  windows[UPDATE_WINDOW] = await createUpdateWindow()
})
