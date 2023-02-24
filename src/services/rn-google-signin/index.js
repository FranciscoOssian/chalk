import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import './config';

const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('user cancelled the login flow');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('operation (e.g. sign in) is in progress already');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('play services not available or outdated');
    } else {
      console.log(error);
      console.log('some other error happened');
    }
  }
};

export const signIn = async () => {
  const userInfo = await signInWithGoogle();
  return userInfo;
};

export const signOut = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUserofGooglePrivider = async () => {
  try {
    return await GoogleSignin.getCurrentUser();
  } catch (error) {
    return { error };
  }
};
