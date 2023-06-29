import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function exit() {
  const keys = await AsyncStorage.getAllKeys();
  for (const key of keys) {
    AsyncStorage.removeItem(key);
  }
  //loadStorageFromJson(defaultStorage);
  //auth().signOut();
  //delDataBase();
};
