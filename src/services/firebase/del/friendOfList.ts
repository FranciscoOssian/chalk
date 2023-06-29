import firestore from '@react-native-firebase/firestore';

export default async function removeFriendOfList(userId: string, friendId: string) {
  try {
    const friendRef = firestore()
      .collection('Users')
      .doc(userId)
      .collection('Friends')
      .doc('friends');

    const oldListData = await friendRef.get();
    if (oldListData.exists) {
      const oldList = oldListData.data()?.friends;
      if (!oldList) {
        return;
      }

      const newList = oldList.filter(friend => friend !== friendId);

      await friendRef.update({ friends: newList });
    } else {
    }
  } catch (error) {
    throw error;
  }
}
