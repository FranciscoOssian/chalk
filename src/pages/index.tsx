import styled from 'styled-components/native';

import ThemeProvider from '@providers/theme';
import NewChalk from '@components/common/NewChalk';
import SafeArea from '@components/common/SafeArea';
import Chats from '@components/pages/Home/Chats';
import Head from '@components/pages/Home/Head';
import useUser from '@src/hooks/useUser';
import useChats from '@src/hooks/useChats';
import getUser from '@src/services/firebase/get/user';

import realmContext from '@contexts/realm';
import UserType from '@src/types/user';
import { fileCache } from '@src/services/realm/fileCache';
import { defaultFirebaseProfilePicture } from '@src/utils/consts';

import { BannerAdSize,  BannerAd} from 'react-native-google-mobile-ads';

import remoteConfig from '@react-native-firebase/remote-config';

import useRewardedInterstitialAd from '@src/hooks/useRewardedInterstitialAd';
import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import useFirstTimeCheck from '@src/hooks/useFirstTimeCheck';
import { defaultAppLanguage } from '@utils/defaultStorage.ts';

function Home({ navigation }: any) {

  const {showAd} = useRewardedInterstitialAd('ca-app-pub-8514165585360004/4223286939')

  const chats = useChats();
  const me = useUser();

  const realm = realmContext.useRealm();

  const { t: translation, i18n, ready } = useTranslation();
  const t = (s: string) => translation<string>(s);

  const firstTimeOpen = useFirstTimeCheck('OpenApp');

  useEffect(()=>{
    console.log(ready)
    if(!ready) return
    if(!firstTimeOpen) return
    i18n.changeLanguage(defaultAppLanguage)
    .then( () => {
      const buttons = [
        {
          text: t("Send feedback - Google Play"),
          onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.foln.chalk'),
        },
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ];
      
      if (remoteConfig().getValue('showTiktokInWelCome').asBoolean()) {
        buttons.splice(1, 0, {
          text: t("Visit us on TikTok"),
          onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.foln.chalk'),
        });
      }
      Alert.alert(
        t('welcomeMessageTitle'),
        t('welcomeMessageBody'),
        buttons
      );
    } )
  }, [firstTimeOpen])

  return (
    <Main>
      <Head
        pic={me?.profilePicture}
        onProfilePress={() => navigation.navigate('/account', { id: me?.id })}
      />
      <Chats
        list={chats} 
        me={me}
        callbackToFetchAndSave={async (id) => {
          const usr = await getUser(id);
          if(!usr) return
          const p = await fileCache(usr.profilePicture, realm, true);
          realm.write( () => {
            const realmUser = realm.objectForPrimaryKey<UserType>('User', id)
            if(!realmUser) return
            realmUser.name = usr.name;
            realmUser.bio = usr.bio;
            realmUser.age = usr.age;
            realmUser.authenticated = usr.authenticated;
            realmUser.profilePicture = p.path || defaultFirebaseProfilePicture;
          } )
        }}
      />
      <NewChalk onPress={async () => {
        const homeChalkBntAd = remoteConfig().getValue('HomeChalkBntAd');
        if(homeChalkBntAd.asBoolean()){
          showAd({
            onLoad: () => navigation.navigate('/newChalk')
          });
        }
        else{
          navigation.navigate('/newChalk');
        }
      }}/>
      <BannerAd
        unitId={'ca-app-pub-8514165585360004/4596173094'}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </Main>
  );
}

export default function (props: any) {
  return (
    <SafeArea>
      <ThemeProvider>
        <Home {...props} />
      </ThemeProvider>
    </SafeArea>
  );
}

const Main = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 95%;
`;
