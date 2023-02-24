import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default async function setUser(user, update) {
  return update === 'update'
    ? firestore().collection('Users').doc(auth().currentUser.uid).update(user)
    : firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .set({
          profilePicture: user?.profilePicture ?? '',
          name: user?.name ?? '',
          age: user?.age ?? '',
          bio: user?.bio ?? '',
          authenticated: user?.authenticated ?? '',
        });
}
