import getRealm from '../index';

export default async function getUser(id) {
  const realm = await getRealm();
  const user = await realm.objects('User').filtered(`id == '${id}'`)[0];
  return user;
}
