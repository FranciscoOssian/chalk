import firestore from '@react-native-firebase/firestore';

export default async function updateFriends(id: string | undefined = undefined, newFriends: (string | undefined)[]) {
  if (!id) return;
  if (newFriends.length === 0) return;

  const friends = newFriends.filter(f => f !== undefined && f !== null);

  try {
    const friendsRef = firestore()
      .collection('Users')
      .doc(id)
      .collection('Friends')
      .doc('friends');

    const friendsDoc = await friendsRef.get();

    if (friendsDoc.exists) {
      await friendsRef.update({
        friends: firestore.FieldValue.arrayUnion(...friends),
      });
    } else {
      await friendsRef.set({
        friends,
      });
    }
  } catch (error) {
    throw error;
  }
}
