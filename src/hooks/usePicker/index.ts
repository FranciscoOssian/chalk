import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerResult } from 'expo-image-picker';

interface PickerProps {
  propagate: boolean;
  save?: boolean;
}

type ImageType = ImagePickerResult;

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
export default function usePicker(
  config: ImagePicker.ImagePickerOptions | undefined = undefined
): [ImageType | undefined, PickFunction] {
  const [result, setResult] = useState<ImageType>();

  const defaultConfig = {
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [1, 1] as [number, number],
    quality: 1,
    base64: true,
  };

  const pick = async ({ propagate = true, save = false }: PickerProps) => {
    if (!FileSystem.documentDirectory) return;
    const result = await ImagePicker.launchImageLibraryAsync({ ...defaultConfig, ...config });
    if (propagate) {
      setResult(result);
    }
    if (save) {
      ///
    }
    return result;
  };

  return [result, pick];
}
