import database from '@react-native-firebase/database';

export default async function getLastMessages(chatName: string, myId: string): Promise<any[]> {
  const snapshot = await database().ref(`chats/${chatName}/queues/${myId}`).once('value');
  return snapshot.val() ? snapshot.val() : [];
}
