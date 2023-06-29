import React from 'react';

import Image from '@components/common/Image';
import { Head as Wrapper, Text } from './styles';

import { defaultFirebaseProfilePicture } from '@src/utils/consts';

interface HeadPropsType {
  pic?: string
  onProfilePress: () => void
}

const Head = ({ pic, onProfilePress }: HeadPropsType) => {
  return (
    <Wrapper>
      <Image
        width={60}
        uri={pic || defaultFirebaseProfilePicture}
        onPress={() => onProfilePress()} />
      <Text>Chats</Text>
    </Wrapper>
  );
};

export default Head;
