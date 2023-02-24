import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import getChatMediaLink from '../services/firebase/get/chatMediaLink';
import getLastFireMessages from '../services/firebase/get/lastMessages';
import { sendNotification } from '../services/notifications';
import getRealm from '../services/realm';
import createMessage from '../services/realm/create/message';

export const BACKGROUND_FETCH_TASK = 'fetch-new-messages-and-store';

const lastNotifications = {};

const searchForNewMessages = async () => {
  const currentUser = auth().currentUser;
  if (!currentUser) return BackgroundFetch.BackgroundFetchResult.NoData;
  const realm = await getRealm();
  const me = realm.objectForPrimaryKey('User', currentUser.uid);
  const chats = realm.objects('Chat');
  for (const chat of chats) {
    const friend = chat.owners.filter((e) => e.id !== me.id)[0];
    const messages = await getLastFireMessages(chat.id, me.id);
    let bodyNotification = '';
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
      console.log('recived message');
      bodyNotification =
        bodyNotification +
        `\n${message.content.type === 'text' ? message.content.value : 'image/video'}`;
    }

    console.log(messages, messages.length > 0);

    if (messages.length > 0) {
      lastNotifications[friend.id] = (lastNotifications[friend.id] ?? '') + bodyNotification;
      sendNotification({
        identifier: friend.id,
        title: friend.name,
        body: lastNotifications[friend.id],
      });
    }
    await database().ref(`chats/${chat.id}/queues/${me.id}`).set([]);
  }

  return BackgroundFetch.BackgroundFetchResult.NewData;
};

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log('wow, updating', new Date());
  return searchForNewMessages();
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60,
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export const startBackgroundFetchMessages = () => registerBackgroundFetchAsync();

export const removeBackgroundFetchMessages = () => unregisterBackgroundFetchAsync();
