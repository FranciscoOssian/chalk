import getRealm from '../index';

export default async function delDataBase() {
  const realm = await getRealm();
  realm.write(() => {
    const arr = [
      realm.objects('Chat'),
      realm.objects('User'),
      realm.objects('Message'),
      realm.objects('ContentMessage'),
    ];
    for (const realmList of arr) {
      for (const realmObj of realmList) {
        realm.delete(realmObj);
      }
    }
  });
}
