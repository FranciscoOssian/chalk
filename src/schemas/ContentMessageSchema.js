const contentMessageSchema = {
    name: 'ContentMessage',
    primaryKey: 'id',
    properties: {
        id: { type: 'string', indexed: true },
        type: 'string',
        value: 'string'
    }
}

export default contentMessageSchema