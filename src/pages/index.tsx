import styled from 'styled-components/native';

import ThemeProvider from '@providers/theme';
import SafeArea from '@components/common/SafeArea';
import Chats from '@components/pages/Home/Chats';
import Head from '@components/pages/Home/Head';
import useUser from '@src/hooks/useUser';
import useChats from '@src/hooks/useChats';
import getUser from '@src/services/firebase/get/user';

import realmContext from '@contexts/realm';
import UserType from '@src/types/user';
import { defaultFirebaseProfilePicture } from '@src/utils/consts';

import { BannerAdSize, BannerAd } from 'react-native-google-mobile-ads';

//import analytics from '@react-native-firebase/analytics';
import NewChalk from '@components/common/NewChalk';
import ChalkModal from '@components/pages/Home/NewChalk';
//import remoteConfig from '@react-native-firebase/remote-config';
//import useRewardedInterstitialAd from '@src/hooks/useRewardedInterstitialAd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { match } from '@src/services/chalkSystem';
import updateFriends from '@src/services/firebase/update/friends';
import createNotification from '@src/services/firebase/create/notification';
import createRealmUser from '@src/services/realm/create/user';
import { io } from 'socket.io-client';
import useMatchConfig from '@src/hooks/useMatchConfig';

let onSearch = false;

function Home({ navigation }: any) {
  //const { showAd } = useRewardedInterstitialAd('ca-app-pub-8514165585360004/4223286939');
  const [isModalVisible, setModalVisible] = useState(false);
  const chats = useChats();
  const me = useUser();
  const [searchFunction, setSearchFunction] = useState<number>(0);

  const realm = realmContext.useRealm();

  const { t: translation, i18n } = useTranslation();
  const t = (s: string) => translation<string>(s);

  const { matchConfig } = useMatchConfig();

  const search = async () => {
    console.log('go');
    if (!me) return;
    console.log(me.id);
    let friend: UserType = await match(realm, me).request();
    while ((friend.id === me.id || realm.objectForPrimaryKey('User', friend.id)) && onSearch) {
      console.log('reloading');
      await new Promise((resolve) => setTimeout(resolve, 8000));
      friend = await match(realm, me).request();
    }
    if (!onSearch) return;
    const chatId = [me.id, friend.id].sort().join('-');
    console.log(chatId);
    const friendRealm = await createRealmUser(realm, friend);
    console.log(friendRealm);
    realm.write(() => {
      realm.create('Chat', {
        id: chatId,
        owners: [
          realm.objectForPrimaryKey<UserType>('User', `${me.id}`),
          realm.objectForPrimaryKey<UserType>('User', `${friend.id}`),
        ],
        messages: [],
      });
    });
    createNotification(friend.id).send({ type: 'new_chat' } as never);
    updateFriends(me.id, [friend.id]);
    setModalVisible(false);
    navigation.navigate('/chat', { id: friend.id });
  };

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
          if (!usr) return;
          realm.write(() => {
            const realmUser = realm.objectForPrimaryKey<UserType>('User', id);
            if (!realmUser) return;
            realmUser.name = usr.name;
            realmUser.bio = usr.bio;
            realmUser.age = usr.age;
            realmUser.authenticated = usr.authenticated;
            realmUser.profilePicture = usr.profilePicture || defaultFirebaseProfilePicture;
          });
        }}
      />

      <ChalkModal
        text={t('searching...')}
        visible={isModalVisible}
        toggleModal={() => {
          //clearTimeout(searchFunction);
          setModalVisible(!isModalVisible);
          onSearch = false;
        }}
      />

      <NewChalk
        onPress={async () => {
          //const homeChalkBntAd = remoteConfig().getValue('HomeChalkBntAd');
          //const matchingConfig = await localStorage('matchingConfig').get();
          /*analytics().logEvent('new_chalk_clicked', {
              uid: me?.id,
              gender: me?.gender,
              age: me?.age,
              matchingConfig,
            });*/

          setModalVisible(true);
          //setSearchFunction(setInterval(search, 1000));
          onSearch = true;
          search();

          /*if (homeChalkBntAd.asBoolean()) {
            showAd({
              onLoad: goTo,
            });
          } else {
            goTo();
          }*/
        }}
      />

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
