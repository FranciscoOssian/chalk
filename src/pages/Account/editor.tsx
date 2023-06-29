import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import remoteConfig from '@react-native-firebase/remote-config';

import ThemeProvider from '@providers/theme';
import SafeArea from '@components/common/SafeArea';
import EditorForm from '@components/pages/Account/EditorForm';
import Head from '@components/pages/Account/HeadEditor';
import UserType from '@src/types/user';

import { defaultFirebaseProfilePicture } from '@utils/consts.ts';
import usePicker from '@src/hooks/usePicker';
import { Alert } from 'react-native';
import useUser from '@hooks/useUser';

import setFireUser from '@services/firebase/set/user'
import setProfileImage from '@services/firebase/set/profileImage';

import axios from 'axios';
import { fileCache } from '@src/services/realm/fileCache';

import realmContext from '@contexts/realm';
import Done from '@src/components/pages/Account/Done';
import Back from '@src/components/common/Back';

interface IA_Response {
  [key: string]: number;
}

function calculateNSFW(parametros: IA_Response) {
  let{
    porn, hentai
  } = parametros

  if(porn > 0.8 || hentai > 0.4) return true

  return false;
}

const isNSFW = async (uri: string) => {
  if(!uri) return;

  const form = new FormData();
  form.append("key", remoteConfig().getValue('nsfwDetectorPassword').asString());
  const blob = await (await fetch(uri)).blob()
  form.append("file", {
    uri: uri,
    type: blob.type,
    name: `filename.${blob.type.replace('image/', '')}`,
  } as any);

  const options = {
    method: 'POST',
    url: 'https://img-detector.foln.dev/predict_image',
    headers: {'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001'},
    data: form
  };

  try{
    const response = await axios.request(options)
    return calculateNSFW(response.data);
  }
  catch(e){}
};

function MyProfile({ navigation }: any) {
  const [newMe, setNewMe] = useState<UserType>({
    id: '',
    name: '',
    age: 18,
    bio: '',
    profilePicture: defaultFirebaseProfilePicture,
    authenticated: false,
    gender: ''
  })

  const realm = realmContext.useRealm();

  const me = useUser();

  useEffect(() => {
    if(!me) return;
    const {
      profilePicture,
      name,
      age,
      bio,
      gender
    } = me
    setNewMe({
      profilePicture,
      name,
      bio,
      age,
      gender
    });
  }, [me])

  const [_, pick] = usePicker();

  const onSetterUser = (prop: string, value: any) => {
    if(!value) return;
    const temp: any = newMe;
    temp[prop] = value
    setNewMe(temp => ({...temp, prop: value}))
  }

  const onHandleDone = async () => {
    if(!me.id || newMe === me) return;
    let cached = ''
    try {
      let imgFire = ''
      if(me.profilePicture !== newMe.profilePicture){
        if(!newMe.profilePicture) return
        const resp = setProfileImage(me.id, newMe.profilePicture)
        imgFire = (await resp).url
        setFireUser({
          user: {...newMe, profilePicture: imgFire},
          update: true
        })
        cached = (await fileCache(imgFire, realm)).path
      }
      else{
        const { profilePicture, ...userMe } = me;
        setFireUser({
          user: userMe,
          update: true
        })
      }
      realm.write(() => {
        const usr = realm.objectForPrimaryKey<UserType>('User', me.id || '');
        if(!usr) return;
        usr.profilePicture = cached;
        usr.name = newMe.name;
        usr.age = newMe.age;
        usr.name = newMe.name;
        usr.gender = newMe.gender;
        usr.bio = newMe.bio;
      })
    } catch (error) {
      alert('Erro ao atualizar perfil: ');
    } finally{
      navigation.push('/')
      alert('Perfil atualizado com sucesso!');
    }
  };

  const handleProfilePhotoPick = async () => {
    const result = await pick({
      propagate: false
    });
    if(result?.canceled || !result) return;
    const nsfw = await isNSFW(result.assets[0].uri)
    if (nsfw){
      Alert.alert('Alert', 'your image was detected as inappropriate for the application');
      return;
    }
    else{
      onSetterUser('profilePicture', result.assets[0].uri)
    }
  }

  return (
    <Main>
      <Head
        profile={newMe}
        onBackPress={()=>{}}
        onDonePress={()=>{}}
        onProfilePhotoPick={handleProfilePhotoPick}
      />
      <Back onPress={navigation.goBack}/>
      <Done onPress={onHandleDone}/>
      <EditorForm
        name={{ value: newMe.name, set: (v: any) => onSetterUser('name', v) }}
        age={{ value: newMe.age, set: (v: any) => onSetterUser('age', v) }}
        bio={{ value: newMe.bio, set: (v: any) => onSetterUser('bio', v) }}
        gender={{ value: newMe.gender, label: newMe.gender, set: (v: any) => onSetterUser('gender', v.label) }}
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
`