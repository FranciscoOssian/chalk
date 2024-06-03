import MatchConfigType from '@src/types/matchConfig';
import { useCallback } from 'react';
import realmContext from '@contexts/realm';
import useUser from '../useUser';
import updateRealmMatchConfig from '@src/services/realm/update/matchConfig';
import { matchingConfig } from '@src/services/localStorage/defaults';

const useMatchConfig = () => {
  const realm = realmContext.useRealm();
  const me = useUser();

  const state = realmContext
    .useQuery<MatchConfigType>('MatchingConfig')
    .filtered(`id == '${me?.id}'`)[0];

  const change = useCallback(
    (value: MatchConfigType) => {
      updateRealmMatchConfig(realm, { id: me.id, ...value });
    },
    [me]
  );

  return { matchConfig: state ?? matchingConfig, setMatchConfig: change };
};

export default useMatchConfig;
