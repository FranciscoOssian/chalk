import getRealm from '../index';

export default async function createChat(chatData) {
  const realm = await getRealm();
  const prev = realm.objectForPrimaryKey('Chat', chatData?.id);
  let hasChat;
  if (!prev) hasChat = false;
  else hasChat = true;

  if (hasChat) return prev;
  else realm.write(() => realm.create('Chat', chatData));
}
