import UserType from '@src/types/user';
import * as FileSystem from 'expo-file-system';
import Snackbar from 'react-native-snackbar';
import { io } from 'socket.io-client';
import { defaultFirebaseProfilePicture } from '@src/utils/consts';

export const classifyImage = async (
  uri: string
): Promise<{ className: string; probability: number }[]> => {
  try {
    const response = await FileSystem.uploadAsync(
      'https://chalk-system.onrender.com/classify',
      uri,
      {
        fieldName: 'image',
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      }
    );

    return JSON.parse(response.body);
  } catch (error) {
    console.error('Error classifying image:', error);
    Snackbar.show({
      text: 'Error, Failed to classify image',
      duration: Snackbar.LENGTH_SHORT,
    });
    return [];
  }
};

// Mantenha uma única instância do socket para toda a aplicação

export function match(realm: Realm, me: UserType) {
  const socket = io('https://chalk-system.onrender.com');
  return {
    request: () =>
      new Promise<UserType>(async (resolve, reject) => {
        try {
          const meToSend: UserType = {
            name: me.name,
            bio: me.bio,
            age: me.age,
            gender: me.gender,
            id: me.id,
            profilePicture: me.profilePicture ?? defaultFirebaseProfilePicture,
            authenticated: me.authenticated,
            matchingConfig: me.matchingConfig,
          };
          socket.emit('match_user', meToSend);
          socket.once('match_user:response', (usr: UserType) => {
            console.log(usr);
            resolve(usr);
          });
        } catch (error) {
          reject(error);
        }
      }),
  };
}
