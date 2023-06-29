import firestore from '@react-native-firebase/firestore';

export default async function setFriends(id: string, friends: string[]) {
  try {
    const friendsRef = firestore()
      .collection('Users')
      .doc(id)
      .collection('Friends')
      .doc('friends');

    await friendsRef.set({ friends });
  } catch (error) {
    throw error;
  }
}
