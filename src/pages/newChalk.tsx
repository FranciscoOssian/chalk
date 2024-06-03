import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import styled from 'styled-components/native';

import ThemeProvider from '@providers/theme';
import HangUp from '@components/common/HangUp';
import SafeArea from '@components/common/SafeArea';
import BackGround from '@components/pages/newChalk/BackGround';
import Info from '@components/pages/newChalk/Info';
import useUser from '@hooks/useUser';
import { defaultFirebaseProfilePicture } from '@src/utils/consts';

import UserType from '@src/types/user';
import { matchListener } from '@src/services/chalkSystem';

import realmContext from '@contexts/realm';
import updateFriends from '@src/services/firebase/update/friends';

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
  updateFriends(me.id, [friend?.uid]);
};

function NewChalk({ navigation }: any) {
  const me = useUser();
  const realm = realmContext.useRealm();

  useEffect(() => {
    if (!me || !realm) return;
    let disconnect: () => void;
    const run = async () => {
      disconnect = await matchListener(
        me,
        (friend) => {
          onHandleNewFriend(realm, me, friend);
          navigation.navigate('/chat', { id: friend?.uid });
        },
        realm
      );
    };
    run();
    return () => disconnect();
  }, [me, realm]);

  const pic = me?.profilePicture || defaultFirebaseProfilePicture;

  return (
    <Main>
      <StatusBar hidden />
      <BackGround source={{ uri: pic }} blurRadius={5}>
        <Info picture={pic} name={me?.name || ''} />
        <HangUp onPress={() => navigation.goBack()} />
      </BackGround>
    </Main>
  );
}

export default function (props: any) {
  return (
    <SafeArea>
      <ThemeProvider>
        <NewChalk {...props} />
      </ThemeProvider>
    </SafeArea>
  );
}

const Main = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
