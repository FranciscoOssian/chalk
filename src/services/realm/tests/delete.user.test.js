import deleteChat from '../delete/user.ts';
import Realm from 'realm';
import schemas from '../schemas/index.js';

describe('delete chat', () => {
  let realm;
  const realmWrite = (name, obj) =>
    new Promise((resolve, _) =>
      realm.write(() => {
        return resolve(realm.create(name, obj));
      })
    );

  beforeAll(() => {
    realm = new Realm({
      inMemory: true,
      schema: schemas,
      path: '/tmp/test-del-user.realm',
    });
  });

  afterAll(() => {
    realm.close();
  });

  it('should create user and delete', async () => {
    const userId = 'user1';
    userObj = {
      id: userId,
      name: 'string-mocked',
      age: 23784,
      bio: 'string-mocked',
      profilePicture: 'string-mocked',
      authenticated: true,
      gender: 'male',
    };
    realmWrite('User', userObj);
    const realmUser = realm.objectForPrimaryKey('User', userId);
    expect(JSON.parse(JSON.stringify(realmUser))).toEqual(userObj);

    deleteChat(userId, realm);

    const realmUser_deleted = realm.objectForPrimaryKey('Chat', userId);
    expect(JSON.parse(JSON.stringify(realmUser_deleted))).toEqual(null);
  });

  it('should delete but no user found', async () => {
    const userId = 'user44444441';

    deleteChat(userId, realm);
  });
});
