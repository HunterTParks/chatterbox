import { contextBridge, ipcRenderer } from 'electron';
import { AppStore } from './store';
import { ChatSubscriberFactory } from './components';

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
            if( !channels.includes( channel ) ) {
                channels.push( channel );
                AppStore.store.set('channels', channels );
            }
        } else {
            AppStore.store.set('channels', [ channel ]);
        }
    },
    deleteChannel: ( channel: string ) => {
        let list: Array<string> = <Array<string>>AppStore.store.get('channels');

        console.log('Channel: ', channel);
        list = list.filter(( item ) => item !== channel);
        AppStore.store.set('channels', list);
    },
    getChatSubscriberClient: ( onMessageHandler: () => void, onConnectionHandler: () => void ) => { 
        const client = ChatSubscriberFactory.createClient( onMessageHandler, onConnectionHandler );
        console.log('Client from preload: ', client);
        client.on('message', () => console.log('testing'));
        return client;
    },
    resetCount: () => AppStore.store.set({
        'chatCount': 0,
        'actionCount': 0
    }),
    getChatCount: () => AppStore.store.get('chatCount'),
    addChat: ( msg: string ) => {
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
    },
    getChatLogs: () => AppStore.store.get('chats')
});