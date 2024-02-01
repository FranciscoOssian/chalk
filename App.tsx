import { StatusBar } from 'expo-status-bar';
import realmContext from '@contexts/realm';
import Routes from '@src/Routes';

import { usePreventScreenCapture } from 'expo-screen-capture';
import {
  cleanNotificationsCache,
  getFireMessagesAndStore,
  startBackgroundFetchMessages,
} from '@src/utils/backgroundTaskMessages';
import useAppState from '@src/hooks/useAppState';
import { useNetInfo } from '@react-native-community/netinfo';

import { View, Text } from 'react-native';

const { RealmProvider } = realmContext;

function App() {
  return (
    <>
      <StatusBar />
      <Routes />
    </>
  );
}

startBackgroundFetchMessages();
getFireMessagesAndStore();

function AppWrapper() {
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

  if (!RealmProvider) {
    return null;
  }

  return (
    <RealmProvider>
      <App />
    </RealmProvider>
  );
}

export default AppWrapper;
