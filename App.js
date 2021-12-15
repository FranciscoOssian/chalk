import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';

import Routes from './src/Routes'
import { LocalUserProvider, useLocalUser } from './src/Hooks/localDatabase/user'
import Core from './src/services/core'
import useAuth from './src/Hooks/Firebase/useAuth'

const core = new Core()

const Wrapper  = ({children}) => {
  const { update } = useLocalUser()
  const { user: userAuth, isSignedIn } = useAuth()
  useEffect(() => {
    const run = async () => {
      update( await core.localDB.get.myUser() )
    }
    run()
  }, [userAuth, isSignedIn])
  return <>{children}</>
}

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor="#ffff" />
      <LocalUserProvider>
        <Wrapper>
          <Routes />
        </Wrapper>
      </LocalUserProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;