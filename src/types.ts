/**
 * TMIIdentity
 * @type type
 * 
 * Used to authenticated with Twitch
 * ! DO NOT USE DIRECTLY - Is a dependent of TMIOPTIONS
 * 
 * Technically, the fields are of type string but Typescript
 * doesn't play very well with defining types in the StoreSchema
 * which is one of the uses for this class
 */
type TMIIdentity = {
    username?: unknown,
    password?: unknown
}

/**
 * TMIOptions
 * @type type
 * 
 * Used to authenticate with Twitch
 * 
 * Technically, the channels field is an Array but Typescript
 * doesn't play very well with defining types in the StoreSchema
 * which is one of the uses for this class
 */
type TMIOptions = {
    identity: TMIIdentity,
    channels: unknown
}

/**
 * EventHandler
 * @type interface
 * 
 * 
 * Used to send events to the IPCMain process
 */
interface EventHandler {
    name: string,
    handler: () => void
}

/**
 * StoreSchema
 * @type object
 * 
 * JSON Schema to validate Electron store
 * Used for the following NPM package: https://github.com/sindresorhus/electron-store
 */
const StoreSchema: Record<string, unknown> = {
    username: {
        type: 'string',
        default: 'N/A',
    },
    password: {
        type: 'string',
        default: 'N/A'
    },
    channels: {
        type: 'array',
        maxItems: 20,
        minItems: 0
    },
    chats: {
        type: 'array',
        minItems: 0
    },
    theme: {
        type: 'string',
        default: 'default'
    },
    windowWidth: {
        type: Number,
        default: 800
    },
    windowHeight: {
        type: Number,
        default: 600
    },
    chatCount: {
        type: Number,
        default: 0
    },
    actionCount: {
        type: Number,
        default: 0
    },
    keyMapping: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                key: { type: 'string' },
                action: { type: 'string' },
                duration: { 
                    type: 'number',
                    default: 0
                }
            }
        }
    },
    actionsEnabled: {
        type: 'boolean',
        default: false
    },
    chatsEnabled: {
        'type': 'boolean',
        default: false
    },
    isLoaded: {
        type: 'boolean',
        default: false
    },
    notificationQueue: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                level: { type: 'string' },
                message: { type: 'string' }
            }
        }
    }
}

export {
    TMIOptions,
    StoreSchema,
    EventHandler
}