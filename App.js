import * as React from 'react';
import HomeScreen from '/components/home.js'
import LogIn from './components/login.js'
import SignUp from './components/signup'
import Profile from './components/profile.js'
import AppHome from './components/apphome.js'
import Contacts from './components/contacts.js'
import Search from './components/search.js'
import Blocked from './components/blocked.js'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, HeaderBackButton  } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Log in" component={LogIn}
          options={{
            headerTitle: "", headerTransparent: true,
            headerTintColor: '#ffffff'
          }}
        />
        <Stack.Screen name="Search" component={Search}
          options={{
            headerTitle: "", headerTransparent: true,
            headerTintColor: '#ffffff'
          }}
        />
        <Stack.Screen name="Sign up" component={SignUp}
          options={{
            headerTitle: "", headerTransparent: true,
            headerTintColor: '#ffffff'
          }}
        />
        <Stack.Screen name="AppHome" component={AppHome}
          options={{
            headerTitle: "", headerTransparent: true,
            headerTintColor: '#ffffff',
            headerLeft:null,
          }}
        />
        <Stack.Screen name="Profile" component={Profile}
          options={{
            headerTitle: "", headerTransparent: true,
            headerTintColor: '#ffffff'
          }}
        />
                <Stack.Screen name="Contacts" component={Contacts}
          options={{
            headerTitle: "", headerTransparent: true,
            headerTintColor: '#ffffff',
          }}
        />
                <Stack.Screen name="Blocked" component={Blocked}
          options={{
            headerTitle: "", headerTransparent: true,
            headerTintColor: '#ffffff',

          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
