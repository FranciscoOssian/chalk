import firestore from '@react-native-firebase/firestore';

export default async function getBlockedUsers(id: string) {
  try {
    const documentSnapshot =
        await firestore()
        .collection('Users')
        .doc(id)
        .collection('Blocked')
        .doc('blocked')
        .get();

    if (documentSnapshot.exists) {
      return (documentSnapshot.data() as any).users;
    } else {
      return undefined;
    }
  } catch (error) {
    throw error;
  }
}
