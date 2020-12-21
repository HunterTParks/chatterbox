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

        list = list.filter(( item ) => item !== channel);
        AppStore.store.set('channels', list);
    },
    getChatSubscriberClient: ( onMessageHandler: () => void, onConnectionHandler: () => void ) => { 
        const client = ChatSubscriberFactory.createClient( onMessageHandler, onConnectionHandler );
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
    getChatLogs: () => AppStore.store.get('chats'),
    isActionsEnabled: () => AppStore.store.get('actionsEnabled'),
    toggleActions: () => {
        const isEnabled: boolean = <boolean>AppStore.store.get('actionsEnabled');
        AppStore.store.set('actionsEnabled', !isEnabled);
    },
    addKeyMapping: ( newKeyMapping: Record<string, string> ) => {
        const keyMappings: Array<Record<string, unknown>> = <Array<Record<string, unknown>>>AppStore.store.get('keyMappings');
        
        if( keyMappings && keyMappings.length > 0 ) {
            let foundMatch = false;
            keyMappings.forEach( ( key: Record<string, unknown> ) => {
                if( key.key == newKeyMapping.key )
                    foundMatch = true;
            });

            if( !foundMatch ) {
                keyMappings.push( newKeyMapping );
                AppStore.store.set('keyMappings', keyMappings);
            }
        } else {
            AppStore.store.set('keyMappings', [ newKeyMapping ]);
        }
    },
    getKeyMappings: () => AppStore.store.get('keyMappings'),
    deleteKeyMapping: ( key: string ) => {
        let list: Array<Record<string, unknown>> = <Array<Record<string, unknown>>>AppStore.store.get('keyMappings');

        list = list.filter(( item: Record<string, unknown> ) => item.key !== key);
        AppStore.store.set('keyMappings', list);
    },
    sendCommand: ( key: string ) => ipcRenderer.invoke('receiveCommand', key)
});