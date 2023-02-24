import firestore from '@react-native-firebase/firestore';

export default async function getFriends(id) {
  const friendsSnapShot = await firestore()
    .collection('Users')
    .doc(`${id}`)
    .collection('friends')
    .doc('friends')
    .get();
  if (!friendsSnapShot.exists) return [];

  return (await friendsSnapShot.data()).friends ?? [];
}
