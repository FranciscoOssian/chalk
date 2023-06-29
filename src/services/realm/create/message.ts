import ChatType from '@src/types/chat';
import MessageType from '@src/types/message';
import * as Crypto from 'expo-crypto';

export default async function createMessage(realm: Realm, messageData: Omit<MessageType, 'id'>) {
  if (messageData.content.value === '') return;

  const chatName = [messageData.from, messageData.to].sort().join('-');

  const sha = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${JSON.stringify(messageData)}`
  );

  const prev = realm.objectForPrimaryKey('Message', sha);
  if (prev) return prev;

  realm.write(() => {
    const newMessage = realm.create<MessageType>('Message', {
      ...messageData,
      id: sha,
      content: realm.create('ContentMessage',{
        ...messageData.content,
        id: sha
      })
    });
    const chatRealm = realm.objectForPrimaryKey<ChatType>('Chat', chatName);
    if(!chatRealm) return
    chatRealm?.messages.push(newMessage as unknown as MessageType);
    chatRealm.lastMessage = newMessage;
  });

  return () => {
    return realm.objectForPrimaryKey('Message', sha);
  };
}
