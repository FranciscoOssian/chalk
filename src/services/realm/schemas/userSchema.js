const userSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    name: 'string',
    age: 'int',
    bio: 'string',
    profilePicture: 'string',
    authenticated: 'bool',
    gender: 'string?',
  },
};

export default userSchema;
