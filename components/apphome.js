import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from './stylesheet.js';

class appHome extends Component {

    async logOut() {
        return fetch("http://localhost:3333/api/1.0.0/logout",
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
                    throw "Unauthorised"
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
            <View style={[styles.view]}>

                <Text style={[styles.text]}>Home Screen</Text>

                <TouchableOpacity style={[styles.box]}
                    onPress={() => this.props.navigation.navigate('Search')}>
                    <Text style={[styles.text]}>Search</Text>
                </TouchableOpacity >

                <TouchableOpacity style={[styles.box]}
                    onPress={() => this.logOut()}>
                    <Text style={[styles.text]}>Log out</Text>
                </TouchableOpacity >

            </View>
        );
    }
}

export default appHome;