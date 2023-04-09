import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from './stylesheet.js';

class AppHome extends Component {

    async logOut() {
        return fetch("http://192.168.1.209:3333/api/1.0.0/logout",
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

    render() {
        return (
            <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
                <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                    <View style={[{ flex: 1, backgroundColor: '#412234' }]}>
                        <Text style={[styles.text, { color: '#ffffff', alignSelf: 'center' }]}>
                            Home
                        </Text>
                    </View>
                    <Text style={[styles.text]}>Welcome</Text>
                    <View style={[{ flex: 1, justifyContent: 'flex-start' }]}>
                    </View>
                    <View style={[{ flex: 10, justifyContent: 'flex-end' }]}>

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
            </View >
        );
    }
}

export default AppHome;