import { contextBridge, ipcRenderer } from 'electron';
import { AppStore } from './store';

contextBridge.exposeInMainWorld('chatterBoxAPI', {
    subscribeChat: () => ipcRenderer.invoke('chatSubscribe'),
    setCredentials: ( username: string, password: string ) => {
        AppStore.store.set('username', username);
        AppStore.store.set('password', password);
    },
    getCredentials: () => [ AppStore.store.get('username'), AppStore.store.get('password') ],
    channels: AppStore.store.get('channels')
});