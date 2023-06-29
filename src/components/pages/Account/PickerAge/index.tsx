import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View } from 'react-native';

type AgeConfigType = {
  from: number
  to: number
}

type AgePickerProps = {
  initial: AgeConfigType
  callback: (updatedAgeConfig: { from: number; to: number }) => void
}

/**
 * Component for selecting an age range.
 * @param {object} ageConfig - The age range configuration.
 * @param {number} ageConfig.from - The minimum value of the age range.
 * @param {number} ageConfig.to - The maximum value of the age range.
 * @param {function} callback - The callback function called when the age range is updated.
 */

const AgePicker = ({ initial, callback }: AgePickerProps) => {

  const [ageConfig, setAgeConfig] = useState({
    from: initial.from,
    to: initial.to
  })
  useEffect(() => {
    setAgeConfig(initial);
  }, [initial]);

  const handleChange = ({from, to}: AgeConfigType) => {
    setAgeConfig({from, to});
    callback({from, to});
  };

  return (
    <View
      style={{ width: '100%', height: 100 }}
    >
      <Picker
        style={{ width: '100%', height: 50 }}
        selectedValue={ageConfig.from}
        onValueChange={(v) => handleChange({from: v, to: ageConfig.to})}
      >
        {Array(100)
          .fill(0)
          .map((_, i) => i)
          .map((i) => i + 17)
          .filter((i) => i <= ageConfig.to - 1)
          .map((i) => (
            <Picker.Item key={i + 1} label={`from ${i + 1}`} value={i + 1} />
        ))}
      </Picker>

      <Picker
        style={{ width: '100%', height: 50 }}
        selectedValue={ageConfig.to}
        onValueChange={(v) => handleChange({to: v, from: ageConfig.from})}
      >
        {Array(100)
          .fill(0)
          .map((_, i) => i)
          .filter((i) => i >= ageConfig.from - 1)
          .map((i) => (
            <Picker.Item key={i + 1} label={`to ${i + 1}`} value={i + 1} />
          ))}
      </Picker>

    </View>
  );
};

export default AgePicker;
