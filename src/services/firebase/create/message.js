import database from '@react-native-firebase/database';

import createChatImage from './chatImage';

export default async function createMessage(message) {
  let value = message.content.value;
  const chatName = [message.from, message.to].sort().join('-');
  if (message.content.contentType !== 'text') {
    const { name } = await createChatImage(chatName, message.content.value);
    value = name;
  }
  database()
    .ref(`chats/${chatName}/queues/${message.to}`)
    .once('value')
    .then((snapshot) => {
      const prev = snapshot.val() ? snapshot.val() : [];
      database()
        .ref(`chats/${chatName}/queues/${message.to}`)
        .set([
          ...prev,
          {
            content: {
              type: message.content.contentType,
              value,
            },
            timestamp: `${message.timestamp}`,
          },
        ]);
    });
}
