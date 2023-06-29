const chatSchema = {
  name: 'Chat',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    owners: 'User[]',
    messages: 'Message[]',
    lastMessage: 'Message?',
  },
};

export default chatSchema;
