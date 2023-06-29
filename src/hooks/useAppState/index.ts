import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const useAppState = (): boolean => {
  const [appStateVisible, setAppStateVisible] = useState<boolean>(AppState.currentState === 'active');

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppStateVisible(nextAppState === 'active');
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  return appStateVisible;
};

export default useAppState;
