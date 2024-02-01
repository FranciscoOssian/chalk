import firestore from '@react-native-firebase/firestore';

export default async function delUser(id: string) {
  try {
    await firestore().collection('Users').doc(id).delete();
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
