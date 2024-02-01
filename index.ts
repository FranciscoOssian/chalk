import { registerRootComponent } from 'expo';

import App from './App';

import remoteConfig from '@react-native-firebase/remote-config';
import mobileAds from 'react-native-google-mobile-ads';
import i18n from '@src/services/i18n';

remoteConfig()
  .setDefaults({
    HomeChalkBntAd: false,
    nsfwDetectorPassword: 'empty',
    showTiktokInWelCome: false,
  })
  .then(() => remoteConfig().fetchAndActivate());

mobileAds().initialize();
i18n();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
