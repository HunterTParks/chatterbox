/**
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 */

import './styles/index.less';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

const registerEvents = () => {
    const sidebarContainer = document.getElementById('sidebar-container');
    const toggleSidebar = document.getElementById('sidebar-toggle');
    const navItems = document.querySelectorAll('.sidebar-item');
    const credentialsForm = document.getElementById('credentials-form');
    const channelsForm = document.getElementById('channels-form');
    const toggleOn = document.querySelectorAll('.toggle-group');
    const keyMappingForm  = document.getElementById('key-mapping-form');
    const externalLinks = document.querySelectorAll('to-browser');
    const internalLinks = document.querySelectorAll('to-section');
    const keymappingInstructions = document.getElementById('instructional-overlay');
    const keymappingIcon = document.getElementById('hover-icon-container');
    const modal = document.getElementById('modal');

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
            window.chatterBoxAPI.sendLog('info', 'Credentials were saved.');
            password.value = '';
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

            if( item.id === 'toggle-chats' ) toggleChat();
            if( item.id === 'toggle-actions' ) toggleActions();
        });
    });

    keyMappingForm.addEventListener('submit', ( e ) => {
        e.preventDefault();

        const aliasInput: HTMLInputElement = <HTMLInputElement>document.getElementById('key-alias-input');
        const commandInput: HTMLInputElement = <HTMLInputElement>document.getElementById('key-command-input');
        const durationInput: HTMLInputElement = <HTMLInputElement>document.getElementById('duration-input');

        if( 
            aliasInput && aliasInput !== undefined &&
            commandInput && commandInput !== undefined
        ) {
            window.chatterBoxAPI.addKeyMapping({ "key": aliasInput.value, "action": commandInput.value, "duration": <number>(<unknown>durationInput.value) });
            aliasInput.value = '';
            commandInput.value = '';
            durationInput.value = '0';
        }

        fillKeyMappingList();
        registerKeyMappingLiEvents();
    });

    externalLinks.forEach(( item: HTMLElement ) => {
        item.addEventListener('click', () => {
            window.chatterBoxAPI.openExternal( item.attributes.getNamedItem('link').value );
        });
    });

    internalLinks.forEach(( item: HTMLElement ) => {
        item.addEventListener('click', () => {
            const link = item.attributes.getNamedItem('goto').value;
            const nav = document.getElementById(link);

            nav.click();
        });
    });

    keymappingIcon.addEventListener('mouseover', () => {
        keymappingIcon.classList.toggle('hidden');
        keymappingInstructions.classList.toggle('mouseover');
    });

    keymappingInstructions.addEventListener('mouseout', () => {
        console.log('Mouse out');
        keymappingIcon.classList.toggle('hidden');
        keymappingInstructions.classList.toggle('mouseover');
    });

    modal.addEventListener('fire', () => {
        modal.classList.toggle('open');
    });

    modal.addEventListener('click', ( e ) => {
        const clickedElementId = (<HTMLElement>e.target).getAttribute('id');
        if( 
            clickedElementId === 'background' ||
            clickedElementId === 'exit-modal'
        ) {
            modal.classList.toggle('open');
        }
    });

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
    const [ setUsername ] = window.chatterBoxAPI.getCredentials();
    
    if ( setUsername )
        username.value = setUsername;

    fillChannelList();
    fillKeyMappingList();
    fillChatLogs();
    fillChatCount();
}

const fillChannelList = () => {
    const generateListItem = ( index: number ) => {
        const li: HTMLLIElement = document.createElement('li');
        li.setAttribute('class', 'channel varied-list-item');
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
        li.setAttribute('class', 'key varied-list-item');
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
            li.appendChild(generateTitleElement( item.action ));
            li.appendChild(generateTitleElement( item.duration ));
            li.appendChild(generateButtons( index ));
            
            keyMappingList.appendChild(li); 
        });
    } else {
        console.log('Key Mappings not found');
    }
}

