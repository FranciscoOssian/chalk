import auth from '@react-native-firebase/auth';
import getRealm from '@services/realm/getRealm';
import ChatType from '@src/types/chat';
import createMessage from '@src/services/realm/create/message';

export default async function saveMessagesByList (chat: ChatType, list: []) {
  const realm = await getRealm();
  const myId = auth().currentUser?.uid;
  if(!myId) return
  const friend = chat.owners.filter(o => o.id != myId)[0]
  list?.forEach(async (message: any) => {
    createMessage(realm, {
      from: friend?.id || '',
      to: myId,
      timestamp: new Date(message.timestamp),
      content:{
        contentType: message.content.type || message.content.contentType,
        value: message.content.value
      }
    })
  });
}