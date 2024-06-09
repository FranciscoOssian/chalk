import auth from '@react-native-firebase/auth';
import { startBackgroundFetch } from '@services/background';
import App from '@src/index';
import listenToNotifications from '@src/services/firebase/listeners/onNotifyme';
import UserType from '@src/types/user';
import getRealm from '@services/realm/getRealm';
import createRealmUser from '@src/services/realm/create/user';
import getUser from '@src/services/firebase/get/user';
import updateFriends from '@src/services/firebase/update/friends';
import ChatType from '@src/types/chat';
import listenToChatQueue from '@src/services/firebase/listeners/chatQueue';
import getChatMediaLink from '@src/services/firebase/get/chatMediaLink';
import messages from '@src/services/realm/create/messages';
import { AppState } from 'react-native';
import { sendNotification } from '@src/services/notifications';
import useAppState from '@src/hooks/useAppState';

let lastNotifications: any = {};

export const cleanNotificationsCache = () => {
  lastNotifications = {};
};

const onHandleNewNotifications_newChat = async (notification: any) => {
  const myId = auth().currentUser?.uid;
  if (!myId) {
    auth().onAuthStateChanged((usr) => {
      if (usr) onHandleNewNotifications_newChat(notification);
    });
    return;
  }
  const realm = await getRealm();
  const friend: UserType | undefined = await getUser(notification.from);
  if (!friend) return;
  friend['id'] = notification.from;
  const chatId = [myId, notification.from].sort().join('-');
  await createRealmUser(realm, friend);
  realm.write(() => {
    realm.create('Chat', {
      id: chatId,
      owners: [
        realm.objectForPrimaryKey<UserType>('User', `${myId}`),
        realm.objectForPrimaryKey<UserType>('User', `${friend.id}`),
      ],
      messages: [],
    });
  });
  updateFriends(myId, [friend.id]);
};

const handle_new_friends = async () => {
  const myId = auth().currentUser?.uid;
  if (!myId) {
    auth().onAuthStateChanged((usr) => {
      if (usr) handle_new_friends();
    });
    return;
  }
  const realm = await getRealm();
  const chatListiner = async (chat: ChatType) => {
    listenToChatQueue(chat.id, myId, async (dataSnapshot, queueRef) => {
      console.log(queueRef);
      let lastMessages: any[] = dataSnapshot.val() ? dataSnapshot.val() : [];
      const friend = chat.owners.filter((o) => o.id != myId)[0];
      console.log(dataSnapshot.val());

      lastMessages = await Promise.all(
        lastMessages.map(async (msg: any) => {
          let value = msg.content.value;
          if (msg.content.type === 'image') {
            const external = await getChatMediaLink(chat.id, msg.content.value);
            value = external.url;
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
      //const chatId = await AsyncStorage.getItem(`currentOpenedChat`);

      if (AppState.currentState === 'active') {
        return;
        console.log('kjbefjk');
        //if (chatId === chat?.id) {
        //  return;
        //}
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
  realm.objects<ChatType>('Chat').map(async (chat) => {
    console.log(chat);
    chatListiner(chat);
  });
  realm.objects<ChatType>('Chat').addListener((chats, changes) => {
    changes.insertions.forEach((index) => {
      chatListiner(chats[index]);
    });
  });
};

handle_new_friends();
const BACKGROUND_FETCH_NEW_FRIEND = 'listen-new-friend-id';
startBackgroundFetch(BACKGROUND_FETCH_NEW_FRIEND, async () => {
  handle_new_friends();
});

// -----------------------------------------------------------

const onHandleNewNotifications = (notification: any) => {
  if (notification.message.type === 'new_chat') {
    console.log(true, notification);
    onHandleNewNotifications_newChat(notification);
  }
};
listenToNotifications(onHandleNewNotifications);
const BACKGROUND_FETCH_NEW_NOTIFICATION = 'listen-new-notifications-background-id';
startBackgroundFetch(BACKGROUND_FETCH_NEW_NOTIFICATION, async () => {
  listenToNotifications(onHandleNewNotifications);
});

export default () => {
  const isActive = useAppState();

  if (isActive) {
    cleanNotificationsCache();
  }

  return <App />;
};
