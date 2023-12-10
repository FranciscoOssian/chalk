import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, Alert } from 'react-native';
import styled from 'styled-components/native';

import ThemeProvider from '@providers/theme';
import Apple from '@components/common/Apple';
import Button from '@components/common/Button';
import FaceBook from '@components/common/Facebook';
import Google from '@components/common/Google';
import Row from '@components/common/Row';
import SafeArea from '@components/common/SafeArea';
import SignForm from '@components/pages/Account/SignForm';
import SignInput from '@components/pages/Account/SignInput';
import SignTitle from '@components/pages/Account/SignTitle';
import { signIn } from '@services/rn-google-signin';
import { fileCache } from '@src/services/realm/fileCache';

import realmContext from '@contexts/realm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultFirebaseProfilePicture } from '@src/utils/consts';
import getUser from '@src/services/firebase/get/user';
import getFriends from '@src/services/firebase/get/friends';
import UserType from '@src/types/user';

async function onGoogleButtonPress() {
  if(auth().currentUser){
    await auth().signOut();
  }
  const { idToken } = await signIn();
  if(!idToken) return;
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const credential = await auth().signInWithCredential(googleCredential);

  // Adicionar verificação aqui
  const userInFirestore = await getUser(credential.user.uid);
  if (!userInFirestore) {
    await auth().signOut(); // Logout do usuário
    throw new Error('This account does not exist in Firestore');
  }
  return credential;
}

function SignIn({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const realm = realmContext.useRealm();

  const [myId, setMyId] = useState('');
  const me = realmContext.useQuery<UserType>('User').filtered(`id == '${myId}'`)[0];

  useEffect(() => {
    AsyncStorage.getItem("my-uid").then(id => {
      setMyId(`${id}`);
      if (me) navigation.navigate('/');
    });
  }, [me]);

  const onHandleSignIn = async (method: string) => {

    if (method === 'email') {
      const isEmailEmpty = email === '';
      const isPasswordEmpty = password === '';

      let errorMessage = '';
      let isError = false;

      if(isEmailEmpty){
        errorMessage = errorMessage + `\n- empty email`;
        isError = true;
      }
      if(isPasswordEmpty){
        errorMessage = errorMessage + `\n- empty password`
        isError = true;
      }
      
      if(isError) return Alert.alert('Error', errorMessage);
    }

    let userCredential: FirebaseAuthTypes.UserCredential | undefined;

    switch (method) {
      case 'email':
        try{
          userCredential = await auth().signInWithEmailAndPassword(email, password);
        }
        catch(e: any){
          Alert.alert(e.code, e.message);
          return;
        }
        break;
      case 'google':
        try {
          userCredential = await onGoogleButtonPress();
        }
        catch(e){
          Alert.alert('Error', (e as any).message);
          return;
        }
        break;
      case 'facebook':
        userCredential = {} as any;
        break;
      default:
        userCredential = {} as any;
        break;
    }

    if (!userCredential) return;

    const firebaseUser = await getUser(userCredential.user.uid);
    const friendsUser = await getFriends(userCredential.user.uid);

    const obj = {
      id: userCredential.user.uid,
      name: firebaseUser?.name || '',
      age: firebaseUser?.age || 18,
      bio: firebaseUser?.bio || '<bio>',
      profilePicture: (await fileCache(firebaseUser?.profilePicture || defaultFirebaseProfilePicture, realm)).path,
      gender: firebaseUser?.gender || 'Prefer not to state',
      authenticated: firebaseUser?.authenticated || false
    }

    realm.write(() => {
      realm.create('User', obj)
    });

    AsyncStorage.setItem('my-uid', userCredential.user.uid);
    setMyId(userCredential.user.uid);

    if(!friendsUser) return;

    for (let friendId of friendsUser) {

      const friendUser = await getUser(friendId);
      const chatId = [userCredential.user.uid, friendId].sort().join('-');
      const getUserHere = (id: string = '') => realm.objectForPrimaryKey<UserType>('User', id)
      const friendPicture = (await fileCache(friendUser?.profilePicture, realm)).path

      realm.write(() => {
        if(!friendUser) return;
        realm.create('User', {
          ...friendUser,
          id: friendId,
          profilePicture: friendPicture
        });
        realm.create('Chat', {
          id: chatId,
          owners: [getUserHere(userCredential?.user.uid), getUserHere(friendId)],
          messages: []
        });
      });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SignTitle>SignIn</SignTitle>
      <SignForm>
        <SignInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
        />
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

export default function (props: any) {
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
