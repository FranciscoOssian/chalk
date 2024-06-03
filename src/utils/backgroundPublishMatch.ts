import { AppState } from 'react-native';
import auth from '@react-native-firebase/auth';
import getRealm from '@services/realm/getRealm';
import { matchListener } from '@src/services/chalkSystem';
import UserType from '@src/types/user';

const onHandleNewFriend = (realm: Realm, me: UserType, friend: UserType & { uid: string }) => {
  const chatId = [me.id, friend.uid].sort().join('-');
  realm.write(() => {
    try {
      realm.create('User', {
        id: friend.uid,
        name: friend.name,
        age: friend.age,
        authenticated: friend.authenticated,
        bio: friend.bio,
        gender: friend.gender,
        profilePicture: friend.profilePicture,
      });
      realm.create('Chat', {
        id: chatId,
        owners: [
          realm.objectForPrimaryKey<UserType>('User', `${me.id}`),
          realm.objectForPrimaryKey<UserType>('User', friend.uid),
        ],
        messages: [],
      });
    } catch (e) {}
  });
};

export const initMatching = async () => {
  const realm = await getRealm();
  const myId = auth().currentUser?.uid;
  if (!myId) {
    auth().onAuthStateChanged((usr) => {
      if (usr) initMatching();
    });
    return;
  }
  const me = realm.objects('User').filtered(`id == '${myId}'`)[0] as UserType;

  const disconnect = matchListener(
    me,
    (friend) => {
      onHandleNewFriend(realm, me, friend);
    },
    realm
  );

  return disconnect;
};
