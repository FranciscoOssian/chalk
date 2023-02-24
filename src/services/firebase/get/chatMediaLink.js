import storage from '@react-native-firebase/storage';

export default async function getChatMediaLink(chatName, mediaName) {
  const reference = storage().ref(`/chats/${chatName}/${mediaName}`);
  return reference.getDownloadURL();
}
