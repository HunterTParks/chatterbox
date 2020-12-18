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
        maxItems: 5,
        minItems: 0
    },
    theme: {
        type: 'string',
        default: 'default'
    }
}

export {
    TMIOptions,
    StoreSchema
}