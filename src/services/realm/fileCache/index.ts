import * as FileSystem from 'expo-file-system';
import CalcSha256 from '@src/utils/sha256';

interface SetResponseTypes {
  path: string;
}

export const setFileCache = async (uri: string, realm: any): Promise<SetResponseTypes> => {
  const sha256 = await CalcSha256(uri);

  const existingFile = realm.objects('File').filtered(`sha256 = "${sha256}"`)[0];
  if (existingFile) {
    return {
      path: existingFile.destination,
    };
  }

  const destination = `${FileSystem.documentDirectory}/${sha256}`;
  await FileSystem.downloadAsync(uri, destination);
  realm.write(() => {
    realm.create('File', { sha256, origin: uri, destination });
  });
  return {
    path: destination,
  };
};

export const fileCache = async (uri: string | null | undefined = null, realm: any, refresh: boolean = false): Promise<{path: string | null}> => {
  if(!uri) return {path: null}
  
  if(!uri.includes('http')){
    return {
      path: realm.objects('File').filtered(`destination == "${uri}"`)[0].origin
    }
  }
  
  const sha256 = CalcSha256(uri);
  const file = realm.objects('File').filtered(`sha256 = "${sha256}"`)[0];

  if(!file){
    return setFileCache(uri, realm);
  }
  else{
    if(refresh){
      const deletionSuccess = await deleteFile(file.destination);
      if (deletionSuccess) {
        return setFileCache(uri, realm);
      }
    }
    else return {path: file.destination};
  }
}

export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    await FileSystem.deleteAsync(filePath, { idempotent: true });
    return true;
  } catch (error) {
    console.error("Failed to delete the file. Error:", error);
    return false;
  }
};