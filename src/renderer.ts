/**
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 */

import './styles/index.less';
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chatterBoxAPI: Record<string, any>
    }
}

console.log('👋 This message is being logged by "renderer.js", included via webpack');
window.chatterBoxAPI.subscribeChat();