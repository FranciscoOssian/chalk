import MatchConfigType from '@src/types/matchConfig';
import UserType from '@src/types/user';

export default async function updateRealmUser(realm: Realm, user: UserType) {
  if (!user) return;

  const realmUser = realm.objectForPrimaryKey<UserType>('User', user.id);
  const realmUserMatchConfig = realm.objectForPrimaryKey<MatchConfigType>(
    'MatchingConfig',
    user.id
  );

  console.log(realmUser);

  if (!realmUser || !realmUserMatchConfig) return;

  realm.write(() => {
    if (!realmUser) return;

    if (user.age) realmUser.age = user.age;
    if (user.authenticated) realmUser.authenticated = user.authenticated;
    if (user.bio) realmUser.bio = user.bio;
    if (user.gender) realmUser.gender = user.gender;
    if (user.profilePicture) realmUser.profilePicture = user.profilePicture;

    if (user.matchingConfig) realmUserMatchConfig.from = user.matchingConfig.from;
    if (user.matchingConfig) realmUserMatchConfig.to = user.matchingConfig.to;
    if (user.matchingConfig) realmUserMatchConfig.lang = user.matchingConfig.lang;
    if (user.matchingConfig) realmUserMatchConfig.genders = user.matchingConfig.genders;
  });
}
