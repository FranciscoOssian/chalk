import Chat from '@src/types/chat';
import getRealm from '../getRealm';

export const listenToChats = async (
  callback: (chats: Realm.Collection<Chat & Realm.Object<unknown, never>>) => void
) => {
  const realm = await getRealm();
  realm.objects<Chat>('Chat').addListener((chats) => {
    callback(chats);
  });
};
