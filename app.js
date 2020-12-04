const { app, BrowserWindow, nativeImage } = require('electron'),
      os = require('os')


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
})

if (os.platform() === 'darwin') {
   app.dock.setIcon(icon)
}
