import getRealm from '../index';

export default async function getChats() {
  const realm = await getRealm();
  const chats = await realm.objects('Chat');
  return chats;
}
