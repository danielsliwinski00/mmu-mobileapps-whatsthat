/* eslint-disable no-return-assign */
/* eslint-disable global-require */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-var */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable quote-props */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
/* eslint-disable no-undef */
/* eslint-disable no-throw-literal */
/* eslint-disable no-else-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable react/sort-comp */
/* eslint-disable import/extensions */
// eslint-disable-next-line no-else-return
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-notifications';
import HomeScreen from './components/home.js';
import LogIn from './components/login.js';
import SignUp from './components/signup';
import Profile from './components/profile.js';
import AppHome from './components/apphome.js';
import Contacts from './components/contacts.js';
import Search from './components/search.js';
import Blocked from './components/blocked.js';
import Chats from './components/chats.js';
import Chat from './components/chat.js';
import ChatInfo from './components/chatinfo.js';
import AddMember from './components/addmember.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Log in"
          component={LogIn}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#ffffff',
            animationEnabled: 'true',
          }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#ffffff',
            animationEnabled: 'true',
          }}
        />
        <Stack.Screen
          name="Sign up"
          component={SignUp}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#ffffff',
            animationEnabled: 'true',
          }}
        />
        <Stack.Screen
          name="AppHome"
          component={AppHome}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#ffffff',
            headerLeft: null,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#ffffff',
            animationEnabled: 'true',
          }}
        />
        <Stack.Screen
          name="Contacts"
          component={Contacts}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#ffffff',
            animationEnabled: 'true',
          }}
        />
        <Stack.Screen
          name="Blocked"
          component={Blocked}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#ffffff',
            animationEnabled: 'true',
          }}
        />
        <Stack.Screen
          name="Chats"
          component={Chats}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#ffffff',
            animationEnabled: 'true',
          }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          initialParams=""
          options={() => ({
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#ffffff',
            animationEnabled: 'true',
          })}
        />
        <Stack.Screen
          name="ChatInfo"
          component={ChatInfo}
          initialParams=""
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#ffffff',
            animationEnabled: 'true',
          }}
        />
        <Stack.Screen
          name="AddMember"
          component={AddMember}
          initialParams=""
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#ffffff',
            animationEnabled: 'true',
          }}
        />
      </Stack.Navigator>
      <Toast ref={(ref) => global.toast = ref} />
    </NavigationContainer>
  );
}
