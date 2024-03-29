import { useNavigation } from '@react-navigation/native';
import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components/native';

import ThemeProvider from '@providers/theme';
import SafeArea from '@components/common/SafeArea';
import { ChatList } from '@components/pages/Chat/ChatList';
import Head from '@components/pages/Chat/Head';
import InputMessage from '@components/pages/Chat/InputMessage';
import Message from '@components/pages/Chat/Message';
import useUser from '@hooks/useUser';
import useChats from '@src/hooks/useChats';
import realmContext from '@contexts/realm';
import createRealmMessage from '@src/services/realm/create/message';
import createFirebaseMessage from '@src/services/firebase/create/message';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Home({ navigation, route }: any) {
  const [inputMessage, setInputMessage] = useState('');
  const me = useUser();
  const friend = useUser(route.params.id);
  const chatName = useMemo(() => [me?.id, friend?.id].sort().join('-'), [me, friend]);

  const nav = useNavigation();

  const chat = useChats(chatName)[0];
  const [messages, setMessages] = useState(chat?.messages ?? []);

  const realm = realmContext.useRealm();

  const sendMessage = async (message: { type: string; value: string }) => {
    if (!me.id || !friend.id) return;

    const timestamp = new Date(Math.floor(Date.now() / 1000) * 1000);

    createRealmMessage(realm, {
      from: me.id || '',
      to: friend.id || '',
      timestamp,
      content: {
        contentType: message.type,
        value: message.value,
      },
    });
    createFirebaseMessage({
      content: {
        contentType: message.type,
        value: message.value,
      },
      from: me.id,
      to: friend.id,
      timestamp,
    });
  };

  useEffect(() => {
    const run = async () => {
      if (!chat?.id) return;
      await AsyncStorage.setItem('currentOpenedChat', chat?.id);
      setMessages(chat?.messages.slice().sort((a: any, b: any) => b.timestamp - a.timestamp));
    };
    run();
    return () => {
      AsyncStorage.setItem('currentOpenedChat', '');
    };
  }, [chat]);

  return (
    <Main>
      <Head
        pic={friend.profilePicture}
        name={friend.name}
        status={friend.bio?.replace(/(\r\n|\n|\r)/gm, '').substring(0, 10) + '...'}
        onPerfilPress={() => nav.navigate('/account' as never, { id: friend.id } as never)}
        onPhoneCallPress={() => {}}
        onVideoCallPress={() => {}}
      />
      <ChatList
        data={messages}
        renderItem={({ item, index }: any) => {
          return (
            <Message
              item={item}
              myId={me.id}
              nextIsAnother={item?.from !== messages[index + 1]?.from}
              backIsAnother={item?.from !== messages[index - 1]?.from}
              onImagePress={
                item.content.contentType === 'image'
                  ? () => nav.navigate('/image' as never, { list: [item.content.value] } as never)
                  : () => {}
              }
            />
          );
        }}
        keyExtractor={(item) => (item as any).id}
        inverted
      />
      <InputMessage
        placeholder="Aa"
        value={inputMessage}
        onChangeText={setInputMessage}
        onSend={({ contentType, value }: any) => {
          sendMessage({ type: contentType, value });
        }}
      />
    </Main>
  );
}

export default function (props: any) {
  return (
    <SafeArea>
      <ThemeProvider>
        <Home {...props} />
      </ThemeProvider>
    </SafeArea>
  );
}

const Main = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;
