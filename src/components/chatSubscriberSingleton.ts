import tmi from 'tmi.js';

import { AppStore } from '../store';
import * as T from '../types';

class ChatSubscriber {
    client: tmi.Client;
    registeredEvents: Array<string>;

    constructor() {
        const ops: T.TMIOptions = {
            identity: {
                username: AppStore.store.get('username'),
                password: AppStore.store.get('password'),
            },
            channels: AppStore.store.get('channels')
        };
        this.client = tmi.Client( <unknown>ops );
        this.registeredEvents = [];
    }

    register( event: string, handler: ( ...args: unknown[] ) => void ) {
        console.log('event: ', event);
        console.log('Handler: ', handler);
        if( event && this.registeredEvents.includes( event ) )
            return;

        switch( event ) {
            case 'message':
                this.client.on('message', handler);
                this.registeredEvents.push(event);
                break;
            case 'connected':
                this.client.on('connected', handler);
                this.registeredEvents.push(event);
                break;
            default:
                console.error('Could not register event: ', event);
        }
    }

    connect() {
        this.client.connect();
    }

    disconnect() {
        this.client.disconnect();
    }
}

export default new ChatSubscriber();