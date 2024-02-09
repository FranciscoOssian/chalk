import Chat from '@src/types/chat';
import createMessage from '@src/services/realm/create/message';
import Message from '@src/types/message';

export default async function messages(realm: Realm, myId: string, chat: Chat, list: Message[]) {
  if (!myId) return;
  const friend = chat.owners.filter((o) => o.id != myId)[0];
  list?.forEach(async (message: any) => {
    createMessage(realm, {
      from: friend?.id || '',
      to: myId,
      timestamp: new Date(message.timestamp),
      content: {
        contentType: message.content.contentType,
        value: message.content.value,
      },
    });
  });
}
