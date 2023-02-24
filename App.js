// eslint-disable-next-line import/order
//import { useFonts } from 'expo-font';

//import * as SplashScreen from 'expo-splash-screen';
//import { SafeAreaView } from 'react-native-safe-area-context';

import { getLocales } from 'expo-localization';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { defaultMatchingConfig } from './defaultStorage.json';
import Routes from './src/Routes';
import i18n from './src/services/i18n';
import { registerForPushNotificationsAsync } from './src/services/notifications';
import { startBackgroundFetchMessages } from './src/utils/backgroundTaskMessages';
import { listinerFireMessagesStoreAndNotify } from './src/utils/listinerFireMessagesStoreAndNotify';
import { loadStorageFromJson } from './src/utils/loadStorageFromJson';

const deviceLanguage = getLocales()[0].languageTag;

loadStorageFromJson({
  defaultMatchingConfig: {
    ...defaultMatchingConfig,
    lang: deviceLanguage,
  },
  defaultAppLanguage: deviceLanguage,
});

i18n();
registerForPushNotificationsAsync();
listinerFireMessagesStoreAndNotify();
startBackgroundFetchMessages(); //pause when not in background

export default function App() {
  //useFonts(theme.fonts);
  usePreventScreenCapture();

  return (
    <>
      <StatusBar />
      <Routes />
    </>
  );
}
