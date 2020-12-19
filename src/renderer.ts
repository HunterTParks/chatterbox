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
    
    window.addEventListener('resize', () => {
        const sidebar = document.getElementById('sidebar-list');
        sidebar.style.height = `${window.innerHeight}px`;
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
}

const setHeightContext = () => {
    const sidebar = document.getElementById('sidebar-list');
    sidebar.style.height = `${window.innerHeight}px`;
}

const main = (): void => {
    const mainContent = document.getElementById('main');
    const loadingIcon = document.getElementById('loading');
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