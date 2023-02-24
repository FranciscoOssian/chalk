const contentMessageSchema = {
  name: 'ContentMessage',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    contentType: 'string',
    value: 'string',
  },
};

export default contentMessageSchema;
