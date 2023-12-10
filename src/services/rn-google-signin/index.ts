import { GoogleSignin, statusCodes, User } from '@react-native-google-signin/google-signin';
import './config';

const voidUser: User = {
  user: {
    id: '',
    name: null,
    email: '',
    photo: null,
    familyName: null,
    givenName: null,
  },
  idToken: null,
  serverAuthCode: null,
};

const signInWithGoogle = async (): Promise<User> => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo: User = await GoogleSignin.signIn();
    return userInfo;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    } else if (error.code === statusCodes.IN_PROGRESS) {
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    } else {
    }
    return voidUser;
  }
};

export const signIn = async (): Promise<User> => {
  await signOut()
  const userInfo = await signInWithGoogle();
  return userInfo;
};

export const signOut = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
  }
};

export const getCurrentUserofGoogleProvider = async (): Promise<User | null> => {
  try {
    return await GoogleSignin.getCurrentUser();
  } catch (error) {
    return null;
  }
};
