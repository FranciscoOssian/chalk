import { registerRootComponent } from 'expo';
import App from './App';
import remoteConfig from '@react-native-firebase/remote-config';
import mobileAds from 'react-native-google-mobile-ads';
import i18n from '@src/services/i18n';
import auth from '@react-native-firebase/auth';
import isAdm from '@src/services/firebase/get/isAdmin';
import localStorage from '@src/services/localStorage';
import { registerForPushNotificationsAsync } from '@src/services/notifications';

import '@react-native-firebase/analytics';

remoteConfig()
  .setDefaults({
    HomeChalkBntAd: false,
    nsfwDetectorPassword: 'empty',
    showTiktokInWelCome: false,
  })
  .then(() => remoteConfig().fetchAndActivate());

mobileAds().initialize();
i18n();

registerForPushNotificationsAsync();

auth().onAuthStateChanged(async (user) => {
  if (user) {
    const isAdmin = await isAdm();
    if (isAdmin) {
      await localStorage('isAdm').set(true);
    }
  } else {
    await localStorage('isAdm').set(false);
  }
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
