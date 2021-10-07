import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Chat from './Pages/Chat'

import Home from './Pages/Home'

import SearchPerson from './Pages/SearchPerson'

import SignIn from './Pages/Verification/SignIn'
import SignUp from './Pages/Verification/SignUp'

import Account from './Pages/Profile/Account'
    import EditProfile from './Pages/Profile/Account/EditProfile'
    import AuthPhoneNumber from './Pages/Profile/Account/AuthPhoneNumber'
import ChatProfile from './Pages/Profile/ChatProfile';

import Profile from './Pages/Profile'

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
                <Screen name="SignUp" component={SignUp} />
                <Screen name="SignIn" component={SignIn} />
                <Screen name="Home" component={Home} />
                <Screen name="SearchPerson" component={SearchPerson} />
                <Screen name="Profile" component={Profile} />
                <Screen name="Chat" component={Chat} />

                <Screen name="Account" component={Account} />
                    <Screen name="EditProfile" component={EditProfile} />
                    <Screen name="AuthPhoneNumber" component={AuthPhoneNumber} />
                <Screen name="ChatProfile" component={ChatProfile} />
            </Navigator>
        </NavigationContainer>
    );
};

export default Routes;