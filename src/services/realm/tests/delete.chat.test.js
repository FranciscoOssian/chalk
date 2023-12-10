import deleteChat from '../delete/chat.ts';
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
      path: '/tmp/test-del-chat.realm',
    });
  });

  afterAll(() => {
    realm.close();
  });

  it('should create chat and delete', async () => {
    const chatId = 'chat1';
    chatObj = {
      id: chatId,
      owners: [],
      messages: [],
      lastMessage: null,
    };
    realmWrite('Chat', chatObj);
    const realmChat = realm.objectForPrimaryKey('Chat', chatId);
    expect(JSON.parse(JSON.stringify(realmChat))).toEqual(chatObj);

    deleteChat(chatId, realm);

    const realmChat_deleted = realm.objectForPrimaryKey('Chat', chatId);
    expect(JSON.parse(JSON.stringify(realmChat_deleted))).toEqual(null);
  });

  it('should delete but chat do not founded', async () => {
    const chatId = 'chat1444444444';

    deleteChat(chatId, realm);
  });
});
