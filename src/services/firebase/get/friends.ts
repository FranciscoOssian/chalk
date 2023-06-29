import firestore from '@react-native-firebase/firestore';

export default async function getFriends(id: string) {
  try {
    const documentSnapshot =
        await firestore()
        .collection('Users')
        .doc(id)
        .collection('Friends')
        .doc('friends')
        .get();

    if (documentSnapshot.exists) {
      return (documentSnapshot.data() as any).friends;
    } else {
      return undefined;
    }
  } catch (error) {
    throw error;
  }
}
