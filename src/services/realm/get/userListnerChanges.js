import getUser from './user';

export default async function getUserListinerChanges(id, callback) {
  if (!id) return;
  const user = await getUser(id);
  if (!user) return;
  try {
    user.addListener((user, changes) => callback(user, changes));
  } catch (error) {
    console.error(`An exception was thrown within the change listener: ${error}`);
  }

  return () => user.removeListener((user, changes) => callback(user, changes));
}
