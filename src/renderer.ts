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
            console.log('values set');
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
        });
    });

    registerChannelLiEvents();
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

const fillOutFields = () => {
    const username: HTMLInputElement = <HTMLInputElement>document.getElementById('username');
    const password: HTMLInputElement = <HTMLInputElement>document.getElementById('password');
    const [ setUsername, setPassword ] = window.chatterBoxAPI.getCredentials();
    
    if ( setUsername )
        username.value = setUsername;
    if ( setPassword )
        password.value = setPassword;

    fillChannelList();
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

const setHeightContext = () => {
    const sidebar = document.getElementById('sidebar-list');
    sidebar.style.height = `${window.innerHeight - 38}px`;
}

const main = (): void => {
    const mainContent = document.getElementById('main');
    const loadingIcon = document.getElementById('loading');
    fillOutFields();
    registerEvents();
    
    console.log('👋 This message is being logged by "renderer.js", included via webpack');
    window.chatterBoxAPI.subscribeChat();
    
    setTimeout(() => {
        loadingIcon.classList.add('hidden');
        mainContent.classList.remove('hidden');
        setHeightContext();
    }, 2000);
}

main();