import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

const CLI_ID_GOOGLE =
  Platform.OS === 'ios'
    ? ''
    : '125453588649-njbndvlekf63ousqqiorgo4fqlrabiav.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId: CLI_ID_GOOGLE,
});
