import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import robot from 'robotjs';
import { AppStore } from './store';
import { ChatSubscriber } from './components';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const initialize = (): void => {
  AppStore.getClient().then(() => {
    AppStore.store.set({
      'windowWidth': 800,
      'windowHeight': 725,
      'actionsEnabled': false,
      'chatsEnabled': false,
    })
    AppStore.store.set('windowWidth', 800);
    AppStore.store.set('windowHeight', 725);

    ChatSubscriber.getSubscriber().then(() => {
      ChatSubscriber.register('message', onMessageHandler);
      ChatSubscriber.register('connected', onConnectionHandler);
      AppStore.store.set('isLoaded', true);
    });
  });
};

const shutdown = (): void => {
  AppStore.store.set({
    'chats': [],
    'chatCount': 0,
    'actionCount': 0,
    'isLoaded': false
  });
}

const createMainWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 200,
    width: 200,
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

const onMessageHandler = ( target: unknown, context: Record<string, unknown>, msg: string, self: unknown ) => {
  console.log('Message handler!');
  if ( self ) return;

  const commandName = msg.trim();
  const date = new Date();
  console.log('Context: ', context);
  const generatedMsg = `${context['display-name']} | ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} | ${commandName}`
  addChat( generatedMsg );

  if ( AppStore.store.get('actionsEnabled') ) {
      const keymappings: Array<Record<string, string>> = <Array<Record<string, string>>>AppStore.store.get('keyMappings');
      console.log('keymappings: ', keymappings);

      if( keymappings && keymappings.length > 0 ) {
        keymappings.forEach( ( key: Record<string, string> ) => {
          if( key.key === commandName ) {
              sendCommand( key.action );
          }
        });
      }
  }
};

const onConnectionHandler = ( addr: unknown, port: unknown ) => {
  console.log(`* Connected to ${addr}:${port}`);
}

const addChat = ( msg: string ) => {
  const chats: Array<string> = <Array<string>>AppStore.store.get('chats');
  if( chats && chats.length > 0 ) {
      chats.push( msg );
      AppStore.store.set('chats', chats);
  } else {
      AppStore.store.set('chats', [ msg ]);
  }

  let chatCount: number = <number>AppStore.store.get('chatCount');
  if( chatCount && chatCount !== undefined ) {
      chatCount++;
      AppStore.store.set('chatCount', chatCount);
  } else {
      AppStore.store.set('chatCount', chats.length);
  }
}

const sendCommand = ( keymap: string ) => {
  if ( keymap && keymap !== undefined ) {
    robot.keyTap( keymap );
  }
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

ipcMain.handle('openExternal', ( event, ...args ) => shell.openExternal( args[0] ));

ipcMain.handle('connect', () => ChatSubscriber.connect());
ipcMain.handle('disconnect', () => ChatSubscriber.disconnect());

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
