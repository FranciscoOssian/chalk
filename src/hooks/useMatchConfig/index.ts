import { useEffect, useState } from 'react';
import MatchConfigType from '@src/types/matchConfig';
import localStorage from '@src/services/localStorage';

type ReturnType = [MatchConfigType, (config: MatchConfigType) => void];

const useMatchConfig = (): ReturnType => {
  const [matchConfig, setMatchConfig] = useState<MatchConfigType>({
    from: 18,
    to: 18,
    lang: '',
    genders: [],
  });

  useEffect(() => {
    (async () => {
      const mc = await localStorage('matchingConfig').get();
      setMatchConfig(mc);
    })();
  }, []);

  const setMatchConfigHandler = (config: MatchConfigType) => {
    localStorage('matchingConfig').set(config);
    setMatchConfig(config);
  };

  return [matchConfig, setMatchConfigHandler];
};

export default useMatchConfig;
