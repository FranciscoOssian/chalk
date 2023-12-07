export default function deleteEntireDatabase(realm: Realm) {
  try {
    realm.write(() => {
      realm.deleteAll();
    });
  } catch (e) {
    console.error('Erro ao excluir a base de dados do Realm:', e);
  }
}
