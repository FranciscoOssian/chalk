import React from 'react';

import ProfilePicture from '@components/common/Image';
import Read from '../Read';
import { Chat as Wrapper, Name, Message, ContainerChat } from './styles';
import MessageType from '@src/types/message';

import { formatTimestamp } from '@utils/time.ts';

const message = (lastMessage: MessageType | undefined, yourUID: string) => {
  const tagTo = lastMessage?.id === yourUID ? 'you:' : '';
  const time = `   •   ${formatTimestamp(lastMessage?.timestamp || new Date())}`;
  if (lastMessage?.content?.contentType === 'text') {
    const text = lastMessage.content.value.substring(0, 19);
    const dot3 = lastMessage.content.value.length > 19 ? '...' : '';
    return `${tagTo}${text}${dot3}${time}`;
  } else if (lastMessage?.content?.contentType === 'image') {
    return `${tagTo} 📷 ${time}`;
  }
};

interface ChatPropsType {
  pic?: string;
  name?: string;
  lastMessage?: MessageType;
  yourUID: string;
  onPicturePress: () => void;
  onChatPress: () => void;
}

const Chat = ({ pic, name, lastMessage, yourUID, onPicturePress, onChatPress }: ChatPropsType) => {
  return (
    <Wrapper onPress={onChatPress}>
      <ProfilePicture width="20%" uri={pic} onPress={onPicturePress} />
      <ContainerChat>
        <Name>{name}</Name>
        <Message>{message(lastMessage, yourUID)}</Message>
      </ContainerChat>
      <Read view={false} />
    </Wrapper>
  );
};

export default Chat;
