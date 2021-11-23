const { app, BrowserWindow, nativeImage, ipcMain: ipc } = require('electron')
const { exec } = require('child_process')
const os = require('os')

const platform = os.platform()
const icon = nativeImage.createFromPath('./build/icon.png')

app.on('ready', () => {
   let window = new BrowserWindow({
      frame: false,
      thickFrame: false,
      transparent: true,
      resizable: false,
      width: 250 * 1,
      height: 380 * 1,
      title: 'Sleep Timer',
      icon: icon,
      backgroundColor: '#292929',
      webPreferences: {
         nodeIntegration: true
      },
      fullscreenable: false,
      maximizable: false,
      titleBarStyle: 'hidden'
   })
   window.show()
   window.loadFile('./ui/index.html')

   ipc.on('minimize', () => window.minimize())
   ipc.on('quit', () => app.quit())

   ipc.on('sleep', () => {
      switch (platform) {
         case 'win32':
            exec('shutdown /h')
            break
         case 'darwin':
            exec('pmset sleepnow')
            break
         default:
            exec('shutdown now')
            break
      }
   })

   ipc.on('shutdown', () => {
      switch (platform) {
         case 'win32':
            exec('shutdown /s')
            break
         case 'darwin':
            exec(`osascript -e 'tell app "System Events" to shut down'`)
            break
         default:
            exec('shutdown now')
            break
      }
   })
})

if (os.platform() === 'darwin') {
   app.dock.setIcon(icon)
}
