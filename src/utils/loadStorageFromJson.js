import AsyncStorage from '@react-native-async-storage/async-storage';

export const sett = async function (label, value) {
  try {
    await AsyncStorage.getItem(label);
  } catch (e) {
    await AsyncStorage.setItem(label, JSON.stringify(value));
  }
};

export const loadStorageFromJson = async (json) => {
  for (const [key, value] of Object.entries(json)) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
};
