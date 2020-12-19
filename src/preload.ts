import { contextBridge, ipcRenderer } from 'electron';
import { AppStore } from './store';

contextBridge.exposeInMainWorld('chatterBoxAPI', {
    subscribeChat: () => ipcRenderer.invoke('chatSubscribe'),
    setCredentials: ( username: string, password: string ) => {
        AppStore.store.set('username', username);
        AppStore.store.set('password', password);
    },
    getCredentials: () => [ AppStore.store.get('username'), AppStore.store.get('password') ],
    getChannels: () => AppStore.store.get('channels'),
    addChannel: ( channel: string ) => {
        const channels: Array<string> = <Array<string>>AppStore.store.get('channels');
        if ( channels && channels.length > 0 ) {
            channels.push( channel );
            AppStore.store.set('channels', channels );
        } else {
            AppStore.store.set('channels', [ channel ]);
        }
    }
});