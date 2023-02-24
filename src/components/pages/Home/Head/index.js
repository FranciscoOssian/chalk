import React from 'react';

import Image from '../../../common/Image';
import { Head as Wrapper, Text } from './styles';

const Head = ({ pic, onProfilePress }) => {
  return (
    <Wrapper>
      <Image width={60} uri={pic} onPress={() => onProfilePress()} />
      <Text>Chats</Text>
    </Wrapper>
  );
};

export default Head;
