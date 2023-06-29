import Realm from 'realm';
import schemas from './schemas';

let realmInstance: Realm;

export default async function getRealmInstance() {
  if (realmInstance) return realmInstance;

  const config = {
    schema: schemas,
  };
  realmInstance = await Realm.open(config);
  return realmInstance;
}
