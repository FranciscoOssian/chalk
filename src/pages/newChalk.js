import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';

import ThemeProvider from '../Providers/theme';
import HangUp from '../components/common/HangUp';
import SafeArea from '../components/common/SafeArea';
import BackGround from '../components/pages/newChalk/BackGround';
import Info from '../components/pages/newChalk/Info';
import useUser from '../hooks/useUser';
import createChat from '../services/realm/create/chat';
import getRealmUser from '../services/realm/get/user';
import setRealmUser from '../services/realm/set/user';
import { genders } from '../utils/genders.json';

async function get(id) {
  try {
    return JSON.parse(await AsyncStorage.getItem(id));
  } catch (e) {
    return null;
  }
}

const defaultPic =
  'https://firebasestorage.googleapis.com/v0/b/chatalk-96c5b.appspot.com/o/public%2FdefaultProfilePicture.jpg?alt=media&token=ac1c66c3-903e-482b-8cce-4d945b2159c1';

function NewChalk({ navigation }) {
  const { user: me, getExternalProfilePictureUri } = useUser();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let disconnect = () => {};

    if (me.id === 0 || sent === true) return;

    const socket = io('https://chalk-matching-system.onrender.com/');

    socket.on('connect', async () => {
      console.log('connected');
      socket.on('match', (u) => {
        console.log('wow, you have a new friend', u);
        onHandlePersonFind(u);
      });
      const mc = (await get('matchingConfig')) ?? (await get('defaultMatchingConfig'));
      const me_to_send = {
        name: me.name,
        bio: me.bio,
        age: me.age,
        gender: me.gender === null ? 4 : genders.indexOf(me.gender),
        uid: me.id,
        profilePicture: await getExternalProfilePictureUri(),
        authenticated: me.authenticated,
        matchingConfig: {
          from: mc.from,
          to: mc.to,
          genders: mc.genders,
          lang: mc.lang,
        },
      };
      socket.emit('add_user', me_to_send);
      console.log(me_to_send);
      disconnect = () => socket.disconnect();
    });

    setSent(true);

    return () => {
      disconnect();
    };
  }, [me]);

  const onHandlePersonFind = async (userMatched) => {
    if (userMatched.uid === me.id) return;
    const chatName = [me.id, userMatched.uid].sort().join('-');
    let externalUserPic = defaultPic;
    try {
      const reference = storage().ref(`/users/${userMatched.uid}/profilePicture.jpg`);
      externalUserPic = await reference.getDownloadURL();
    } catch (e) {
      console.log(e);
      console.log('fail to load profile picture, skiping');
    }
    await setRealmUser({
      profilePicture: externalUserPic,
      name: userMatched.name,
      age: userMatched.age,
      authenticated: userMatched.authenticated,
      bio: userMatched.bio,
      gender: genders[userMatched.gender],
      id: userMatched.uid,
    });
    await createChat({
      id: chatName,
      owners: [me, await getRealmUser(userMatched.uid)],
      messages: [],
    });
    let friends = [];
    const friendsSnapShot = await firestore()
      .collection('Users')
      .doc(`${me.id}`)
      .collection('friends')
      .doc('friends')
      .get();
    if (!friendsSnapShot.exists) {
      friends = [userMatched.uid];
      await firestore().collection('Users').doc(me.id).collection(`friends`).doc(`friends`).set({
        friends,
      });
    } else friends = friendsSnapShot.data().friends;
    if (friends.indexOf(userMatched.uid) === -1) {
      await firestore()
        .collection('Users')
        .doc(`${me.id}`)
        .collection('friends')
        .doc('friends')
        .update({
          friends: [...friends, userMatched.uid],
        });
    }
    navigation.push('/chat', { id: userMatched.uid });
  };

  return (
    <Main>
      <StatusBar hidden />
      <BackGround source={{ uri: me.profilePicture }} blurRadius={5} opacity={0.8}>
        <Info picture={me.profilePicture} name={me.name} />
        <HangUp onPress={() => navigation.goBack()} />
      </BackGround>
    </Main>
  );
}

export default function (props) {
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