const fillChatLogs = () => {
    const chats: Array<string> = window.chatterBoxAPI.getChatLogs();
    document.getElementById('chat-logs').innerText = '';

    if ( chats && chats.length > 0 ) {
        chats.forEach( ( chat: string ) => {
            addSingleChatToLogs( chat + '\n' );
        });

        fillChatCount();
    }
}

const fillChatCount = () => {
    const chatCount: number = window.chatterBoxAPI.getChatCount();

    if ( chatCount && chatCount != undefined ) {
        setChatCountUI( chatCount );
    }
}

const fillActionCount = () => {
    const actionCount: number = window.chatterBoxAPI.getActionCount();

    if ( actionCount && actionCount !== undefined ) {
        setActionCountUI( actionCount );
    }
}

const setHeightContext = () => {
    const sidebar = document.getElementById('sidebar-list');
    sidebar.style.height = `${window.innerHeight - 38}px`;
}

const toggleChat = () => {
    window.chatterBoxAPI.toggleChats();

    if ( window.chatterBoxAPI.isChatsEnabled() ) {
        window.chatterBoxAPI.connect();
        window.chatterBoxAPI.resetCount();
    } else {
        window.chatterBoxAPI.disconnect();
    }
}

const toggleActions = () => {
    if( 
        !window.chatterBoxAPI.isChatsEnabled() &&
        !window.chatterBoxAPI.isActionsEnabled()
    ) {
        document.getElementById('toggle-chats').click();
    }

    window.chatterBoxAPI.toggleActions();
}

const addSingleChatToLogs = ( msg: string ) => {
    const textarea = document.getElementById('chat-logs');
    textarea.appendChild(document.createTextNode(msg + '\n'));
    textarea.scrollTop = textarea.scrollHeight;
}

const setChatCountUI = ( amount: number ) => {
    const countNode = document.getElementById('total-chats');
    countNode.innerText = `${amount}`;
}

const setActionCountUI = ( amount: number ) => {
    const actionNode = document.getElementById('total-actions');
    actionNode.innerText = `${amount}`;
}

const setNotificationsUI = ( level: string, message: string ) => {
    const notificationsNode = document.getElementById('notifications');
    notificationsNode.classList.add( `${level}` );
    notificationsNode.classList.add( 'active' );
    notificationsNode.innerText = `${message}`;
}

const clearNotification = () => {
    const notificationsNode = document.getElementById('notifications');
    notificationsNode.classList.remove('active');

    const regexClassList = new RegExp(/\b(warn|log)\b/, 'g');
    if( notificationsNode.className.match( regexClassList ) ) {
        notificationsNode.className = notificationsNode.className.replace(regexClassList, '');
    }
}

const disableActions = () => window.chatterBoxAPI.toggleActions(false);

const pollChatLogs = () => {
    setInterval(() => fillChatLogs(), 5000);
}

const pollActionsCount = () => {
    setInterval(() => fillActionCount(), 5000);
}

const pollNotifications = () => {
    setInterval(() => {
        const notificationQueue: Array<Record<string, string>> = <Array<Record<string, string>>>window.chatterBoxAPI.getNotificationQueue();

        if( notificationQueue && notificationQueue.length > 0 ) {
            const notification = window.chatterBoxAPI.getFirstNotification();
            console.log('Notification: ', notification);
            setNotificationsUI( notification.level, notification.message );

            setTimeout(() => {
                clearNotification();
            }, 5000);
        }
    }, 200);
}

const main = (): void => {
    const mainContent = document.getElementById('main');
    const loadingIcon = document.getElementById('loading');
    disableActions();
    fillOutFields();
    registerEvents();
    pollChatLogs();
    pollActionsCount();
    pollNotifications();
    
    const loadingScreen = setInterval(() => {
        if( window.chatterBoxAPI.isLoaded() ) {
            loadingIcon.classList.add('hidden');
            mainContent.classList.remove('hidden');
            setHeightContext();
            clearInterval(loadingScreen);
        }
    }, 500);
}

main();