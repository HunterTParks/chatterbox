/**
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 */

import './styles/index.less';
declare const window: any;

const registerEvents = () => {
    const sidebarContainer = document.getElementById('sidebar-container');
    const toggleSidebar = document.getElementById('sidebar-toggle');
    const navItems = document.querySelectorAll('.sidebar-item');
    const credentialsForm = document.getElementById('credentials-form');
    const channelsForm = document.getElementById('channels-form');
    const toggleOn = document.querySelectorAll('.toggle-group');
    const keyMappingForm  = document.getElementById('key-mapping-form');
    
    window.addEventListener('resize', () => {
        setHeightContext();
    });

    toggleSidebar.addEventListener('click', () => {
        const icon = document.getElementById('sidebar-arrow');
        sidebarContainer.classList.toggle('closed');
        icon.classList.toggle('arrow-right');
        icon.classList.toggle('arrow-left');
    });

    navItems.forEach( ( item: Element ) => {
        item.addEventListener( 'click', () => {
            const selectedNavItem = document.querySelector('.sidebar-item.selected');
            
            selectedNavItem.classList.remove('selected');
            item.classList.add('selected');

            const testString = document.querySelector('.sidebar-item.selected').id.replace('nav-', '');
            const toBeActiveContent = document.getElementById(testString);
            const activeContent = document.querySelector('#main .content .active');

            activeContent.classList.remove('active');
            toBeActiveContent.classList.add('active');

            activeContent.classList.add('hidden');
            toBeActiveContent.classList.remove('hidden');
        });
    });

    credentialsForm.addEventListener('submit', ( e ) => {
        e.preventDefault();

        const username: HTMLInputElement = <HTMLInputElement>document.getElementById('username');
        const password: HTMLInputElement = <HTMLInputElement>document.getElementById('password');

        if( 
            username.value && username.value !== undefined &&
            password.value && password.value !== undefined
        ) {
            window.chatterBoxAPI.setCredentials(username.value, password.value);
        }
    });

    channelsForm.addEventListener('submit', ( e ) => {
        e.preventDefault();

        const channel: HTMLInputElement = <HTMLInputElement>document.getElementById('channel-input');
        if( channel.value && channel.value !== undefined ) {
            window.chatterBoxAPI.addChannel( channel.value );
            channel.value = '';
        }

        fillChannelList();
        registerChannelLiEvents();
    });

    toggleOn.forEach( ( item: HTMLElement ) => {
        item.addEventListener('click', () => {
            const toggle = item.querySelector('.button-on-container');
            toggle.classList.toggle('on');

            if( item.id === 'toggle-chats' ) enableChat();
            if( item.id === 'toggle-actions' ) toggleActions();
        });
    });

    keyMappingForm.addEventListener('submit', ( e ) => {
        e.preventDefault();

        const aliasInput: HTMLInputElement = <HTMLInputElement>document.getElementById('key-alias-input');
        const commandInput: HTMLInputElement = <HTMLInputElement>document.getElementById('key-command-input');

        if( 
            aliasInput && aliasInput !== undefined &&
            commandInput && commandInput !== undefined    
        ) {
            window.chatterBoxAPI.addKeyMapping({ "key": aliasInput.value, "action": commandInput.value });
            aliasInput.value = '';
            commandInput.value = '';
        }

        fillKeyMappingList();
        registerKeyMappingLiEvents();
    })

    registerChannelLiEvents();
    registerKeyMappingLiEvents();
}

const registerChannelLiEvents = () => {
    const channelsLiItems = document.querySelectorAll('#channels-list li.channel .delete-button button');

    channelsLiItems.forEach(( item: HTMLButtonElement ) => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('channel');
            const element: HTMLElement = document.getElementById(id);
            const key: string  = element.querySelector('.channel-name').innerHTML;

            window.chatterBoxAPI.deleteChannel( key );
            fillChannelList();
            registerChannelLiEvents();
        });
    });
}

const registerKeyMappingLiEvents = () => {
    const keyMappingLiItems = document.querySelectorAll('#key-mapping-list li.key .delete-button button');

    keyMappingLiItems.forEach(( item: HTMLButtonElement ) => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('key');
            const element: HTMLElement = document.getElementById(id);
            const key: string = element.querySelector('.key-name').innerHTML;

            window.chatterBoxAPI.deleteKeyMapping( key );
            fillKeyMappingList();
            registerKeyMappingLiEvents();
        })
    })
}

const fillOutFields = () => {
    const username: HTMLInputElement = <HTMLInputElement>document.getElementById('username');
    const password: HTMLInputElement = <HTMLInputElement>document.getElementById('password');
    const [ setUsername, setPassword ] = window.chatterBoxAPI.getCredentials();
    
    if ( setUsername )
        username.value = setUsername;
    if ( setPassword )
        password.value = setPassword;

    fillChannelList();
    fillKeyMappingList();
    fillChatLogs();
    fillChatCount();
}

