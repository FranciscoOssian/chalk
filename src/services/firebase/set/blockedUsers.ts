import firestore from '@react-native-firebase/firestore';

export default async function setBlockedUsers(id: string, users: string[]) {
  try {
    const blockRef = firestore()
      .collection('Users')
      .doc(id)
      .collection('Blocked')
      .doc('blocked');

    const oldListData = await blockRef.get();
    let oldList = [];
    if (oldListData.exists && oldListData.data()) {
      oldList = oldListData.data()?.users;
    }

    const updatedList = new Set([...oldList, ...users]);

    const uniqueUsers = Array.from(updatedList);

    await blockRef.set({ users: uniqueUsers });
  } catch (error) {
    throw error;
  }
}
