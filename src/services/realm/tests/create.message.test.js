import createMessage from '../create/message.ts';
import Realm from 'realm';
import schemas from '../schemas/index.js';

jest.mock('expo-crypto', () => ({
  digestStringAsync: () => `mocked-sha - ${new Date()} - ${Math.random()}`,
  CryptoDigestAlgorithm: { SHA256: undefined },
}));

describe('createMessage', () => {
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
      path: '/tmp/test-create-message.realm',
    });
  });

  afterAll(() => {
    realm.close();
  });

  it('should create a new message', async () => {
    realmWrite('User', {
      id: 'fvlknf',
      name: ', n jn',
      age: 20,
      bio: ',nm',
      profilePicture: 'strikjnkjng',
      authenticated: true,
      gender: 'strxxcccc',
    });
    realmWrite('User', {
      id: 'lnkjnkjn',
      name: ', n jn',
      age: 20,
      bio: ',nm',
      profilePicture: 'strikjnkjng',
      authenticated: true,
      gender: 'strxxcccc',
    });
    const messageData = {
      from: 'fvlknf',
      to: 'lnkjnkjn',
      timestamp: new Date(),
      content: {
        value: 'Hello, world!',
        contentType: 'text',
      },
    };

    const getCreatedMessage = await createMessage(realm, messageData);

    const v = getCreatedMessage();

    expect({
      timestamp: new Date(`${messageData.timestamp.toISOString()}`),
      ...messageData,
    }).toEqual({
      from: v.from,
      to: v.to,
      timestamp: new Date(`${v.timestamp.toISOString()}`),
      content: {
        value: v.content.value,
        contentType: v.content.contentType,
      },
    });
  });
});
