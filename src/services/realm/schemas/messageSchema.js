const messageSchema = {
  name: 'Message',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    from: 'string',
    to: 'string',
    timestamp: 'date',
    content: 'ContentMessage',
  },
};

export default messageSchema;
