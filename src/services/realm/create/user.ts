import { matchingConfig } from '@src/services/localStorage/defaults';
import UserType from '@src/types/user';
import { defaultFirebaseProfilePicture } from '@src/utils/consts';
import MatchConfigType from '@src/types/matchConfig';

export default async function createRealmUser(realm: Realm, user: UserType) {
  if (!user) return;

  const prev = realm.objectForPrimaryKey<UserType>('User', user.id);
  if (prev) return prev;

  const matchingConfigObj = {
    id: user.id,
    ...(user.matchingConfig || matchingConfig),
  };

  const obj = {
    id: user.id,
    name: user?.name || '',
    age: user?.age || 18,
    bio: user?.bio || '<bio>',
    profilePicture: user?.profilePicture || defaultFirebaseProfilePicture,
    gender: user?.gender || 'Prefer not to state',
    authenticated: user?.authenticated || false,
  };

  realm.write(() => {
    realm.create('MatchingConfig', matchingConfigObj);
    realm.create('User', {
      ...obj,
      matchingConfig: realm.objectForPrimaryKey<MatchConfigType>('MatchingConfig', obj.id),
    });

    return;
  });
}
