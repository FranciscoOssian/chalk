import AsyncStorage from "@react-native-async-storage/async-storage";

export const storageExtended = (tag: string) => {
    const set = async (value: any) => AsyncStorage.setItem(tag, JSON.stringify(value))
    const get = async () => {
        const value = await AsyncStorage.getItem(tag);
        if (!value) return null;
        let resp: any = value;
        try{
            resp = JSON.parse(value);
        }
        catch(e){}
        return resp;
    }
    return {
        set, get
    }
}