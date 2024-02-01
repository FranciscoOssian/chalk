import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import Camera from '../Camera';
import Send from '../SendIcon';
import { Input, Wrapper, Row } from './styles';

const pickeImage = async () =>
  await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });

export default (props) => {
  const [textMessage, setTxtMessage] = useState('');
  const onHandlePickImage = async () => {
    const result = await pickeImage();
    const uri = result.assets[0].uri;
    if (
      result.canceled ||
      (!uri.includes('.png') && !uri.includes('.jpeg') && !uri.includes('.mp4'))
    )
      return;
    const temp = {
      contentType: 'image',
      value: result.assets[0].uri,
    };
    props.onSend(temp);
  };
  const onHandleTextSend = async () => {
    const temp = {
      contentType: 'text',
      value: textMessage,
    };
    props.onSend(temp);
    setTxtMessage('');
  };
  return (
    <Row>
      <Wrapper>
        <Input multiline {...props} value={textMessage} onChangeText={setTxtMessage} />
        {textMessage === '' ? null : <Send onPress={() => onHandleTextSend()} />}
      </Wrapper>
      <Camera onPress={onHandlePickImage} />
    </Row>
  );
};
