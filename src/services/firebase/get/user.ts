import firestore from '@react-native-firebase/firestore';
import UserType from '@src/types/user';

export default async function getUser(id: string) {
  try {
    const documentSnapshot = await firestore().collection('Users').doc(id).get();

    if (documentSnapshot.exists) {
      return documentSnapshot.data() as UserType;
    } else {
      return undefined;
    }
  } catch (error) {
    throw error;
  }
}
