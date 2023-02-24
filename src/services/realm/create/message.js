import * as Crypto from 'expo-crypto';

import getRealm from '../index';
export default async function createMessage(messageData) {
  if (messageData.content.value === '') return;

  const chatName = [messageData.from, messageData.to].sort().join('-');

  const sha = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${JSON.stringify(messageData)}`
  );

  const realm = await getRealm();
  const prev = realm.objectForPrimaryKey('Message', sha);
  if (prev) return prev;

  realm.write(() => {
    realm.create('ContentMessage', { ...messageData.content, id: sha });
    const content = realm.objectForPrimaryKey('ContentMessage', sha);
    realm.create('Message', { ...messageData, id: sha, content });
    const chat = realm.objects('Chat').filtered(`id == '${chatName}'`)[0];
    chat.messages = [...chat.messages, realm.objects('Message').filtered(`id == '${sha}'`)[0]];
  });

  return () => {
    return realm.objectForPrimaryKey('Message', sha);
  };
}
