import { useNavigation } from '@react-navigation/native';

import Chat from '../Chat';
import { Chats as Wrapper } from './styles';

const Chats = ({ list, me }) => {
  const nav = useNavigation();

  return (
    <Wrapper showsVerticalScrollIndicator={false}>
      {list.map((c, i) => {
        let friend;
        if (c.owners[0].id === me.id) friend = c.owners[1];
        else friend = c.owners[0];
        return (
          <Chat
            key={i}
            name={friend.name}
            pic={friend.profilePicture}
            lastMessage={
              c.messages[c.messages.length - 1]
                ? c.messages[c.messages.length - 1]
                : { content: { contentType: 'message', value: '...' }, id: 'o' }
            }
            onPicturePress={() => {
              nav.navigate('/image', { list: [friend.profilePicture] });
            }}
            onChatPress={() => {
              nav.navigate('/chat', { id: friend.id });
            }}
          />
        );
      })}
    </Wrapper>
  );
};

export default Chats;
