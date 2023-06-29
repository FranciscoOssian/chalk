import storage from '@react-native-firebase/storage';

export default async function setProfileImage(id: string, uri: string) {
  const reference = storage().ref(`/users/${id}/profilePicture.jpg`);
  await reference.putFile(uri);
  return {
    name: reference.name,
    url: await reference.getDownloadURL(),
  };
}
