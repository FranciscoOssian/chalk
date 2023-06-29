import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { languages } from '@utils/languages.json';

interface PropsType {
  initial: string;
  callback: (language: string) => void;
}

/**
 * Language selection picker component.
 * @param {PropsType} props - The component properties.
 * @param {string} props.initial - The initial selected language.
 * @param {function} props.callback - The callback function called when the selected language are updated.
 * @returns {JSX.Element} The language selection picker component.
 */
const PickerMatchLanguage: React.FC<PropsType> = ({ initial, callback }) => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initial);

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
      {languages.map((l) => (
        <Picker.Item
          key={l.code}
          label={`${l.NATIVEname} - ${l.ENname} ${selectedLanguage.includes(l.code) ? t`- selected` : ''}`}
          value={l.code}
        />
      ))}
    </Picker>
  );
};

export default PickerMatchLanguage;
