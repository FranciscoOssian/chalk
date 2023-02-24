import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

import getChatMediaLink from '../services/firebase/get/chatMediaLink';
import { sendNotification } from '../services/notifications';
import getRealm from '../services/realm';
import createMessage from '../services/realm/create/message';

const lastNotifications = {};

const onRecived = (callback, chatId, meId) => {
  database()
    .ref(`chats/${chatId}/queues/${meId}`)
    .on('value', (snapshot) => {
      const prev = snapshot.val() ? snapshot.val() : [];
      callback(prev);
    });
};

async function searchMessagesOfChat(chat, me) {
  const friend = chat.owners.filter((e) => e.id !== me.id)[0];
  onRecived(
    async (messages) => {
      const bodyNotification = messages
        .map((e) => (e.content.type === 'text' ? e.content.value : 'image/video'))
        .join('\n');
      for (const message of messages) {
        let value = message.content.value;
        if (message.content.type !== 'text') {
          value = await getChatMediaLink(chat.id, message.content.value);
        }
        await createMessage({
          from: friend.id,
          to: me.id,
          timestamp: message.timestamp,
          content: {
            contentType: message.content.type,
            value,
          },
        });
        await database().ref(`chats/${chat.id}/queues/${me.id}`).set([]);
        const userToHiddenNotifications = AsyncStorage.getItem('userToHiddenNotifications');
        if (userToHiddenNotifications !== friend.id) return;
        lastNotifications[friend.id] = `${lastNotifications[friend.id] ?? ''}\n${bodyNotification}`;
        sendNotification({
          identifier: friend.id,
          title: friend.name,
          body: lastNotifications[friend.id],
        });
      }
    },
    chat.id,
    me.id
  );
}

export const listinerFireMessagesStoreAndNotify = async () => {
  auth().onAuthStateChanged(async (user) => {
    if (!user) return;

    const realm = await getRealm();
    const me = realm.objectForPrimaryKey('User', user.uid);
    const chats = realm.objects('Chat');
    chats.addListener((objects, changes) => {
      changes.insertions.forEach((index) => {
        searchMessagesOfChat(objects[index], me);
      });
    });
    for (const chat of chats) {
      searchMessagesOfChat(chat, me);
    }
  });
};
