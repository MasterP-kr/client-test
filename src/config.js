'use strict'
const Store = require('electron-store')
const { clipboard, app } = require('electron')
const { machineIdSync } = require('node-machine-id')
// used for wheel chair extesion
const machineId = machineIdSync()

// BrowserWindows
const UPDATE_WINDOW = 0
const GAME_WINDOW = 1
const windows = []

// Regex to test for valid game url
const URL_REGEX = /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?game=.+)$/
// Init store
const store = new Store({
  defaults: {
    isFullScreen: false
  }
})

// Setup keybinds for client
const KEY_BINDS = {
  F5: () => {
    if (windows[GAME_WINDOW]) {
      windows[GAME_WINDOW].webContents.reloadIgnoringCache()
    }
  },
  F11: () => {
    if (windows[GAME_WINDOW]) {
      const full = !windows[GAME_WINDOW].isFullScreen()
      windows[GAME_WINDOW].setFullScreen(full)
      store.set('isFullScreen', full)
    }
  },
  F12: () => {
    if (windows[GAME_WINDOW]) {
      windows[GAME_WINDOW].openDevTools()
    }
  },
  Esc: () => {
    if (windows[GAME_WINDOW]) {
      windows[GAME_WINDOW].webContents.executeJavaScript('document.exitPointerLock()')
      windows[GAME_WINDOW].webContents.send('esc')
    }
  },

  'Alt+F4': () => {
    app.quit()
    process.exit()
  },
  'Ctrl+C': () => {
    if (windows[GAME_WINDOW]) {
      const gameUrl = windows[GAME_WINDOW].webContents.getURL()
      if (URL_REGEX.test(gameUrl)) {
        clipboard.writeText(gameUrl)
      }
    }
  },
  'Command+C': () => {
    if (windows[GAME_WINDOW]) {
      const gameUrl = windows[GAME_WINDOW].webContents.getURL()
      if (URL_REGEX.test(gameUrl)) {
        clipboard.writeText(gameUrl)
      }
    }
  },
  'Command+V': () => {
    if (windows[GAME_WINDOW]) {
      const gameUrl = clipboard.readText()
      if (URL_REGEX.test(gameUrl)) {
        windows[GAME_WINDOW].openURL(gameUrl)
      }
    }
  },
  'Ctrl+V': () => {
    if (windows[GAME_WINDOW]) {
      const gameUrl = clipboard.readText()
      if (URL_REGEX.test(gameUrl)) {
        windows[GAME_WINDOW].openURL(gameUrl)
      }
    }
  }
}

module.exports = {
  UPDATE_WINDOW,
  GAME_WINDOW,
  KEY_BINDS,
  windows,
  machineId,
  store
}
