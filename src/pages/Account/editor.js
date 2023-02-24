import storage from '@react-native-firebase/storage';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import ThemeProvider from '../../Providers/theme';
import SafeArea from '../../components/common/SafeArea';
import EditorForm from '../../components/pages/Account/EditorForm';
import Head from '../../components/pages/Account/HeadEditor';
import useUser from '../../hooks/useUser';
import setFirestoreUser from '../../services/firebase/set/user';
import setRealmUser from '../../services/realm/set/user';
import { genders } from '../../utils/genders.json';

const defaultPic =
  'https://firebasestorage.googleapis.com/v0/b/chatalk-96c5b.appspot.com/o/public%2FdefaultProfilePicture.jpg?alt=media&token=ac1c66c3-903e-482b-8cce-4d945b2159c1';

function MyProfile({ navigation }) {
  const [profilePicture, setProfilePicture] = useState(defaultPic);
  const [name, setName] = useState('');
  const [age, setAge] = useState(18);
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState({ value: 4, label: genders[4] });

  const [id, setId] = useState(null);

  const { user } = useUser();

  useEffect(() => {
    setProfilePicture(user.profilePicture);
    setAge(user.age);
    setBio(user.bio);
    setName(user.name);
    setId(user.id);
    const index = genders.indexOf(user.gender);
    console.log(index, genders, user.gender);
    const value = index === -1 ? undefined : index;
    setGender({ value, label: user.gender });
    console.log(value);
  }, [user]);

  const onHandleDone = async () => {
    if (!id) return;
    let pic = profilePicture;
    if (pic !== user.profilePicture) {
      try {
        const reference = storage().ref(`/users/${id}/profilePicture.jpg`);
        if (user.profilePicture !== profilePicture) await reference.putFile(profilePicture);
        pic = await reference.getDownloadURL();
      } catch (e) {
        return console.log(e);
      }

      try {
        await setFirestoreUser({
          authenticated: user.authenticated,
          profilePicture: pic,
          name,
          bio,
          age,
          gender: gender.value,
        });
      } catch (e) {
        return console.log(e);
      }
    } else {
      try {
        await setFirestoreUser(
          {
            authenticated: user.authenticated,
            name,
            bio,
            age,
            gender: gender.value,
          },
          'update'
        );
      } catch (e) {
        return console.log(e);
      }
    }

    try {
      const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${FileSystem.documentDirectory}-${Math.random()}-${Date.now()}`
      );
      const uri = `${FileSystem.documentDirectory}/my-chalk-profile-picture-${digest}.jpeg`;
      await FileSystem.copyAsync({ from: profilePicture, to: uri });
      await FileSystem.deleteAsync(profilePicture);
      await setRealmUser({
        authenticated: user.authenticated,
        profilePicture: uri,
        id,
        name,
        bio,
        age,
        gender: genders[gender.value],
      });
    } catch (e) {
      console.log(e);
    }

    navigation.push('/');
  };

  return (
    <Main>
      <Head
        profile={{
          name,
          age,
          bio,
          pic: profilePicture,
        }}
        pic={profilePicture}
        onBackPress={() => navigation.goBack()}
        onDonePress={onHandleDone}
        onProfilePhotoPick={(uri) => {
          //setProfilePicture(uri);
        }}
      />
      <EditorForm
        name={{ value: name, set: setName }}
        age={{ value: age, set: setAge }}
        bio={{ value: bio, set: setBio }}
        gender={{ value: gender.value, label: gender.label, set: setGender }}
      />
    </Main>
  );
}

export default function (props) {
  return (
    <SafeArea>
      <ThemeProvider>
        <MyProfile {...props} />
      </ThemeProvider>
    </SafeArea>
  );
}

const Main = styled.ScrollView.attrs({
  contentContainerStyle: (props) => {
    return {
      alignItems: 'center',
      justifyContent: 'center',
    };
  },
})`
  flex: 1;
  width: 100%;
`;
