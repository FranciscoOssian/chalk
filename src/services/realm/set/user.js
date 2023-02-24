import getUser from '../get/user';
import getRealm from '../index';

export default async function setUser(userData) {
  const realm = await getRealm();
  const prev = await getUser(userData?.id);
  let hasUser;
  if (!prev) hasUser = false;
  else hasUser = true;

  if (hasUser) {
    realm.write(() => {
      const user = realm.objectForPrimaryKey('User', userData?.id);
      user.name = userData?.name;
      user.age = userData?.age;
      user.bio = userData?.bio;
      user.profilePicture = userData?.profilePicture;
      user.authenticated = userData?.authenticated;
      user.gender = userData?.gender;
    });
  } else {
    realm.write(() => realm.create('User', userData));
  }
}
