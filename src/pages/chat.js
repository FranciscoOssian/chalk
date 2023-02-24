import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import ThemeProvider from '../Providers/theme';
import SafeArea from '../components/common/SafeArea';
import { ChatList } from '../components/pages/Chat/ChatList';
import Head from '../components/pages/Chat/Head';
import InputMessage from '../components/pages/Chat/InputMessage';
import Message from '../components/pages/Chat/Message';
import useFriend from '../hooks/useFriend';
import useUser from '../hooks/useUser';
import createFireMessage from '../services/firebase/create/message';
import getRealm from '../services/realm';
import createRealmMessage from '../services/realm/create/message';

function Home({ navigation, route }) {
  const [DATA, setDATA] = useState([]);
  const [reRenderList, setReRenderList] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const { user: me } = useUser();
  const { friend } = useFriend(route.params.id);
  const chatName = useMemo(() => [me.id, friend.id].sort().join('-'), [me, friend]);

  useEffect(() => {
    const run = async () => {
      if (me.id === 0 || friend.id === 0) return;

      const realm = await getRealm();

      const chat = realm.objects('Chat').filtered(`id == '${chatName}'`)[0];

      chat.addListener((c, changes) => {
        setDATA(c.messages ?? []);
      });
    };

    run();
  }, [chatName]);

  useEffect(() => {
    AsyncStorage.setItem('userToHiddenNotifications', `${friend.id}`);
    return () => AsyncStorage.setItem('userToHiddenNotifications', '');
  }, [friend.id]);

  const registerMessage = async (message) => {
    const getMessage = await createRealmMessage(message);
    await createFireMessage(message);
    return getMessage();
  };

  const sendMessage = async (message) => {
    await registerMessage(message);
    setReRenderList((p) => !p);
  };

  const nav = useNavigation();

  return (
    <Main>
      <Head
        pic={friend.profilePicture}
        name={friend.name}
        status={friend.bio.replace(/(\r\n|\n|\r)/gm, '').substring(0, 10) + '...'}
        onPerfilPress={() => nav.navigate('/account', { id: friend.id })}
        onPhoneCallPress={() => {}}
        onVideoCallPress={() => {}}
      />
      <ChatList
        data={DATA.slice().sort((a, b) => b.timestamp - a.timestamp)}
        renderItem={({ item }) => (
          <Message
            item={item}
            myId={me.id}
            onImagePress={
              item.content.contentType === 'image'
                ? () => nav.navigate('/image', { list: [item.content.value] })
                : () => {}
            }
          />
        )}
        keyExtractor={(item) => item.id}
        inverted
        extraData={reRenderList}
      />
      <InputMessage
        placeholder="Aa"
        value={inputMessage}
        onChangeText={(txt) => {
          setInputMessage(txt);
        }}
        onSend={({ contentType, value }) => {
          sendMessage({
            from: me.id,
            to: friend.id,
            timestamp: new Date(),
            content: {
              contentType,
              value,
            },
          });
          setInputMessage('');
        }}
      />
    </Main>
  );
}

export default function (props) {
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
  justify-content: center;
  width: 100%;
`;
