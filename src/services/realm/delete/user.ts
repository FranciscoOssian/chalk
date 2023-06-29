export default function deleteUser(id: string, realm: Realm) {
    if(!id) return;
    try {
        realm.write(() => {
        const user = realm.objectForPrimaryKey('User', id);
        if (user) {
            realm.delete(user);
        } else {
        }
        });
    } catch (error) {
        throw error;
    }
}
