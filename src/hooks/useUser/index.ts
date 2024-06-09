import { useEffect, useState } from 'react';
import realmContext from '@contexts/realm';
import UserType from '@src/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom hook to fetch user information from RealmDB (User Or Friend)
 * @param {string} [priorityUserId] - (Optional) The ID of the user with priority. If provided, it will be used instead of the value stored in the state obtained from AsyncStorage.
 * @returns {UserType | undefined} - The user information corresponding to the provided ID.
 */
const useUser = (priorityUserId?: string) => {
  const [id, setId] = useState<string | undefined>(priorityUserId);
  const users = realmContext.useQuery<UserType>('User').filtered(`id == '${id}'`);

  useEffect(() => {
    if (!priorityUserId) {
      AsyncStorage.getItem('my-uid').then((id) => {
        setId(`${id}`);
      });
    }
  }, []);

  return users[0];
};

export default useUser;
