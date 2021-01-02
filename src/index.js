const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  screen
} = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {

  // Get screen size
  const {
    width,
    height
  } = screen.getPrimaryDisplay().workAreaSize

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 128,
    height: 128,
    center: true,
    transparent: true,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    frame: false
  });

  // Create tray icon.
  const trayIconPath = path.join(__dirname, 'assets/icons', 'eye-icon-16x16.png');
  const tray = new Tray(trayIconPath);
  tray.setToolTip("This is the Assisty tray.");

  const trayMenuTemplate = [{
    label: 'Exit',
    click: function () {
      tray.destroy();
      clearInterval(catchInterval);
      app.quit();
    }
  }, ]

  let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
  tray.setContextMenu(trayMenu)

  let mousePos = null;
  let newX = null;
  let newY = null;
  let windowPosX = null;
  let windowPosY = null;

  let catchInterval = setInterval(() => {
    mousePos = screen.getCursorScreenPoint();
    windowPosX = mainWindow.getPosition()[0];
    windowPosY = mainWindow.getPosition()[1];

    if (checkInArea(mousePos.x, mousePos.y, windowPosX, windowPosY)) {
      newX = Math.floor(Math.random() * (width - 128));
      newY = Math.floor(Math.random() * (height - 128));
      mainWindow.setPosition(newX, newY, true);
    }
  }, 100);



  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools({
  //   mode: 'detach',
  // });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const checkInArea = (positionX, positionY, windowPosX, windowPosY) => {
  if (positionX >= windowPosX && positionX <= windowPosX + 128 && positionY >= windowPosY && positionY <= windowPosY + 128) {
    return true;
  } else {
    return false;
  }
}