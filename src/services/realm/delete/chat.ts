export default function deleteChat (id: string, realm: Realm) {
    try{
      realm.write(() => {
        const chat = realm.objectForPrimaryKey('Chat', id);
        if (chat) {
          realm.delete(chat);
        } else {
        }
      });
    }
    catch(e){}
}