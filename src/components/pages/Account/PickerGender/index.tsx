import React, { useEffect, useMemo, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { storageExtended } from '@src/utils/storageExtended';
import useAsync from '@src/hooks/useAsync';
import { genders } from 'defaultStorage';

type Genders = string[]

interface PropsType {
  initial: Genders;
  callback: (numbers: Genders) => void;
}

/**
 * @typedef {Object} PropsType
 * @property {Genders} initial - The initial selected genders.
 * @property {function} callback - The callback function called when the selected genders are updated.
 */

/**
 * Gender selection component.
 * @param {PropsType} props - The component properties.
 * @param {Genders} props.initial - The initial selected genders.
 * @param {function} props.callback - The callback function called when the selected genders are updated.
 * @returns {JSX.Element} The gender selection component.
 */

const GenderPicker: React.FC<PropsType> = ({ initial, callback }) => {
  const { t } = useTranslation();
  
  const { data: AllGenders } = useAsync({
    asyncFunction: async () => {
      const genders = await storageExtended('genders').get()
      return genders;
    },
    dependencies: []
  })

  const [selectedGenders, setSelectedGenders] = useState<Genders>(initial);
  useEffect(() => {
    setSelectedGenders(initial);
  }, [initial]);

  const handleGenderPick = (itemValue: string) => {
    if(null) return;
    let newGenders: Genders;
    if(selectedGenders.includes(itemValue)){
      if(selectedGenders.length === 1) return;
      newGenders = selectedGenders.filter(gender => gender !== itemValue)
      setSelectedGenders(newGenders);
    }
    else{
      newGenders = [...selectedGenders, itemValue]
      setSelectedGenders(newGenders);
    }
    callback(newGenders)
  };

  return (
    <Picker
      style={{ width: '100%', height: 50 }}
      selectedValue={``}
      onValueChange={handleGenderPick}
    >
      <Picker.Item
        key={0}
        label={selectedGenders.length === 0 ? 'select' : selectedGenders.join('; ')}
        value={null}
      />
      {AllGenders?.map( (value: string, index: number) =>
        <Picker.Item
          key={index}
          label={`${value}` + `${selectedGenders.includes(value) ? ` - ${t('selected')}` : ''}`}
          value={value}
        />
      )}
    </Picker>
  );
};

export default GenderPicker;
