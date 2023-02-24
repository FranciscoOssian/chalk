import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import styled from 'styled-components';

import defaultStorage from '../../../defaultStorage.json';
import ThemeProvider from '../../Providers/theme';
import BlockButtons from '../../components/common/BlockButtons';
import ButtonRow from '../../components/common/ButtonRow';
import ProfileHead from '../../components/common/ProfileHead';
import SafeArea from '../../components/common/SafeArea';
import useFriend from '../../hooks/useFriend';
import useUser from '../../hooks/useUser';
import delDataBase from '../../services/realm/del/database';
import { genders } from '../../utils/genders.json';
import { supportedLanguages, languages } from '../../utils/languages.json';
import { loadStorageFromJson } from '../../utils/loadStorageFromJson';

const defaultMatchConfig = {
  from: 18,
  to: 18,
  lang: 'en',
  genders: [],
};

async function get(id) {
  try {
    return JSON.parse(await AsyncStorage.getItem(id));
  } catch (e) {
    return null;
  }
}

function MyProfile({ navigation, route }) {
  const [appLanguage, setAppLanguage] = useState('');
  const [matchConfig, setMatchConfig] = useState(defaultMatchConfig);
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const { friend: userOfPage } = useFriend(route.params.id); //if its owner page, this dont care;
  const hiddenInMyPage = useMemo(() => user.id === userOfPage.id, [user, userOfPage]);
  const hiddenInFriendPage = useMemo(() => user.id !== userOfPage.id, [user, userOfPage]);
  const [firstLoad, setFirstLoad] = useState(true);

  const onHandleSetAppLanguage = async (v) => {
    setAppLanguage(v);
    await AsyncStorage.setItem('appLanguage', v);
    i18n.changeLanguage(v);
  };

  useEffect(() => {
    if (!firstLoad) {
      AsyncStorage.setItem('matchingConfig', JSON.stringify(matchConfig));
    } else setFirstLoad(false);
    //console.log(matchConfig, appLanguage);
  }, [matchConfig]);

  useEffect(() => {
    const run = async () => {
      const appLanguage = await AsyncStorage.getItem('appLanguage');
      const defaultAppLanguage = await AsyncStorage.getItem('defaultAppLanguage');

      const mc = await get('matchingConfig');
      const defaultMatchingConfig = await get('defaultMatchingConfig');

      console.log(appLanguage, defaultAppLanguage);

      setAppLanguage(appLanguage ?? defaultAppLanguage);
      setMatchConfig(mc ?? defaultMatchingConfig);
    };

    run();
  }, []);

  const exit = async () => {
    const keys = await AsyncStorage.getAllKeys();
    for (const key of keys) {
      AsyncStorage.removeItem(key);
    }
    loadStorageFromJson(defaultStorage);
    auth().signOut();
    delDataBase();
    navigation.push('/account/signin');
  };

  return (
    <Main showsVerticalScrollIndicator={false}>
      <ProfileHead
        isVerified={user.authenticated}
        profile={userOfPage}
        pic={userOfPage.profilePicture}
        onProfilePress={() => navigation.navigate('/image', { list: [userOfPage.profilePicture] })}
        onBackPress={() => navigation.goBack()}
      />

      <BlockButtons title={t('perfil config')} hidden={hiddenInFriendPage}>
        <ButtonRow
          title={t('Edit profile')}
          onPress={() => {
            return user.authenticated
              ? navigation.navigate('/account/editor')
              : Alert.alert('You only can edit your profile if is verified');
          }}
        />
        {!user.authenticated ? (
          <ButtonRow
            title={t('Verify your account')}
            onPress={() => navigation.navigate('/account/verify')}
          />
        ) : null}
      </BlockButtons>

      <BlockButtons title={t('match config')} hidden={hiddenInFriendPage}>
        <ButtonRow mode={{ type: 'accordion', height: 100 }} title="age">
          <Picker
            style={{ width: '100%', height: 50 }}
            selectedValue={matchConfig.from}
            onValueChange={(itemValue, _) => {
              const temp = { ...matchConfig };
              temp.from = itemValue;
              setMatchConfig(temp);
            }}>
            {Array(100)
              .fill(0)
              .map((_, i) => i)
              .map((i) => i + 17)
              .filter((i) => i <= matchConfig.to - 1)
              .map((i) => (
                <Picker.Item key={i + 1} label={`from ${i + 1}`} value={i + 1} />
              ))}
          </Picker>
          <Picker
            style={{ width: '100%', height: 50 }}
            selectedValue={matchConfig.to}
            onValueChange={(itemValue, _) => {
              const temp = { ...matchConfig };
              temp.to = itemValue;
              setMatchConfig(temp);
            }}>
            {Array(100)
              .fill(0)
              .map((_, i) => i)
              .filter((i) => i >= matchConfig.from - 1)
              .map((i) => (
                <Picker.Item key={i + 1} label={`${t('to')} ${i + 1}`} value={i + 1} />
              ))}
          </Picker>
        </ButtonRow>
        <ButtonRow mode={{ type: 'accordion', height: 50 }} title="gender">
          <Picker
            style={{ width: '100%', height: 50 }}
            selectedValue="genders"
            onValueChange={(itemValue, _) => {
              const temp = { ...matchConfig };
              const index = temp.genders.indexOf(itemValue);
              if (index !== -1) {
                temp.genders.splice(index, 1);
              } else temp.genders = [...temp.genders, itemValue];
              setMatchConfig(temp);
            }}>
            {[`${matchConfig.genders.map((i) => genders[i]).join('; ')}`, ...genders].map(
              (item, index) => (
                <Picker.Item
                  key={index - 1}
                  label={`${t(item)} - ${
                    matchConfig.genders.includes(index - 1) ? 'selected' : ''
                  }`}
                  value={index - 1}
                />
              )
            )}
          </Picker>
        </ButtonRow>
        <ButtonRow
          mode={{ type: 'accordion', height: 50 }}
          title={`${t('Match language')} (${t('current')} - ${matchConfig.lang})`}>
          <Picker
            style={{ width: '100%', height: 50 }}
            selectedValue={matchConfig.lang}
            onValueChange={(itemValue, _) => {
              const temp = { ...matchConfig };
              temp.lang = itemValue;
              setMatchConfig(temp);
            }}>
            {languages.map((l) => (
              <Picker.Item key={l.code} label={`${l.NATIVEname} - ${l.ENname}`} value={l.code} />
            ))}
          </Picker>
        </ButtonRow>
      </BlockButtons>

      <BlockButtons title={t('app config')} hidden={hiddenInFriendPage}>
        <ButtonRow
          mode={{ type: 'accordion', height: 50 }}
          title={`${t('App language')} (${t('current')} - ${appLanguage})`}>
          <Picker
            style={{ width: '100%', height: 50 }}
            selectedValue={appLanguage}
            onValueChange={(itemValue, _) => onHandleSetAppLanguage(itemValue)}>
            {supportedLanguages.map((l) => (
              <Picker.Item key={l} label={l} value={l} />
            ))}
          </Picker>
        </ButtonRow>
      </BlockButtons>

      <BlockButtons title={t('privacy')} hidden={hiddenInMyPage}>
        <ButtonRow title={t('Block this user')} onPress={() => {}} />
        <ButtonRow title={t('Report user')} onPress={() => {}} />
        <ButtonRow title={t('Terms and policies')} onPress={() => {}} />
      </BlockButtons>

      <BlockButtons title={t('Account')} hidden={hiddenInFriendPage}>
        <ButtonRow title={t('exit')} onPress={() => exit()} />
        <ButtonRow title={t('Delete account')} onPress={() => {}} />
      </BlockButtons>
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
  width: 95%;
`;
