import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Chat from './Pages/Chat'

import Home from './Pages/Home'

import Profile from './Pages/Profile'
import ChatsProfile from './Pages/Profile/ChatsProfile'

import SearchPerson from './Pages/SearchPerson'

import SignIn from './Pages/Verification/SignIn'
import SignUp from './Pages/Verification/SignUp'

const AppStack = createNativeStackNavigator();

const { Navigator } = AppStack
const { Screen } = AppStack;

const Routes = () => {
    return (
        <NavigationContainer>
            <Navigator
                headerMode="none"
                screenOptions={{ cardStyle: { backgroundColor: '#f0f0f5' }, headerShown: false }}
            >
                <Screen name="Home" component={Home} />
                <Screen name="SignUp" component={SignUp} />
                <Screen name="SignIn" component={SignIn} />
                <Screen name="SearchPerson" component={SearchPerson} />
                <Screen name="Profile" component={Profile} />
                <Screen name="Chat" component={Chat} />
                <Screen name="ChatsProfile" component={ChatsProfile} />
            </Navigator>
        </NavigationContainer>
    );
};

export default Routes;