import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import UserType from '@src/types/user';

interface Params {
  user: UserType
  update?: boolean
}

export default async function setUser({user, update}: Params): Promise<void> {

  const userRef = firestore().collection('Users').doc(
    auth().currentUser?.uid || ''
  );

  if(update) return userRef?.update(user);

  return userRef?.set({
    profilePicture: user?.profilePicture ?? '',
    name: user?.name ?? '',
    age: user?.age ?? 0,
    bio: user?.bio ?? '',
    authenticated: user?.authenticated ?? false,
  });

}
