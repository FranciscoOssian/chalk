import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import ThemeProvider from '@providers/theme';
import SafeArea from '@components/common/SafeArea';
import EditorForm from '@components/pages/Account/EditorForm';
import Head from '@components/pages/Account/HeadEditor';
import UserType from '@src/types/user';

import { defaultFirebaseProfilePicture } from '@utils/consts.ts';
import usePicker from '@src/hooks/usePicker';
import { Alert } from 'react-native';
import useUser from '@hooks/useUser';

import setFireUser from '@services/firebase/set/user';
import setProfileImage from '@services/firebase/set/profileImage';

import { fileCache } from '@src/services/realm/fileCache';

import realmContext from '@contexts/realm';
import Done from '@src/components/pages/Account/Done';
import Back from '@src/components/common/Back';

const classifyImage = async (
  uri: string
): Promise<{ className: string; probability: number }[]> => {
  try {
    const response = await FileSystem.uploadAsync(
      'https://nsfw-img-detect-node.onrender.com/classify',
      uri,
      {
        fieldName: 'image',
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      }
    );

    return JSON.parse(response.body);
  } catch (error) {
    console.error('Error classifying image:', error);
    Alert.alert('Error', 'Failed to classify image');
    return [];
  }
};

const isNSFW = async (uri: string) => {
  const api_classes = await classifyImage(uri);

  console.log(api_classes);

  if (api_classes.length === 0) return;

  const classes = {
    porn: api_classes.find((c) => c.className === 'Porn'),
    sexy: api_classes.find((c) => c.className === 'Sexy'),
    neutral: api_classes.find((c) => c.className === 'Neutral'),
    draw: api_classes.find((c) => c.className === 'Draw'),
    hentai: api_classes.find((c) => c.className === 'Hentai'),
  };

  const maxProbability = api_classes.reduce((max, current) =>
    max.probability > current.probability ? max : current
  );

  if (!classes.hentai?.probability) return;
  if (!classes.porn?.probability) return;

  if (maxProbability.className === 'Porn' || classes.porn?.probability > 0.4) return true;
  if (maxProbability.className === 'Sexy' && maxProbability.probability > 0.72) return true;
  if (maxProbability.className === 'Hentai' || classes.hentai?.probability > 0.5) return true;
  else return false;
};

function MyProfile({ navigation }: any) {
  const [newMe, setNewMe] = useState<UserType>({
    id: '',
    name: '',
    age: 18,
    bio: '',
    profilePicture: defaultFirebaseProfilePicture,
    authenticated: false,
    gender: '',
  });

  const realm = realmContext.useRealm();

  const me = useUser();

  const { t: translation, i18n } = useTranslation();
  const t = (s: string) => translation<string>(s);

  useEffect(() => {
    if (!me) return;
    const { profilePicture, name, age, bio, gender } = me;
    setNewMe({
      profilePicture,
      name,
      bio,
      age,
      gender,
    });
  }, [me]);

  const [_, pick] = usePicker({ base64: false });

  const onSetterUser = (prop: string, value: any) => {
    if (!value) return;
    const temp: any = newMe;
    temp[prop] = value;
    setNewMe((temp) => ({ ...temp, prop: value }));
  };

  const onHandleDone = async () => {
    if (!me.id || newMe === me) return;
    let cached: string | null = null;
    try {
      let imgFire = '';
      if (me.profilePicture !== newMe.profilePicture) {
        if (!newMe.profilePicture) return;
        const resp = setProfileImage(me.id, newMe.profilePicture);
        imgFire = (await resp).url;
        setFireUser({
          user: { ...newMe, profilePicture: imgFire },
          update: true,
        });
        cached = (await fileCache(imgFire, realm)).path;
      } else {
        const { profilePicture, ...userMe } = me;
        setFireUser({
          user: userMe,
          update: true,
        });
      }
      realm.write(() => {
        const usr = realm.objectForPrimaryKey<UserType>('User', me.id || '');
        if (!usr) return;
        if (cached) usr.profilePicture = cached;
        usr.name = newMe.name;
        usr.age = newMe.age;
        usr.name = newMe.name;
        usr.gender = newMe.gender;
        usr.bio = newMe.bio;
      });
    } catch (error) {
      alert(t('Error updating profile'));
    } finally {
      navigation.push('/');
      alert(t('Profile updated successfully'));
    }
  };

  const handleProfilePhotoPick = async () => {
    const result = await pick({
      propagate: false,
    });
    if (result?.canceled || !result) return;
    const nsfw = await isNSFW(result.assets[0].uri);
    if (nsfw) {
      Alert.alert(
        t('Alert'),
        t(`your image was detected as inappropriate for the application`) + `🧐🤚📸`
      );
      return;
    } else {
      onSetterUser('profilePicture', result.assets[0].uri);
    }
  };

  return (
    <Main>
      <Head
        profile={newMe}
        onBackPress={() => {}}
        onDonePress={() => {}}
        onProfilePhotoPick={handleProfilePhotoPick}
      />
      <Back onPress={navigation.goBack} />
      <Done onPress={onHandleDone} />
      <EditorForm
        name={{ value: newMe.name, set: (v: any) => onSetterUser('name', v) }}
        age={{ value: newMe.age, set: (v: any) => onSetterUser('age', v) }}
        bio={{ value: newMe.bio, set: (v: any) => onSetterUser('bio', v) }}
        gender={{
          value: newMe.gender,
          label: newMe.gender,
          set: (v: any) => onSetterUser('gender', v.label),
        }}
      />
    </Main>
  );
}

export default function (props: any) {
  return (
    <SafeArea>
      <ThemeProvider>
        <MyProfile {...props} />
      </ThemeProvider>
    </SafeArea>
  );
}

const Main = styled.ScrollView`
  flex: 1;
  width: 95%;
`;
