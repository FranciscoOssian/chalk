const matchingConfigSchema = {
  name: 'MatchingConfig',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    from: 'int',
    to: 'int',
    lang: 'string',
    genders: 'string[]',
  },
};

export default matchingConfigSchema;
