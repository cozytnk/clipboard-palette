
const fs = require('fs')
const { app, Tray, Menu, MenuItem, clipboard, shell, Notification } = require('electron')

const assetsDirectory = app.isPackaged ? process.resourcesPath + `/assets` : './assets'
// TODO: auto-switch light/dark icon
const iconPath = assetsDirectory + `/Palette icon 6 -16x16-fff.png`
const settingsPath = assetsDirectory + `/settings.json`

let tray = null

const notify = body => {
  new Notification({
    title: app.name,
    body,
    silent: true,
    // icon: iconPath,
  }).show()
}

const updateMenu = () => {

  const menu = new Menu()

  let texts
  try {
    texts = JSON.parse(fs.readFileSync(settingsPath, 'utf8'))
  } catch (err) {
    notify(err.toString())
    texts = []
  }
  for (const text of texts) {
    menu.append(new MenuItem({
      label: text,
      click: () => clipboard.writeText(text),
    }))
  }

  menu.append(new MenuItem({ type: 'separator' }))
  menu.append(new MenuItem({
    label: 'settings',
    click: () => shell.openPath(settingsPath)
  }))
  menu.append(new MenuItem({
    label: 'show in finder',
    click: () => shell.showItemInFolder(assetsDirectory)
  }))
  menu.append(new MenuItem({ label: 'update', click: () => updateMenu() }))
  menu.append(new MenuItem({ role: 'quit' }))

  tray?.setContextMenu(menu)
}

app.dock.hide()

app.on('ready', () => {
  tray = new Tray(iconPath)
  tray.on('mouse-move', () => tray.popUpContextMenu())
  updateMenu()
})

app.on('quit', () => {
  console.log('app.quit')
})

