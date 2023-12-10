import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerSuccessResult } from 'expo-image-picker';

interface PickerProps{
  propagate: boolean 
}

type ImageType = ImagePickerSuccessResult

type PickFunction = (props: PickerProps) => Promise<ImageType | undefined>;

/**
 * Custom hook for using an image picker with Expo ImagePicker.
 * @param {Object} config - The configuration options for the image picker.
 * @param {ImagePicker.MediaTypeOptions} config.mediaTypes - The media types allowed for selection.
 * @param {boolean} config.allowsEditing - Whether editing is allowed for the selected image.
 * @param {number[]} config.aspect - The aspect ratio for the selected image.
 * @param {number} config.quality - The quality of the selected image.
 * @returns {Array} An array containing the selected image URI and the pick function.
 */
export default function usePicker(config: ImagePicker.ImagePickerOptions | undefined = undefined): [ImageType | undefined, PickFunction] {
  const [result, setImage] = useState<ImagePickerSuccessResult>();

  const defaultConfig = {
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [1, 1] as [number, number],
    quality: 1,
    base64: true,
  };

  const pick = async ({propagate = true}: PickerProps) => {
    if(!FileSystem.documentDirectory) return;
    const result = await ImagePicker.launchImageLibraryAsync(config || defaultConfig);
    if(result.canceled) return;
    for(let i = 0; i < result.assets.length; ++i){
      result.assets[i].uri =
        await controlX(
          result.assets[i].uri,
          FileSystem.documentDirectory + result.assets[i].fileName
        ) || ''
    }
    if(propagate){
      setImage(result);
    }
    return (result)
  };

  return [result, pick];
}

async function controlX(origin: string, destiny: string): Promise<string | null> {
  if (FileSystem.documentDirectory === null) {
    console.error('Document directory is not available');
    return null;
  }

  try {
    await FileSystem.moveAsync({
      from: origin,
      to: destiny
    });
    await FileSystem.deleteAsync(origin, { idempotent: true });
    return destiny;
  } catch (e) {
    console.error('Erro ao salvar a imagem:', e);
    throw e;
  }
}
