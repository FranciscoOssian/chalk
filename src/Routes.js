import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import theme from './Styles/theme';
import Home from './pages';
import MyProfile from './pages/Account';
import ProfileEditor from './pages/Account/editor';
import SignIn from './pages/Account/signIn';
import SignUp from './pages/Account/signUp';
import Verify from './pages/Account/verify';
import Chat from './pages/chat';
import Image from './pages/image';
import NewChalk from './pages/newChalk';

const Stack = createNativeStackNavigator();
const { Navigator } = Stack;
const { Screen } = Stack;

function Routes() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <Navigator
          headerMode="none"
          screenOptions={{ cardStyle: { backgroundColor: 'transparent' }, headerShown: false }}>
          <Screen name="/account/signup" component={SignUp} />
          <Screen name="/account/signin" component={SignIn} />
          <Screen name="/" component={Home} />
          <Screen name="/account/verify" component={Verify} />
          <Screen name="/chat" component={Chat} />
          <Screen name="/newChalk" component={NewChalk} />
          <Screen name="/account" component={MyProfile} />
          <Screen name="/account/editor" component={ProfileEditor} />
          <Screen name="/image" component={Image} />
        </Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default Routes;