const fillChannelList = () => {
    const generateListItem = ( index: number ) => {
        const li: HTMLLIElement = document.createElement('li');
        li.setAttribute('class', 'channel');
        li.setAttribute('id', `channel-${index}`);
        return li;
    }
    const generateTitleElement = ( item: string ) => {
        const div: HTMLDivElement = document.createElement('div');
        div.setAttribute('class', 'channel-name');
        div.appendChild(document.createTextNode(item));
        return div;
    }
    const generateButtons = ( index: number ) => {
        const div: HTMLDivElement = document.createElement('div');
        div.setAttribute('class', 'buttons');
        const innerDiv: HTMLDivElement = document.createElement('div');
        innerDiv.setAttribute('class', 'delete-button');
        const button: HTMLButtonElement = document.createElement('button');
        button.setAttribute('channel', `channel-${index}`);
        button.appendChild(document.createTextNode('Delete'));

        innerDiv.appendChild(button);
        div.appendChild(innerDiv);

        return div;
    }

    const channelList: HTMLUListElement = <HTMLUListElement>document.getElementById('channels-list');
    const channels: Array<string> = window.chatterBoxAPI.getChannels();

    channelList.innerHTML = '';

    if( channels && channels.length > 0) {
        channels.forEach(( item: string, index: number ) => {
            const li = generateListItem( index );
            li.appendChild(generateTitleElement( item ));
            li.appendChild(generateButtons( index ));
            
            channelList.appendChild(li); 
        });
    } else {
        console.log('Channels not found');
    }
}

const fillKeyMappingList = () => {
    const generateListItem = ( index: number ) => {
        const li: HTMLLIElement = document.createElement('li');
        li.setAttribute('class', 'key');
        li.setAttribute('id', `key-${index}`);
        return li;
    }
    const generateTitleElement = ( item: string ) => {
        const div: HTMLDivElement = document.createElement('div');
        div.setAttribute('class', 'key-name');
        div.appendChild(document.createTextNode(item));
        return div;
    }
    const generateButtons = ( index: number ) => {
        const div: HTMLDivElement = document.createElement('div');
        div.setAttribute('class', 'buttons');
        const innerDiv: HTMLDivElement = document.createElement('div');
        innerDiv.setAttribute('class', 'delete-button');
        const button: HTMLButtonElement = document.createElement('button');
        button.setAttribute('key', `key-${index}`);
        button.appendChild(document.createTextNode('Delete'));

        innerDiv.appendChild(button);
        div.appendChild(innerDiv);

        return div;
    }

    const keyMappingList: HTMLUListElement = <HTMLUListElement>document.getElementById('key-mapping-list');
    const keyMappings: Array<Record<string, string>> = window.chatterBoxAPI.getKeyMappings();

    keyMappingList.innerHTML = '';

    if( keyMappings && keyMappings.length > 0) {
        keyMappings.forEach(( item: Record<string, string>, index: number ) => {
            const li = generateListItem( index );
            li.appendChild(generateTitleElement( item.key ));
            li.appendChild(generateTitleElement( item.action ))
            li.appendChild(generateButtons( index ));
            
            keyMappingList.appendChild(li); 
        });
    } else {
        console.log('Key Mappings not found');
    }
}

const fillChatLogs = () => {
    const chats: Array<string> = window.chatterBoxAPI.getChatLogs();

    if ( chats && chats.length > 0 ) {
        chats.forEach( ( chat: string ) => {
            addSingleChatToLogs( chat + '\n' );
        });
    }
}

const fillChatCount = () => {
    const chatCount: number = window.chatterBoxAPI.getChatCount();

    if ( chatCount && chatCount != undefined ) {
        setChatCountUI( chatCount );
    }
}

const setHeightContext = () => {
    const sidebar = document.getElementById('sidebar-list');
    sidebar.style.height = `${window.innerHeight - 38}px`;
}

const enableChat = () => {
    window.chatterBoxAPI.resetCount();

    const client = window.chatterBoxAPI.getChatSubscriberClient( onMessageHandler, onConnectionHandler );
}

const toggleActions = () => {
    window.chatterBoxAPI.toggleActions();
}

const onConnectionHandler = ( addr: unknown, port: unknown ) => {
    console.log(`* Connected to ${addr}:${port}`);
}

const onMessageHandler = ( target: unknown, context: Record<string, unknown>, msg: string, self: unknown ) => {
    if ( self ) return;

    const commandName = msg.trim();
    const date = new Date();
    const generatedMsg = `${context['display-name']} | ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} | ${commandName}`
    window.chatterBoxAPI.addChat( generatedMsg );
    addSingleChatToLogs( generatedMsg );
    fillChatCount();

    if ( window.chatterBoxAPI.isActionsEnabled ) {
        const keymappings = window.chatterBoxAPI.getKeyMapping();

        keymappings.forEach( ( key: string ) => {
            if( key === generatedMsg ) {
                window.chatterBoxAPi.sendCommand( key );
            }
        });
    }
};

const addSingleChatToLogs = ( msg: string ) => {
    const textarea = document.getElementById('chat-logs');
    textarea.appendChild(document.createTextNode(msg + '\n'));
    textarea.scrollTop = textarea.scrollHeight;
}

const setChatCountUI = ( amount: number ) => {
    const countNode = document.getElementById('total-chats');
    countNode.innerText = `${amount}`;
}

const main = (): void => {
    const mainContent = document.getElementById('main');
    const loadingIcon = document.getElementById('loading');
    fillOutFields();
    registerEvents();
    
    setTimeout(() => {
        loadingIcon.classList.add('hidden');
        mainContent.classList.remove('hidden');
        setHeightContext();
    }, 2000);
}

main();