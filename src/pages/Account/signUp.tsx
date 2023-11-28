import React, { useEffect, useState } from 'react';
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
import auth from '@react-native-firebase/auth';

import realmContext from '@contexts/realm';
import AsyncStorage from '@react-native-async-storage/async-storage';

import setUser from '@src/services/firebase/set/user';
import { fileCache } from '@src/services/realm/fileCache';
import { defaultFirebaseProfilePicture } from '@src/utils/consts';
import getUser from '@src/services/firebase/get/user';

async function onGoogleButtonPress() {
  if(auth().currentUser){
    await auth().signOut();
  }
  const { idToken } = await signIn();
  if(!idToken) return;
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  return auth().signInWithCredential(googleCredential);
}

const SignUp = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRep, setPasswordRep] = useState('');
  const realm = realmContext.useRealm();

  const [myId, setMyId] = useState('');
  const me = realmContext.useQuery('User').filtered(`id == '${myId}'`)[0];

  useEffect(() => {
    AsyncStorage.getItem("my-uid").then(id => {
      setMyId(`${id}`);
      if (me) navigation.navigate('/');
    });
  }, [me]);

  const onHandleSignUp = async (method: string) => {
    if (method === 'email') {
      const isEmailEmpty = email === '';
      const isPasswordEmpty = password === '';
      const isPasswordRepEmpty = passwordRep === '';
      const isPasswordCheck = password === passwordRep;

      let errorMessage = '';

      if(isEmailEmpty){
        errorMessage = errorMessage + `\n- empty email`
      }
      if(isPasswordEmpty){
        errorMessage = errorMessage + `\n- empty password`
      }
      if(isPasswordRepEmpty){
        errorMessage = errorMessage + `\n- empty second password (repeat)`
      }
      if(!isPasswordCheck){
        errorMessage = errorMessage + `\n- password do not check`
      }
      
      return Alert.alert('Error', errorMessage);
    }

    let userCredential;

    switch (method) {
      case 'email':
        try{
          userCredential = await auth().createUserWithEmailAndPassword(email, password);
        }
        catch(e: any){
          Alert.alert(e.code, e.message);
          return;
        }
        break;
      case 'google':
        try{
          userCredential = await onGoogleButtonPress();
        }
        catch(e){
          Alert.alert('', JSON.stringify(e))
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

    if(firebaseUser) return Alert.alert("already registered user, error")

    const photoLink = userCredential.user.photoURL || defaultFirebaseProfilePicture

    const obj = {
      id: userCredential.user.uid,
      name: userCredential.user.displayName || 'Anon',
      age: 18,
      bio: '<bio>',
      profilePicture: (await fileCache(photoLink, realm)).path,
      gender: 'Prefer not to state',
      authenticated: false
    }

    setUser({ user: {...obj, profilePicture: photoLink} });

    realm.write(() => realm.create('User', obj));

    AsyncStorage.setItem('my-uid', userCredential.user.uid);
    setMyId(userCredential.user.uid);
  };

  return (
    <>
      <SignTitle>SignUp</SignTitle>
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
        <SignInput
          secureTextEntry
          placeholder="Repeat password"
          onChangeText={setPasswordRep}
          value={passwordRep}
        />

        <Button title="SignUp" onPress={() => onHandleSignUp('email')} />

        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Or SignUp with:</Text>
          <Row
            style={{
              width: '60%',
              justifyContent: 'space-between',
            }}>
            <Google size={30} color="black" onPress={() => onHandleSignUp('google')} />
            <FaceBook size={30} color="black" />
            <Apple size={30} color="black" />
          </Row>

          <Text onPress={() => navigation.navigate('/account/signin')}>
            Already have a account? Login, click here
          </Text>
        </View>
      </SignForm>
    </>
  );
};

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
          <ScrollView showsVerticalScrollIndicator={false}>
            <SignUp {...props} />
          </ScrollView>
        </ThemeProvider>
      </SafeArea>
    </Main>
  );
}
