import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { sendNotification } from '@services/notifications';
import getRealm from '@services/realm/getRealm';
import ChatType from '@src/types/chat';

import saveMessagesByList from './saveMessagesByList';
import getChatMediaLink from '@src/services/firebase/get/chatMediaLink';
import { fileCache } from '@src/services/realm/fileCache';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const BACKGROUND_FETCH_TASK = 'fetch-new-messages-and-store';

let lastNotifications: any = {};

export const cleanNotificationsCache = () => {
  lastNotifications = {};
};

type configType = { enableCurrentFriendNotification: boolean } | undefined;

const getOnFireBase = async (chat: ChatType, myId: string, realm: Realm, config: configType) => {
  const queueRef = database().ref(`chats/${chat.id}/queues/${myId}`);
  queueRef.on('value', async (snapshot) => {
    let lastMessages: any[] = snapshot.val() ? snapshot.val() : [];
    const friend = chat.owners.filter((o) => o.id != myId)[0];

    lastMessages = await Promise.all(
      lastMessages.map(async (msg: any) => {
        let value = msg.content.value;
        if (msg.content.type === 'image') {
          if (!msg.content.value.includes('https')) {
            const external = await getChatMediaLink(chat.id, msg.content.value);
            const cached = await fileCache(external.url, realm);
            value = cached.path;
            external.delete();
          } else {
            const cached = await fileCache(msg.content.value, realm);
            value = cached.path;
          }
        }
        return {
          ...msg,
          content: {
            contentType: msg.content.type,
            value,
          },
        };
      })
    );

    saveMessagesByList(chat, lastMessages as []);

    queueRef.set([]);

    const send = await AsyncStorage.getItem(`sendNotification:${chat.id}`);
    if (send === 'no' || send === null) {
      return;
    }

    lastMessages.map((msg: any) => {
      if (!friend.id) return;
      if (!lastNotifications[friend.id]) lastNotifications[friend.id] = [];
      let value;
      switch (msg.content.contentType) {
        case 'text':
          value = msg.content.value;
          break;
        case 'image':
          value = 'image';
          break;
        default:
          break;
      }
      lastNotifications[friend.id] = [...lastNotifications[friend.id], value];
      sendNotification({
        identifier: friend.id,
        title: friend.name,
        body: lastNotifications[friend.id].join('\n'),
      });
    });
  });
};

export const getFireMessagesAndStore = async (config: configType) => {
  const realm = await getRealm();
  const myId = auth().currentUser?.uid;
  if (!myId) {
    auth().onAuthStateChanged((usr) => {
      if (usr) getFireMessagesAndStore(config);
    });
    return;
  }
  realm.objects<ChatType>('Chat').map(async (chat) => {
    getOnFireBase(chat, myId, realm, config);
  });
  realm.objects<ChatType>('Chat').addListener((chats, changes) => {
    changes.insertions.forEach((index) => {
      getOnFireBase(chats[index], myId, realm, config);
    });
  });
};

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  await getFireMessagesAndStore({
    enableCurrentFriendNotification: true,
  });

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
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

export const startBackgroundFetchMessages = registerBackgroundFetchAsync;
export const removeBackgroundFetchMessages = unregisterBackgroundFetchAsync;
