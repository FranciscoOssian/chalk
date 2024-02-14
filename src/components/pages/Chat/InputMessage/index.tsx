import { useState } from 'react';

import Camera from '../Camera';
import { CameraButton } from '@components/common/ExpoCameraUI';
import Send from '../SendIcon';
import { Input, Wrapper, Row, Container } from './styles';

interface Props {
  onSend: (v: any) => Promise<void>;
}

export default (props: Props) => {
  const [textMessage, setTxtMessage] = useState('');
  const onHandlePickImage = async (result: { uri: string }) => {
    const uri = result.uri;
    if (!uri) return;
    const temp = {
      contentType: 'image',
      value: uri,
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
      </Wrapper>
      {textMessage === '' ? (
        <Container>
          <CameraButton onTakePicture={onHandlePickImage}>
            <Camera />
          </CameraButton>
        </Container>
      ) : (
        <Container>
          <Send onPress={() => onHandleTextSend()} />
        </Container>
      )}
    </Row>
  );
};
