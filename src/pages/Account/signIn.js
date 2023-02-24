import auth from '@react-native-firebase/auth';
import * as FileSystem from 'expo-file-system';
import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, Alert } from 'react-native';
import styled from 'styled-components';

import ThemeProvider from '../../Providers/theme';
import Apple from '../../components/common/Apple';
import Button from '../../components/common/Button';
import FaceBook from '../../components/common/Facebook';
import Google from '../../components/common/Google';
import Row from '../../components/common/Row';
import SafeArea from '../../components/common/SafeArea';
import SignForm from '../../components/pages/Account/SignForm';
import SignInput from '../../components/pages/Account/SignInput';
import SignTitle from '../../components/pages/Account/SignTitle';
import useUser from '../../hooks/useUser';
import getChatMediaLink from '../../services/firebase/get/chatMediaLink';
import getFriends from '../../services/firebase/get/friends';
import getLastFireMessages from '../../services/firebase/get/lastMessages';
import getFirebaseUser from '../../services/firebase/get/user';
import createRealmChat from '../../services/realm/create/chat';
import createMessage from '../../services/realm/create/message';
import getRealmUser from '../../services/realm/get/user';
import setRealmUser from '../../services/realm/set/user';
import { signIn } from '../../services/rn-google-signin';
import { genders } from '../../utils/genders.json';

function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, refresh } = useUser();

  const onSingIn = async (type) => {
    let uid;
    if (type === 'google') {
      console.log('google');
      const { idToken } = await signIn();
      if (!idToken) return;
      const googleCredential = await auth.GoogleAuthProvider.credential(idToken);
      const { user } = await auth().signInWithCredential(googleCredential);
      uid = user.uid;
    }
    if (type === 'email') {
      let response;
      try {
        response = await auth().signInWithEmailAndPassword(email, password);
      } catch (err) {
        Alert.alert(err.code, err.message);
        return;
      }
      uid = response.user.uid;
    }
    const friends = await getFriends(uid);
    for (const id of [uid, ...friends]) {
      const { authenticated, age, name, bio, profilePicture, gender } = await getFirebaseUser(id);
      const uri = `${FileSystem.documentDirectory}/${id}-profile-picture.jpeg`;
      await FileSystem.downloadAsync(profilePicture, uri);
      const user = {
        name,
        bio,
        age,
        profilePicture: uri,
        authenticated,
        id,
        gender: genders[gender],
      };
      await setRealmUser(user);
      if (id !== uid) {
        const chatName = [uid, id].sort().join('-');
        const msgs = await getLastFireMessages(chatName, uid);
        const realmMessages = [];
        const chat = {
          id: [uid, id].sort().join('-'),
          owners: [await getRealmUser(id), await getRealmUser(uid)],
          messages: realmMessages,
        };
        await createRealmChat(chat);
        for (const m of msgs) {
          let value = m.content.value;
          if (m.content.type !== 'text') {
            value = await getChatMediaLink(chatName, m.content.value);
          }
          await createMessage({
            from: id,
            to: uid,
            timestamp: m.timestamp,
            content: {
              contentType: m.content.type,
              value,
            },
          });
        }
      }
      refresh();
    }
  };

  const onHandleSignIn = (type) => {
    onSingIn(type);
    //setPassword('');
  };

  useEffect(() => {
    if (user.id !== 0) navigation.navigate('/');
  }, [user]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SignTitle>SignIn</SignTitle>
      <SignForm>
        <SignInput placeholder="Email" onChangeText={setEmail} value={email} />
        <SignInput
          secureTextEntry
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
        />

        <Button title="SignIn" onPress={() => onHandleSignIn('email')} />

        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Or SignIn with:</Text>
          <Row
            style={{
              width: '60%',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <Google size={30} color="black" onPress={() => onHandleSignIn('google')} />
            <FaceBook size={30} color="black" />
            <Apple size={30} color="black" />
          </Row>

          <Text onPress={() => navigation.navigate('/account/signup')}>
            Never SignUp? SignUp, click here.
          </Text>
        </View>
      </SignForm>
    </ScrollView>
  );
}

const Main = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
`;

export default function (props) {
  return (
    <Main>
      <SafeArea>
        <ThemeProvider>
          <SignIn {...props} />
        </ThemeProvider>
      </SafeArea>
    </Main>
  );
}
