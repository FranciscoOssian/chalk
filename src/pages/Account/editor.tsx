import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import ThemeProvider from '@providers/theme';
import SafeArea from '@components/common/SafeArea';
import EditorForm from '@components/pages/Account/EditorForm';
import Head from '@components/pages/Account/HeadEditor';
import UserType from '@src/types/user';

import { defaultFirebaseProfilePicture } from '@utils/consts.ts';
import usePicker from '@src/hooks/usePicker';
import Snackbar from 'react-native-snackbar';
import useUser from '@hooks/useUser';

import setFireUser from '@services/firebase/set/user';
import setProfileImage from '@services/firebase/set/profileImage';

import { classifyImage } from '@src/services/chalkSystem';

import realmContext from '@contexts/realm';
import Done from '@src/components/pages/Account/Done';
import Back from '@src/components/common/Back';
import { matchingConfig as defaultMatchingConfig } from '@src/services/localStorage/defaults';

const isNSFW = async (uri: string): Promise<boolean | undefined> => {
  console.log(uri);
  const api_classes = await classifyImage(uri);

  if (api_classes.length === 0) return undefined;

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
    matchingConfig: defaultMatchingConfig,
  });

  const realm = realmContext.useRealm();

  const me = useUser();

  const { t: translation, i18n } = useTranslation();
  const t = (s: string) => translation<string>(s);

  useEffect(() => {
    if (!me) return;
    const { profilePicture, name, age, bio, gender, matchingConfig } = me;
    setNewMe({
      profilePicture,
      name,
      bio,
      age,
      gender,
      matchingConfig: {
        from: matchingConfig.from,
        to: matchingConfig.to,
        genders: matchingConfig.genders,
        lang: matchingConfig.lang,
      },
    } as UserType);
  }, [me]);

  const [_, pick] = usePicker({ base64: false });

  const onSetterUser = (prop: string, value: any) => {
    const temp: any = { ...newMe, [prop]: value };
    setNewMe(temp);
  };

  const onHandleDone = async () => {
    if (!me.id || newMe === me) return;
    let mePic = me.profilePicture;

    if (me.profilePicture !== newMe.profilePicture && newMe.profilePicture) {
      mePic = (await setProfileImage(me.id, newMe?.profilePicture ?? defaultFirebaseProfilePicture))
        .url;
    }

    const { profilePicture, ...userMe } = newMe;

    setFireUser({
      user: {
        ...userMe,
        profilePicture: mePic,
        matchingConfig: {
          from: me.matchingConfig.from,
          to: me.matchingConfig.to,
          genders: JSON.parse(JSON.stringify(me.matchingConfig.genders)),
          lang: me.matchingConfig.lang,
        },
      },
      update: true,
    });

    realm.write(() => {
      const usr = realm.objectForPrimaryKey<UserType>('User', me.id || '');
      if (!usr) return;
      usr.profilePicture = newMe.profilePicture;
      usr.name = newMe.name;
      usr.age = newMe.age;
      usr.name = newMe.name;
      usr.gender = newMe.gender;
      usr.bio = newMe.bio;
    });

    navigation.push('/');
    Snackbar.show({
      text: t('Profile updated successfully'),
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const handleProfilePhotoPick = async () => {
    const result = await pick({
      propagate: false,
    });
    if (result?.canceled || !result) return;
    const nsfw = await isNSFW(result.assets[0].uri);
    if (nsfw) {
      Snackbar.show({
        text: `${t('Alert')} - ${t(
          `your image was detected as inappropriate for the application`
        )} 🧐🤚📸`,
        duration: Snackbar.LENGTH_SHORT,
      });
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
