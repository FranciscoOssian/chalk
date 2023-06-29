import React from 'react';

import ProfilePicture from '@components/common/Image';
import Read from '../Read';
import { Chat as Wrapper, Name, Message, ContainerChat } from './styles';
import MessageType from '@src/types/message';

function formatAMPM(d: Date): string {
  const date = new Date(d);

  let hours: number = date.getHours();
  let minutes: number = date.getMinutes();
  const ampm: string = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  if (hours < 10) hours = 0 + hours;
  if (minutes < 10) minutes = 0 + minutes;
  const strTime: string = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

const message = (lastMessage: MessageType | undefined, yourUID: string) => {
  const tagTo = lastMessage?.id === yourUID ? 'you:' : '';
  const time = `   •   ${formatAMPM(lastMessage?.timestamp || new Date)}`;
  if (lastMessage?.content?.contentType === 'text') {
    const text = lastMessage.content.value.substring(0, 19);
    const dot3 = lastMessage.content.value.length > 19 ? '...' : '';
    return `${tagTo}${text}${dot3}${time}`;
  } else if (lastMessage?.content?.contentType === 'image') {
    return `${tagTo} 📷 ${time}`;
  }
};

interface ChatPropsType {
  pic?: string
  name?: string
  lastMessage?: MessageType
  yourUID: string
  onPicturePress: () => void
  onChatPress: () => void
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
