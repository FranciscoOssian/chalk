import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { supportedLanguages } from '@utils/languages.json';

interface PropsType {
  initial: string;
  callback: (language: string) => void;
}

/**
 * Application language selection picker component.
 * @param {PropsType} props - The component properties.
 * @param {string} props.initial - The initial selected language.
 * @param {function} props.callback - The callback function called when the selected language is updated.
 * @returns {JSX.Element} The application language selection picker component.
 */

const PickerAppLang: React.FC<PropsType> = ({ initial, callback }) => {
  
  const [selectedLanguage, setSelectedLanguage] = useState(initial);

  const handleLanguageChange = (itemValue: string) => {
    setSelectedLanguage(itemValue);
    callback(itemValue);
  };

  return (
    <Picker
      style={{ width: '100%', height: 50 }}
      selectedValue={selectedLanguage}
      onValueChange={handleLanguageChange}
    >
      {supportedLanguages.map((l) => (
        <Picker.Item key={l} label={l} value={l} />
      ))}
    </Picker>
  );
};

export default PickerAppLang;
