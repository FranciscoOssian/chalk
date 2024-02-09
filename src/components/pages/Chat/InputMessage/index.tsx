import { useState } from 'react';

import Camera from '../Camera';
//import Clip from '@components/common/Clip';
import Send from '../SendIcon';
import usePicker from '@src/hooks/usePicker';
import { Input, Wrapper, Row, Container /*ContainerLeft, ContainerRight*/ } from './styles';

interface Props {
  onSend: (v: any) => Promise<void>;
}

export default (props: Props) => {
  const [textMessage, setTxtMessage] = useState('');
  const [_, pick] = usePicker();
  const onHandlePickImage = async () => {
    const result = await pick({ propagate: false });
    if (result?.canceled) return;
    const uri = result?.assets[0]?.uri;
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
          <Camera onPress={onHandlePickImage} />
        </Container>
      ) : (
        <Container>
          <Send onPress={() => onHandleTextSend()} />
        </Container>
      )}
    </Row>
  );
};
