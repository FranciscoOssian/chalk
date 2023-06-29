import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useFirstTimeCheck = (id: string) => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | undefined>(undefined);

  const checkFirstTime = async () => {
    try {
      const value = await AsyncStorage.getItem(`@first_time/${id}`);
      if (value === null) {
        await AsyncStorage.setItem(`@first_time/${id}`, 'done');
        setIsFirstTime(true);
      } else {
        setIsFirstTime(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkFirstTime();
  }, []);

  return isFirstTime;
};

export default useFirstTimeCheck;
