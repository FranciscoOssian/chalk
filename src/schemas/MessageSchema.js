const messageSchema = {
    name: 'Message',
    primaryKey: 'id',
    properties: {
        id: { type: 'string', indexed: true },
        from: 'User',
        to: 'User',
        timestamp: 'date',
        content:'ContentMessage',
    }
}

export default messageSchema