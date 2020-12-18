import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('chatterBoxAPI', {
    subscribeChat: () => ipcRenderer.invoke('chatSubscribe')
});