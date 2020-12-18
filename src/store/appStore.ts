import Store from 'electron-store';

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
        this.store = new Store( T.StoreSchema );
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

export default new AppStore();