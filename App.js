import React, { useEffect } from 'react';
import PushNotification from "react-native-push-notification";
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';

import Routes from './src/Routes'

import Core from './src/services/core'
import { LocalUserProvider, useLocalUser } from './src/Hooks/localDatabase/user'
import useAuth from './src/Hooks/Firebase/useAuth'
import myDebug from './src/utils/debug'

const debug = (...p) => myDebug('./App.js', p)
const core = new Core()

const Wrapper = ({ children }) => {
  const { update } = useLocalUser()
  const { user: userAuth, isSignedIn } = useAuth()
  useEffect(() => {
    const run = async () => {
      const resp = await core.localDB.get.myUser()
      if (resp) update(resp)
    }
    run()
  }, [userAuth, isSignedIn])
  return <>{children}</>
}

const App = () => {

  useEffect(() => {

    PushNotification.configure({
      onRegister: function (token) {
        debug(`TOKEN:${token}`);
      },
      onNotification: function (notification) {
        debug(`NOTIFICATION:${notification}`);
        //notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    })

    PushNotification.createChannel(
      {
        channelId: "messages", // (required)
        channelName: "messages", // (required)
        channelDescription: "A channel to categorise messages received", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    )



  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor="#ffff" />
      <LocalUserProvider>
        <Wrapper>
          <Routes />
        </Wrapper>
      </LocalUserProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;