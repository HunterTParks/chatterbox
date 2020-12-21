import tmi from 'tmi.js';

import { AppStore } from '../store';
import * as T from '../types';

class ChatSubscriberFactory {
    onMessageHander: () => void;
    onConnectionHandler: () => void;

    createClient( onMessageHandler: () => void, onConnectionHandler: () => void ) {
        if( !AppStore.validate() )
            console.error('Cannot connect -- one or more of the authentication fields is empty');

        const ops: T.TMIOptions = {
            identity: {
                username: AppStore.store.get('username'),
                password: AppStore.store.get('password'),
            },
            channels: AppStore.store.get('channels')
        };

        // Create a client with our options
        // TODO: Fix 'unknown' type cast
        const client: tmi.Client = tmi.client(<unknown>ops);
        
        client.on('message', onMessageHandler);
        client.on('connected', onConnectionHandler);
        client.connect();

        return client;
    }
}

export default new ChatSubscriberFactory();