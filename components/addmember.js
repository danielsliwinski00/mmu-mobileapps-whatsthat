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
            chatid:'',
            members:[],
        }
    }

    searchPrep() {
        this.setState({
            isLoading: true,
        })
        this.search();
    }


    async search() {
        return fetch("http://192.168.1.209:3333/api/1.0.0/search?search_in=contacts&q=" + this.state.searchText,
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
        return fetch("http://192.168.1.209:3333/api/1.0.0/contacts",
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
        return fetch("http://192.168.1.209:3333/api/1.0.0/chat/" + this.state.chatid + "/user/" + id.toString(),
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
                    this.props.navigation.navigate('ChatInfo', {chatID: this.state.chatid})
                }
                else if (response.status == 400) {
                    this.setState({
                        isLoading: false,
                    })
                    this.props.navigation.navigate('ChatInfo', {chatID: this.state.chatid})
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
                <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
                    <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                        <View style={[styles.header]}>
                            <Text style={[styles.headerText]}>
                                Contacts
                            </Text>
                        </View>
                        <View style={[{ flex: 1, marginTop: 10, marginHorizontal: 10, backgroundColor: 'transparent', flexDirection: 'row' }]}>
                            <TextInput style={[styles.contactSearch, { alignSelf: 'flex-start', width: 340, }]}
                                placeholder='Search'
                                onChangeText={this.searchTextChange}
                                onSubmitEditing={() => this.searchPrep()}>
                            </TextInput>
                            <TouchableOpacity style={[styles.contactOptions]} onPress={() => {  }}>
                                <Image style={[styles.contactOptions]} source={require('./images/optionsg.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.view, { flex: 11, }]}>
                            <ActivityIndicator style={{ marginTop: 350, alignSelf: 'center' }} />
                        </View>
                    </View>
                </View>
            );
        }
        if (this.state.addingContact == true) {
            return (
                <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
                    <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
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
                                    if (item.user_id != this.state.userID) {
                                        return (
                                            <View style={[{ flex: 1, flexDirection: 'row', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                                <View style={[{ flex: 8, alignSelf: 'flex-start' }]}>
                                                    <Text style={[styles.text, { marginTop: 10, marginLeft: 10, fontSize: 20 }]}> {item.given_name} {item.family_name} </Text>
                                                    <Text style={[styles.text, { marginTop: 2, marginLeft: 10, fontSize: 20 }]}> {item.email} </Text>
                                                    <Text style={[styles.text, { marginTop: 2, marginLeft: 10, fontSize: 15 }]}> User ID: {item.user_id} </Text>
                                                </View>
                                                <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                    <TouchableOpacity onPress={() => { this.addMember(item.user_id) }}>
                                                        <Image style={[styles.addContact]} source={require('./images/addcontact.png')} /></TouchableOpacity></View>
                                            </View>)
                                    } else {
                                        return
                                    }
                                }
                                }
                            />
                        </View>
                        <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
                            <TouchableOpacity
                                style={styles.box}
                                onPress={() => {
                                    this.setState({
                                        addingContact: false,
                                        optionPanel: false,
                                    })
                                }}>

                                <Text style={styles.text}>Back
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >)
        }
        return (
            <ScrollView scrollEnabled={false} style={[{ flex: 1, marignBottom: 0, backgroundColor: '#f2f2f2' }]} contentContainerStyle={{ flexGrow: 1 }}>

                <View style={[styles.viewHome, { width: '100%', flex: 1, padding: 0, }]}>
                    <View style={[styles.header]}>
                        <Text style={[styles.headerText]}>
                            Contacts
                        </Text>
                    </View>
                    <View style={[{ flex: 1, marginTop: 10, marginHorizontal: 10, backgroundColor: 'transparent', flexDirection: 'row' }]}>
                        <TextInput style={[styles.contactSearch, { alignSelf: 'flex-start', width: 340, }]}
                            placeholder='Search Contacts'
                            onChangeText={this.searchTextChange}
                            onSubmitEditing={() => this.searchPrep()}>
                        </TextInput>
                    </View>
                    <View style={[{ flex: 10, justifyContent: 'flex-start' }]}>
                        <FlatList
                            nestedScrollEnabled
                            data={this.state.contactsData}
                            keyExtractor={item => item.user_id}
                            renderItem={({ item }) => {
                                if (item.user_id == this.state.userID) {
                                    return
                                } else if(item.user_id==100){
                                    return
                                }else{
                                    return (
                                        <View style={[{ flex: 1, flexDirection: 'row', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                            <View style={[{ flex: 8, marginLeft: 10, alignSelf: 'flex-start' }]}>
                                                <Text style={[styles.text, { marginTop: 10, fontSize: 25 }]}>{item.first_name} {item.last_name}</Text>
                                                <Text style={[styles.text, { marginTop: 2, fontSize: 18 }]}>{item.email}</Text>
                                                <Text style={[styles.text, { marginTop: 2, fontSize: 15 }]}>User ID: {item.user_id} </Text>
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
            </ScrollView >
        );
    }
}