import React, { useEffect, useState, useRef } from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import realmContext from '@contexts/realm';
import Routes from '@src/Routes';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { usePreventScreenCapture } from 'expo-screen-capture';
import {
  cleanNotificationsCache,
  getFireMessagesAndStore,
  startBackgroundFetchMessages,
} from '@src/utils/backgroundTaskMessages';
import useAppState from '@src/hooks/useAppState';
import { useNetInfo } from '@react-native-community/netinfo';
import LottieView from 'lottie-react-native';

const { RealmProvider } = realmContext;

function App() {
  return (
    <>
      <StatusBar />
      <Routes />
    </>
  );
}

function SplashScreenComp() {
  const animation = useRef(null);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: 'transparent',
        }}
        source={require('./assets/animation-loading.json')}
      />
    </View>
  );
}

startBackgroundFetchMessages();
getFireMessagesAndStore({
  enableCurrentFriendNotification: false,
});

function AppWrapper() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);
        await new Promise((resolve) => setTimeout(resolve, 4000));
      } catch (e) {
        console.warn(e);
      } finally {
        if (RealmProvider) setAppIsReady(true);
      }
    }

    prepare();
  }, [RealmProvider]);

  useEffect(() => {
    async function hideSplashScreen() {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
    }

    hideSplashScreen();
  }, [appIsReady]);

  usePreventScreenCapture();
  const netInfo = useNetInfo();
  const isForeGround = useAppState();

  if (netInfo.isConnected === false) {
    return (
      <View>
        <Text>No internet connection. Please check your connection and try again.</Text>
      </View>
    );
  }

  if (isForeGround) {
    cleanNotificationsCache();
  }

  return <RealmProvider>{!appIsReady ? <SplashScreenComp /> : <App />}</RealmProvider>;
}

export default AppWrapper;
