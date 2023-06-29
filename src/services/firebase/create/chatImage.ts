import storage from '@react-native-firebase/storage';
import * as Crypto from 'expo-crypto';

export default async function createChatImage(id: string, uri: string) {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${id},${Date.now},${new Date()},${Math.random()}`
  );
  const reference = storage().ref(`/chats/${id}/${digest}.jpg`);
  await reference.putFile(uri);
  return {
    name: reference.name,
    url: await reference.getDownloadURL(),
  };
}
