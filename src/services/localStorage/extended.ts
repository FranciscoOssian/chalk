import AsyncStorage from '@react-native-async-storage/async-storage';

import defaultList from './defaults';

export const storageExtended = (tag: string) => {
  const d = defaultList.find((e) => e[0] === tag);
  const defaultValue = d ? d[1] : null;
  const set = async (value: any) => AsyncStorage.setItem(tag, JSON.stringify(value));
  const get = async () => {
    const value = await AsyncStorage.getItem(tag);
    if (!value) return defaultValue;
    let resp: any = value;
    try {
      resp = JSON.parse(value);
    } catch (e) {}
    return resp;
  };
  return {
    set,
    get,
    defaultValue,
  };
};
