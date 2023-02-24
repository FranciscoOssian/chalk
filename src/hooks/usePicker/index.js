import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export default function usePicker(config) {
  const [image, setImage] = useState(null);

  const defaultConfig = {
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  };

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ ...defaultConfig, ...config });
    if (result.canceled) return;
    setImage(result.assets[0].uri);
  };

  return [image, pick];
}
