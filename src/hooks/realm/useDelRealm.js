import { useRealm } from '@realm/react';
import { useState } from 'react';

export default function useDeleteDatabase() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const realm = useRealm();

  async function deleteDatabase() {
    setIsDeleting(true);
    try {
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
      setIsDeleted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return { isDeleting, isDeleted, deleteDatabase };
}
