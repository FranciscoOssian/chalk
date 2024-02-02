import React, { useEffect, useState } from 'react';

import Image from '@components/common/Image';
import { Head as Wrapper, Text } from './styles';

import { defaultFirebaseProfilePicture } from '@src/utils/consts';

import localStorage from '@src/services/localStorage';

interface HeadPropsType {
  pic?: string;
  onProfilePress: () => void;
}

const Head = ({ pic, onProfilePress }: HeadPropsType) => {
  const [admin, setIsAdmin] = useState(false);
  useEffect(() => {
    const run = async () => {
      setIsAdmin(await localStorage('isAdm').get());
    };
    run();
  }, []);
  return (
    <Wrapper>
      <Image
        width={60}
        uri={pic || defaultFirebaseProfilePicture}
        onPress={() => onProfilePress()}
      />
      <Text>Chats {admin ? 'Admin' : ''}</Text>
    </Wrapper>
  );
};

export default Head;
