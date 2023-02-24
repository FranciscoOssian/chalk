import firestore from '@react-native-firebase/firestore';

export default async function getUser(id) {
  return (await firestore().collection('Users').doc(id).get()).data();
}
