import styled from 'styled-components/native';
import analytics from '@react-native-firebase/analytics';

import ThemeProvider from '@providers/theme';
import NewChalk from '@components/common/NewChalk';
import SafeArea from '@components/common/SafeArea';
import Chats from '@components/pages/Home/Chats';
import Head from '@components/pages/Home/Head';
import useUser from '@src/hooks/useUser';
import useChats from '@src/hooks/useChats';
import getUser from '@src/services/firebase/get/user';

import localStorage from '@src/services/localStorage';

import realmContext from '@contexts/realm';
import UserType from '@src/types/user';
import { fileCache } from '@src/services/realm/fileCache';
import { defaultFirebaseProfilePicture } from '@src/utils/consts';

import { BannerAdSize, BannerAd } from 'react-native-google-mobile-ads';

import remoteConfig from '@react-native-firebase/remote-config';

import useRewardedInterstitialAd from '@src/hooks/useRewardedInterstitialAd';

function Home({ navigation }: any) {
  const { showAd } = useRewardedInterstitialAd('ca-app-pub-8514165585360004/4223286939');

  const chats = useChats();
  const me = useUser();

  const realm = realmContext.useRealm();

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
          const p = await fileCache(usr.profilePicture, realm, true);
          realm.write(() => {
            const realmUser = realm.objectForPrimaryKey<UserType>('User', id);
            if (!realmUser) return;
            realmUser.name = usr.name;
            realmUser.bio = usr.bio;
            realmUser.age = usr.age;
            realmUser.authenticated = usr.authenticated;
            realmUser.profilePicture = p.path || defaultFirebaseProfilePicture;
          });
        }}
      />
      <NewChalk
        onPress={async () => {
          const homeChalkBntAd = remoteConfig().getValue('HomeChalkBntAd');
          const matchingConfig = await localStorage('matchingConfig').get();
          const goTo = () => {
            analytics().logEvent('new_chalk_clicked', {
              uid: me?.id,
              gender: me?.gender,
              age: me?.age,
              matchingConfig,
            });
            navigation.navigate('/newChalk');
          };
          if (homeChalkBntAd.asBoolean()) {
            showAd({
              onLoad: goTo,
            });
          } else {
            goTo();
          }
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
