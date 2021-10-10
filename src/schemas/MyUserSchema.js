const myUser = {
    name: 'myUser',
    primaryKey: 'id',
    properties: {
        id: { type: 'string', indexed: true },
        name: 'string',
        email: 'string',
        age: 'int',
        bio: 'string',
        profilePicture: 'string'
    }
}

export default myUser