const { app, BrowserWindow } = require('electron')


app.on('ready', () => {
   let window = new BrowserWindow({
      frame: false,
      thickFrame: false,
      transparent: true,
      resizable: false,
      width: 250 * 1,
      height: 380 * 1,
      title: 'Sleep Timer',
      backgroundColor: '#292929'
   })
   window.show()
   window.loadFile('./ui/index.html')
})
