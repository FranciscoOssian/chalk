const messageSchema = {
    name: 'Message',
    primaryKey: 'id',
    properties: {
        id: { type: 'string', indexed: true },
        from: 'string',
        timestamp: 'string',
        content: {
            type: 'string',
            value: 'string'
        }
    }
}

export default messageSchema