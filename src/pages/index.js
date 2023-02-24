import { useEffect, useState } from 'react';
import styled from 'styled-components';

import ThemeProvider from '../Providers/theme';
import NewChalk from '../components/common/NewChalk';
import SafeArea from '../components/common/SafeArea';
import Chats from '../components/pages/Home/Chats';
import Head from '../components/pages/Home/Head';
import useChats from '../hooks/useChats';
import useUser from '../hooks/useUser';

function Home({ navigation }) {
  const { chats } = useChats();
  const { user } = useUser();

  return (
    <Main>
      <Head
        pic={user.profilePicture}
        onProfilePress={() => navigation.navigate('/account', { id: user.id })}
      />
      <Chats list={chats} me={user} />
      <NewChalk onPress={() => navigation.navigate('/newChalk')} />
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
  width: 95%;
`;
