import Store from 'electron-store';
import keytar from 'keytar';

import * as T from '../types';

/**
 * * AppStore
 * @type class
 * Interfaces with the Electron Store
 * 
 * TODO: Setup migration function to change store in the future
 */
class AppStore {
    store: Store;

    constructor() {
        retrievePassword().then(( password: string ) => { 
            this.store = new Store({ ...T.StoreSchema, encryptionKey: password });
            console.log('Store: ', this.store);
        });
    }

    getClient() {
        return new Promise(( resolve ) => {
            const interval = setInterval(() => {
                if( this.store && this.store !== undefined ) {
                    clearInterval(interval);
                    resolve( this.store );
                }
            }, 500)
        });
    }

    validate() {
        let validated = false;
        
        if( 
            !!this.store.get('username') && this.store.get('username') !== 'N/A' &&
            !!this.store.get('password') && this.store.get('password') !== 'N/A'
        )
            validated = true;

        return validated;
    }
}

const retrievePassword = () => {
    const service = 'chatterbox';
    const account = 'main';

    return keytar.getPassword(service, account)
        .then(( password ) => {
            if( !password || password === null ) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                for( let i = 0; i < characters.length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * characters.length ) );
                }

                keytar.setPassword(service, account, result);
                return result;
            }

            return password;
        });
};

export default new AppStore();