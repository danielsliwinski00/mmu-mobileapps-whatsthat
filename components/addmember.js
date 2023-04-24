import React, { Component, useEffect } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image, Modal } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents } from 'react-navigation';
import styles from './stylesheet.js';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import validation from './validation.js';

export default class AddMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            contactsData: [],
            searchData: [],
            addingContact: false,
            userID: '',
            searchText: '',
            optionPanel: false,
            animateOptionsPanel: new Animated.Value(210),
            modalVisible: false,
            chatid: '',
            members: [],
            adduserid: 0,
        }
    }

    searchPrep() {
        this.setState({
            isLoading: true,
        })
        this.search();
    }


    async search() {
        return fetch("http://192.168.1.102:3333/api/1.0.0/search?search_in=contacts&q=" + this.state.searchText,
            {
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                this.setState({
                    searchData: responseJson,
                    isLoading: false,
                    addingContact: true,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async fetchContacts() {
        console.log(this.props.route.params.chatMembers)
        return fetch("http://192.168.1.102:3333/api/1.0.0/contacts",
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

    async addMember(id) {
        this.setState({
            isLoading: true,
        })
        console.log(this.state.chatid, id)
        return fetch("http://192.168.1.102:3333/api/1.0.0/chat/" + this.state.chatid + "/user/" + id.toString(),
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    console.log('successfully added member')
                    this.fetchContacts();
                    this.setState({
                        isLoading: false,
                    })
                    this.props.navigation.navigate('ChatInfo', { chatID: this.state.chatid })
                }
                else if (response.status == 400) {
                    this.setState({
                        isLoading: false,
                    })
                    this.props.navigation.navigate('ChatInfo', { chatID: this.state.chatid })
                    throw "Bad Request"
                }
                else if (response.status == 401) {
                    throw "Unauthorized"
                }
                else if (response.status == 403) {
                    throw "Forbidden"
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

    isUserMember = (id) => {
        var arr = this.state.members

        if (arr.findIndex(data => data.user_id == id)) {
            return true
        }
        else {
            return false
        }
    }

    async componentDidMount() {
        this.setState({
            isLoading: true,
            userID: await AsyncStorage.getItem("whatsthatID"),
            chatid: this.props.route.params.chatID.toString(),
            members: this.props.route.params.chatMembers,
        })
        this.fetchContacts();

        this.props.navigation.addListener('focus', async () => {
            await this.setState({
                isLoading: true,
            })
            this.fetchContacts()
        });
    }

    searchTextChange = (text) => {
        this.setState({ searchText: text })
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <View style={[styles.background]}>
                    <View style={[styles.view,]}>
                        <View style={[styles.header]}>
                            <Text style={[styles.headerText]}>
                                Contacts
                            </Text>
                        </View>
                        <View style={[styles.addMemberSearchView,]}>
                            <TextInput
                                style={[styles.contactSearch, { alignSelf: 'center', marginLeft: '5%', width: '90%', }]}
                                placeholder='Search'
                                onChangeText={this.searchTextChange}
                                onSubmitEditing={() => this.searchPrep()}>
                            </TextInput>
                        </View>
                        <View style={[styles.activityIndicatorView]}>
                            <ActivityIndicator style={[styles.activityIndicator]} />
                        </View>
                    </View>
                </View>
            );
        }
        if (this.state.addingContact == true) {
            return (
                <View style={[styles.background]}>
                    <View style={[styles.view]}>
                        <View style={[styles.header]}>
                            <Text style={[styles.headerText]}>
                                Contacts
                            </Text>
                        </View>
                        <View style={[{ flex: 9, justifyContent: 'flex-start' }]}>
                            <FlatList
                                data={this.state.searchData}
                                keyExtractor={item => item.user_id}
                                renderItem={({ item }) => {
                                    if (item.user_id == this.state.userID) {
                                        return
                                    } else if (!this.isUserMember(item.user_id)) {
                                        return
                                    } else {
                                        return (
                                            <View style={[styles.contactBox,]}>
                                                <View style={[styles.contactInfoBox]}>
                                                    <Text style={[styles.contactInfoName,]}>{item.given_name} {item.family_name}</Text>
                                                    <Text style={[styles.contactInfoEmail,]}>{item.email}</Text>
                                                    <Text style={[styles.contactInfoUserID,]}>User ID: {item.user_id} </Text>
                                                </View>
                                                <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                    <TouchableOpacity onPress={() => { this.addMember(item.user_id.toString()) }}>
                                                        <Image style={[styles.addContact]} source={require('./images/addcontact.png')} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>)
                                    }
                                }}
                            />
                        </View>
                        <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
                            <TouchableOpacity
                                style={styles.box}
                                onPress={() => { this.setState({ addingContact: false, optionPanel: false, }) }}
                            >
                                <Text style={styles.text}>Back
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >)
        }
        return (
            <View style={[styles.background,]}>
                <View style={[styles.view,]}>
                    <View style={[styles.header]}>
                        <Text style={[styles.headerText]}>
                            Contacts
                        </Text>
                    </View>
                    <View style={[styles.addMemberSearchView]}>
                        <TextInput style={[styles.contactSearch, { alignSelf: 'center', marginLeft: '5%', width: '90%', }]}
                            placeholder='Search Contacts'
                            onChangeText={this.searchTextChange}
                            onSubmitEditing={() => this.searchPrep()}>
                        </TextInput>
                    </View>
                    <View style={[{ flex: 9, justifyContent: 'flex-start' }]}>
                        <FlatList
                            nestedScrollEnabled
                            data={this.state.contactsData}
                            keyExtractor={item => item.user_id}
                            renderItem={({ item }) => {
                                if (item.user_id == this.state.userID) {
                                    return
                                } else if (!this.isUserMember(item.user_id)) {
                                    return
                                } else {
                                    return (
                                        <View style={[styles.contactBox,]}>
                                            <View style={[styles.contactInfoBox]}>
                                                <Text style={[styles.contactInfoName,]}>{item.first_name} {item.last_name}</Text>
                                                <Text style={[styles.contactInfoEmail,]}>{item.email}</Text>
                                                <Text style={[styles.contactInfoUserID,]}>User ID: {item.user_id} </Text>
                                            </View>
                                            <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                <TouchableOpacity onPress={() => { this.addMember(item.user_id.toString()) }}>
                                                    <Image style={[styles.addContact]} source={require('./images/addcontact.png')} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>)
                                }
                            }}
                        />
                    </View>
                </View>
            </View >
        );
    }
}