import React from 'react';

import Image from '../../../common/Image';
import { Message as Wrapper, Txt, Img, Conteiner } from './styles';

const Message = ({ item, onImagePress, myId }) => {
  const yourMessage = item.from === myId;

  return (
    <Conteiner my={yourMessage}>
      <Wrapper my={yourMessage} type={item.content.contentType}>
        {item.content.contentType === 'image' ? (
          <Img>
            <Image uri={item.content.value} width="100%" square onPress={onImagePress} />
          </Img>
        ) : (
          <>
            <Txt my={yourMessage}>{item.content.value}</Txt>
          </>
        )}
      </Wrapper>
    </Conteiner>
  );
};

export default Message;
