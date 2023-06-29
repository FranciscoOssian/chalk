import { useEffect, useState } from 'react';
import { storageExtended } from '@src/utils/storageExtended';
import MatchConfigType from '@src/types/matchConfig';
import { defaultMatchingConfig } from '@src/utils/defaultStorage';

type ReturnType = [MatchConfigType, (config: MatchConfigType) => void]

const useMatchConfig = (): ReturnType => {
    const [matchConfig, setMatchConfig] = useState<MatchConfigType>({
        from: 18,
        to: 18,
        lang: '',
        genders: [],
    });

    useEffect( () => {
        (async ()=>{
            const mc = await storageExtended('matchConfig').get()
            const dmc = defaultMatchingConfig
            if(mc) setMatchConfig(mc)
            else setMatchConfig(dmc)
        })()
    }, [] )

    const setMatchConfigHandler = (config: MatchConfigType) => {
        storageExtended('matchConfig').set(config);
        setMatchConfig(config);
    }

    return [matchConfig, setMatchConfigHandler]
};

export default useMatchConfig;
