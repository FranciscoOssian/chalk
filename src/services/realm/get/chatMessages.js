import getRealm from '../index';

export default async function getChatMessages(chatName) {
  const realm = await getRealm();
  const chat = realm.objects('Chat').filtered(`id == '${chatName}'`)[0];
  return chat.messages ?? [];
}
