import React, { useRef, useState } from 'react';

import Touch from '../../../common/Touch';
import { Form, Input, InputPicker as Picker, PickerContainer } from './styles';

const genders = ['Woman', 'Man', 'Transgender', 'Non-Binary', 'Prefer not to state'];

const EditorForm = ({ name, age, bio, gender }) => {
  const pickRef = useRef(undefined);

  function open() {
    pickRef.current.focus();
  }

  const pickRef2 = useRef(undefined);

  function open2() {
    pickRef2.current.focus();
  }

  return (
    <Form>
      <Input
        placeholder="Name"
        onChangeText={(p) => name.set(p.substring(0, 10))}
        value={name.value}
      />

      <PickerContainer>
        <Picker
          ref={pickRef}
          selectedValue={age.value}
          onValueChange={(itemValue, _) => {
            age.set(itemValue);
          }}>
          {Array(100 - 17)
            .fill(0)
            .map((_, i) => (
              <Picker.Item key={i + 18} label={`${i + 18}`} value={i + 18} />
            ))}
        </Picker>
      </PickerContainer>

      <Touch onPress={() => open()}>
        <Input editable={false} placeholder="Age" value={`age - ${age.value}`} />
      </Touch>

      <PickerContainer>
        <Picker
          ref={pickRef2}
          selectedValue={gender.value}
          onValueChange={(itemValue, _) => {
            gender.set({ label: genders[itemValue], value: itemValue });
          }}>
          {genders.map((item, index) => (
            <Picker.Item key={index} label={item} value={index} />
          ))}
        </Picker>
      </PickerContainer>

      <Touch onPress={() => open2()}>
        <Input
          editable={false}
          placeholder={`${gender.label ? `gender - ${gender.label}` : 'gender'}`}
        />
      </Touch>

      <Input placeholder="Bio" onChangeText={bio.set} value={bio.value} height={250} multiline />
    </Form>
  );
};

export default EditorForm;
