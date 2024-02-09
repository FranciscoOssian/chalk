import { AppState } from 'react-native';
import auth from '@react-native-firebase/auth';

import { sendNotification } from '@services/notifications';
import getRealm from '@services/realm/getRealm';
import ChatType from '@src/types/chat';

import getChatMediaLink from '@src/services/firebase/get/chatMediaLink';
import { fileCache } from '@src/services/realm/fileCache';

import listenToChatQueue from '@services/firebase/listeners/chatQueue';

import AsyncStorage from '@react-native-async-storage/async-storage';
import messages from '@src/services/realm/create/messages';

let lastNotifications: any = {};

export const cleanNotificationsCache = () => {
  lastNotifications = {};
};

const getOnFireBase = async (chat: ChatType, myId: string, realm: Realm) => {
  listenToChatQueue(chat.id, myId, async (dataSnapshot, queueRef) => {
    let lastMessages: any[] = dataSnapshot.val() ? dataSnapshot.val() : [];
    const friend = chat.owners.filter((o) => o.id != myId)[0];

    lastMessages = await Promise.all(
      lastMessages.map(async (msg: any) => {
        let value = msg.content.value;
        if (msg.content.type === 'image') {
          const external = await getChatMediaLink(chat.id, msg.content.value);
          const cached = await fileCache(external.url, realm);
          value = cached.path;
          external.delete();
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

    messages(realm, myId, chat, lastMessages);

    queueRef.set([]);

    const chatId = await AsyncStorage.getItem(`currentOpenedChat`);

    if (AppState.currentState === 'active') {
      if (chatId === chat?.id) {
        return;
      }
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

export const iterateOverChats = async () => {
  const realm = await getRealm();
  const myId = auth().currentUser?.uid;
  if (!myId) {
    auth().onAuthStateChanged((usr) => {
      if (usr) iterateOverChats();
    });
    return;
  }
  realm.objects<ChatType>('Chat').map(async (chat) => {
    getOnFireBase(chat, myId, realm);
  });
  realm.objects<ChatType>('Chat').addListener((chats, changes) => {
    changes.insertions.forEach((index) => {
      getOnFireBase(chats[index], myId, realm);
    });
  });
};
