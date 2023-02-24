import auth from '@react-native-firebase/auth';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
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
import setFireUser from '../../services/firebase/set/user';
import setRealmUser from '../../services/realm/set/user';
import { signIn } from '../../services/rn-google-signin';

const defaultPic =
  'https://firebasestorage.googleapis.com/v0/b/chatalk-96c5b.appspot.com/o/public%2FdefaultProfilePicture.jpg?alt=media&token=ac1c66c3-903e-482b-8cce-4d945b2159c1';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRep, setPasswordRep] = useState('');

  const { user: me, refresh } = useUser();

  useEffect(() => {
    if (me.id !== 0) navigation.navigate('/');
  }, [me]);

  const singUp = async (type) => {
    let uid;
    if (type === 'google') {
      console.log('google');
      const { idToken } = await signIn();
      console.log('token', idToken);
      const googleCredential = await auth.GoogleAuthProvider.credential(idToken);
      console.log('google credential', googleCredential);
      const { user } = await auth().signInWithCredential(googleCredential);
      //return;
      console.log('fire user', user);
      uid = user.uid;
    }
    if (type === 'email') {
      let response;
      try {
        response = await auth().createUserWithEmailAndPassword(email, password);
      } catch (err) {
        Alert.alert(err.code, err.message);
        return;
      }
      uid = response.user.uid;
    }
    const user = {
      id: uid,
      name: 'Anon',
      age: 18,
      bio: 'hellooooo',
      profilePicture: defaultPic,
      authenticated: false,
    };
    await setFireUser(user);
    const uri = `${FileSystem.documentDirectory}/my-chalk-profile-picture.jpeg`;
    await FileSystem.downloadAsync(defaultPic, uri);
    await setRealmUser({ ...user, profilePicture: uri });
    refresh();
  };

  const checkPass = () => {
    if (password === '' || passwordRep === '' || email === '') return false;
    if (password !== passwordRep) return false;
    return true;
  };

  const onHandleSign = (type) => {
    if (type === 'email' && !checkPass()) {
      console.log('wrong');
      Alert.alert('password dont match :(');
      setPassword('');
      setPasswordRep('');
      return;
    }
    singUp(type);
    setPassword('');
    setPasswordRep('');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SignTitle>SignUp</SignTitle>
      <SignForm>
        <SignInput placeholder="Email" onChangeText={setEmail} value={email} />
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

        <Button title="SignUp" onPress={() => onHandleSign('email')} />

        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Or SignUp with:</Text>
          <Row
            style={{
              width: '60%',
              justifyContent: 'space-between',
            }}>
            <Google size={30} color="black" onPress={() => onHandleSign('google')} />
            <FaceBook size={30} color="black" />
            <Apple size={30} color="black" />
          </Row>

          <Text onPress={() => navigation.navigate('/account/signin')}>
            Already have a account? Login, click here
          </Text>
        </View>
      </SignForm>
    </ScrollView>
  );
};

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
          <SignUp {...props} />
        </ThemeProvider>
      </SafeArea>
    </Main>
  );
}
