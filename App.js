import * as React from 'react';
import HomeScreen from '/components/home.js'
import LogIn from './components/login.js'
import API from './components/APIscreen.js'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator()

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} 
        options={{headerShown: false}}
        />
        <Stack.Screen name="Log in" component={LogIn}
        options={{headerTitle:"", headerTransparent:true}}
        />
        <Stack.Screen name="API" component={API}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
