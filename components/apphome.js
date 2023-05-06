import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from './stylesheet.js';
import Chats from './chats.js'
import Contacts from './contacts.js'
import Profile from './profile.js'
import { NavigationContainer, } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default class AppHome extends Component {

    constructor(props) {

        super(props);
        this.state = {
            draftMessages: undefined
        }
    }

    async componentDidMount() {
        if (await AsyncStorage.getItem("draftMessages")) {
        }
        else {
            await AsyncStorage.setItem("draftMessages")
        }
    }
    render() {
        return (
            <View style={[styles.background]}>
                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveBackgroundColor: '#ffffff', tabBarInactiveBackgroundColor: '#2A2F4F',
                        unmountOnBlur: true
                    }}
                >
                    <Tab.Screen name='Chats' component={Chats}
                        options={{
                            headerTitle: "", headerTransparent: true,
                            tabBarLabel: ({ focused, color, size }) => (<Text style={[styles.tabText, { color: focused ? '#2A2F4F' : '#ffffff' }]}>Chats</Text>),
                            tabBarIcon: () => { }
                        }}
                    />
                    <Tab.Screen name='Contacts' component={Contacts}
                        options={{
                            headerTitle: "", headerTransparent: true,
                            tabBarLabel: ({ focused, color, size }) => (<Text style={[styles.tabText, { color: focused ? '#2A2F4F' : '#ffffff' }]}>Contacts</Text>),
                            tabBarIcon: () => { },

                        }}
                    />
                    <Tab.Screen name='Profile' component={Profile}
                        options={{
                            headerTitle: "", headerTransparent: true,
                            tabBar: '#2A2F4F',
                            tabBarLabel: ({ focused, color, size }) => (<Text style={[styles.tabText, { color: focused ? '#2A2F4F' : '#ffffff' }]}>Profile</Text>),
                            tabBarIcon: () => { },
                        }}
                    />
                </Tab.Navigator>
            </View >
        );
    }
}