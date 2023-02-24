import firestore from '@react-native-firebase/firestore';

export default async function delUser(id) {
  return firestore().collection('Users').doc(id).delete();
}
