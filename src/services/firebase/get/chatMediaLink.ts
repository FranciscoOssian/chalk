import storage from '@react-native-firebase/storage';

/**
 * Get the media link for a chat from Firebase Storage.
 * @param {string} chatName - The name of the chat.
 * @param {string} mediaName - The name of the media file.
 * @returns {Promise<Object>} An object containing the media URL and a delete function.
 */
export default async function getChatMediaLink(chatName: string = '', mediaName: string = '') {
  const reference = storage().ref(`/chats/${chatName}/${mediaName}`);
  const url = await reference.getDownloadURL();
  return {
    url,
    delete: () => reference.delete(),
  };
}
