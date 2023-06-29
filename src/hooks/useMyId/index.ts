import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom hook to fetch the current user ID from AsyncStorage.
 * @returns {string | null} - The user ID stored in AsyncStorage, or null if it is not available.
 */
const useMyId = () => {
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("my-uid").then(id => {
      setMyId(id);
    });
  }, []);

  return myId;
};

export default useMyId;
