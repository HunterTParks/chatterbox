import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import robot from 'robotjs';
import { ChatSubscriberFactory } from './components';
import { AppStore } from './store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const initialize = (): void => {
  AppStore.store.set('windowWidth', 800);
  AppStore.store.set('windowHeight', 725);
}

const shutdown = (): void => {
  AppStore.store.set({
    'chats': [],
    'actionsEnabled': false,
    'chatCount': 0,
    'actionCount': 0
  });
}

const createMainWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: <number>AppStore.store.get('windowHeight'),
    width: <number>AppStore.store.get('windowWidth'),
    minHeight: 725,
    title: 'ChatterBox',
    webPreferences: {
      enableRemoteModule: true,
      contextIsolation: true,
      preload: path.join(__dirname, '../renderer/preload/index.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  initialize();
  createMainWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    shutdown();
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.handle('receiveCommand', ( event, ...args ) => {
  if ( args && args.length > 0 ) {
    robot.keyTap(args[0]);
  }
});

ipcMain.handle('openExternal', ( event, ...args ) => shell.openExternal( args[0] ));

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
