import React from 'react';
import { View, Text } from 'react-native';

import ProfilePicture from '../../../common/Image';
import Read from '../Read';
import { Chat as Wrapper, Name, Message, ContainerChat } from './styles';

function formatAMPM(d) {
  const date = new Date();

  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  if (hours < 10) hours = '0' + hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

const message = (lastMessage, yourUID) => {
  const tagTo = lastMessage.id === yourUID ? 'you:' : '';
  const time = `   •   ${formatAMPM(lastMessage.timestamp)}`;
  if (lastMessage.content.contentType === 'message') {
    const text = lastMessage.content.value.substring(0, 19);
    const dot3 = lastMessage.content.value.length > 19 ? '...' : '';
    return `${tagTo}${text}${dot3}${time}`;
  } else if (lastMessage.content.contentType === 'image') {
    return `${tagTo} 📷 ${time}`;
  }
};

const ReadOld = ({ view }) => (
  <View style={{ marginHorizontal: 16 }}>
    {view ? (
      <View
        style={{
          borderRadius: 100,
          borderWidth: 2,
          borderColor: '#979797',
          width: 20,
          aspectRatio: 1 / 1,
        }}
      />
    ) : (
      <View
        style={{
          borderRadius: 100,
          borderWidth: 2,
          borderColor: '#979797',
          width: 20,
          aspectRatio: 1 / 1,
        }}>
        <Text style={{ color: '#979797' }}>V</Text>
      </View>
    )}
  </View>
);

const Chat = ({ pic, name, lastMessage, yourUID, onPicturePress, onChatPress }) => {
  return (
    <Wrapper onPress={onChatPress}>
      <ProfilePicture width="20%" uri={pic} onPress={onPicturePress} />
      <ContainerChat>
        <Name>{name}</Name>
        <Message>{message(lastMessage, yourUID)}</Message>
      </ContainerChat>
      <Read view={lastMessage.view} />
    </Wrapper>
  );
};

export default Chat;
