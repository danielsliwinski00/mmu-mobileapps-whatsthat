import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from './stylesheet.js';
import Chats from './chats.js'
import Contacts from './contacts.js'
import Profile from './profile.js'
import { NavigationContainer,} from '@react-navigation/native';
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
                }}
                >
                    <Tab.Screen name='Chats' component={Chats}
                    options={{
                        headerTitle: "", headerTransparent: true,
                        tabBarLabel: ({focused, color, size}) => (<Text style={[styles.tabText,{color: focused ? '#2A2F4F' : '#ffffff'}]}>Chats</Text>),
                        tabBarIcon: () => {}
                      }}
                    />
                    <Tab.Screen name='Contacts' component={Contacts}
                    options={{
                        headerTitle: "", headerTransparent: true,
                        tabBarLabel: ({focused, color, size}) => (<Text style={[styles.tabText,{color: focused ? '#2A2F4F' : '#ffffff'}]}>Contacts</Text>),
                        tabBarIcon: () => {},
                        
                      }}
                    />
                    <Tab.Screen name='Profile' component={Profile}
                    options={{
                        headerTitle: "", headerTransparent: true,
                        tabBar:'#2A2F4F',
                        tabBarLabel: ({focused, color, size}) => (<Text style={[styles.tabText,{color: focused ? '#2A2F4F' : '#ffffff'}]}>Profile</Text>),
                        tabBarIcon: () => {},
                      }}
                    />
                </Tab.Navigator>
            </View >
        );
    }
}

/*
async logOut() {
        return fetch("http://192.168.1.102:3333/api/1.0.0/logout",
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    await AsyncStorage.removeItem("whatsthatID")
                    await AsyncStorage.removeItem("whatsthatSessionToken")
                    this.props.navigation.navigate('Home');
                }
                else if (response.status == 401) {
                    await AsyncStorage.removeItem("whatsthatID")
                    await AsyncStorage.removeItem("whatsthatSessionToken")
                    this.props.navigation.navigate('Home');
                }
                else {
                    throw "Something went wrong"
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

<View style={[styles.view]}>
                    <View style={[styles.header]}>
                        <Text style={[styles.headerText]}>
                            Home
                        </Text>
                    </View>
                    <View style={[{ flex: 1,}]}>
                        <Text style={[styles.text,{alignSelf:'center'}]}>Welcome</Text>
                    </View>
                    <View style={[{ flex: 9, justifyContent: 'flex-end' }]}>

                        <TouchableOpacity style={[styles.box]}
                            onPress={() => this.props.navigation.navigate('Chats')}>
                            <Text style={[styles.text]}>Chats</Text>
                        </TouchableOpacity >

                        <TouchableOpacity style={[styles.box]}
                            onPress={() => this.props.navigation.navigate('Contacts')}>
                            <Text style={[styles.text]}>Contacts</Text>
                        </TouchableOpacity >

                        <TouchableOpacity style={[styles.box]}
                            onPress={() => this.props.navigation.navigate('Profile')}>
                            <Text style={[styles.text]}>Profile</Text>
                        </TouchableOpacity >

                        <TouchableOpacity style={[styles.box]}
                            onPress={() => this.logOut()}>
                            <Text style={[styles.text]}>Log out</Text>
                        </TouchableOpacity >
                    </View>
                </View>
*/