import React, { Component } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';

class Blocked extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            contactsData: [],
            addingContact: false,
            userID: '',
        }
    }

    async unblockContact(id) {
        this.setState({
            isLoading: true,
        })
        return fetch("http://192.168.1.209:3333/api/1.0.0/user/" + id + "/block",
            {
                method: 'delete',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    this.fetchAccounts();
                    this.setState({
                        isLoading: false,
                    })
                    this.props.navigation.navigate('Contacts')
                }
                else if (response.status == 400) {
                    throw "You can't block yourself"
                }
                else if (response.status == 401) {
                    throw "Unauthorized"
                }
                else if (response.status == 404) {
                    throw "Not Found"
                }
                else {
                    throw "Something went wrong"
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async fetchAccounts() {
        return fetch("http://192.168.1.209:3333/api/1.0.0/blocked",
            {
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    return response.json();
                }
                else if (response.status == 401) {
                    throw "Unauthorised"
                }
                else {
                    throw "Something went wrong"
                }
            })
            .then((responseJson) => {
                this.setState({
                    contactsData: responseJson,
                    isLoading: false,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async componentDidMount() {
        this.setState({
            userID: await AsyncStorage.getItem("whatsthatID")
        })
        this.fetchAccounts();
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
                    <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                        <View style={[{ flex: 1, backgroundColor: '#412234' }]}>
                            <Text style={[styles.text, { color: '#ffffff', alignSelf: 'center' }]}>
                                Blocked List
                            </Text>
                        </View>
                        <View style={[styles.view, { flex: 10, }]}>
                            <ActivityIndicator style={{ marginTop: 350, alignSelf: 'center' }} />
                        </View>
                    </View>
                </View>
            );
        }
        return (
            <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
                <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                    <View style={[{ flex: 1, backgroundColor: '#412234' }]}>
                        <Text style={[styles.text, { color: '#ffffff', alignSelf: 'center' }]}>
                            Blocked List
                        </Text>
                    </View>
                    <View style={[{ flex: 11, justifyContent: 'flex-start' }]}>
                        <FlatList
                            data={this.state.contactsData}
                            keyExtractor={item => item.user_id}
                            renderItem={({ item }) => {
                                if (item.user_id != this.state.userID) {
                                    return (
                                        <View style={[{ flex: 1, flexDirection: 'row', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                            <View style={[{ flex: 8, alignSelf: 'flex-start' }]}>
                                                <Text style={[styles.text, { marginTop: 10, marginLeft: 10, fontSize: 25 }]}> {item.first_name} {item.last_name} </Text>
                                                <Text style={[styles.text, { marginTop: 2, marginLeft: 10, fontSize: 18 }]}> {item.email} </Text>
                                                <Text style={[styles.text, { marginTop: 2, marginLeft: 10, fontSize: 15 }]}> User ID: {item.user_id} </Text>
                                            </View>
                                            <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                <TouchableOpacity onPress={() => { this.unblockContact(item.user_id) }}>
                                                    <Image style={[styles.addContact]} source={require('./images/unblockcontact.png')} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>)
                                } else {
                                    return
                                }
                            }}
                        />
                    </View>
                    <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
                    </View>
                </View>
            </View >)

    }
}

export default Blocked;