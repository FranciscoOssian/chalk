import getRealm from '../index';

export default async function getChatListinerChanges(callback) {
  const realm = await getRealm();
  const chats = realm.objects('Chat');
  try {
    chats.addListener((chats, changes) => callback(chats, changes));
  } catch (error) {
    console.error(`An exception was thrown within the change listener: ${error}`);
  }

  return () => chats.removeListener((chats, changes) => callback(chats, changes));
}
