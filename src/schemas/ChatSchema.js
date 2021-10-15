const ChatSchema = {
    name: 'Chat',
    primaryKey: 'id',
    properties: {
        id: { type: 'string', indexed: true },
        owners: 'User[]',
        messages: 'Message[]'
    }
}

export default ChatSchema