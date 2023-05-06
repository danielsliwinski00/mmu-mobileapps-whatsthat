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
            draftMessages: [],
            userMember: false,
        }
    }

    searchPrep() {
        this.setState({
            isLoading: true,
        })
        this.search();
    }


    async search() {
        return fetch("http://localhost:3333/api/1.0.0/search?search_in=contacts&q=" + this.state.searchText,
            {
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then((response) => {
                if (response.status == 200) {
                    return response.json();
                }
                else if (response.status == 400) {
                    toast.show("Bad Request", { type: 'danger' })
                    throw "Bad Request"
                }
                else if (response.status == 401) {
                    toast.show("Unauthorized", { type: 'danger' })
                    throw "Unauthorised"
                }
                else if (response.status == 500) {
                    toast.show("Something went wrong", { type: 'danger' })
                    throw "Server Error"
                }
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
        return fetch("http://localhost:3333/api/1.0.0/contacts",
            {
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    return response.json();
                }
                else if (response.status == 401) {
                    toast.show("Unauthorized", { type: 'danger' })
                    throw "Unauthorised"
                }
                else if (response.status == 500) {
                    toast.show("Something went wrong", { type: 'danger' })
                    throw "Something went wrong"
                }
            })
            .then((responseJson) => {
                this.setState({
                    contactsData: responseJson,
                    isLoading: false
                }, () => { console.log(this.state.members, this.state.contactsData) })
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
        return fetch("http://localhost:3333/api/1.0.0/chat/" + this.state.chatid + "/user/" + id.toString(),
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    toast.show("Added Member", { type: 'success' })
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
                    toast.show("Bad Request", { type: 'danger' })
                    throw "Bad Request"
                }
                else if (response.status == 401) {
                    toast.show("Unauthorized", { type: 'danger' })
                    throw "Unauthorized"
                }
                else if (response.status == 403) {
                    toast.show("Forbidden", { type: 'danger' })
                    throw "Forbidden"
                }
                else if (response.status == 404) {
                    toast.show("Not Found", { type: 'danger' })
                    throw "Not Found"
                }
                else if (response.status == 500) {
                    toast.show("Something went wrong", { type: 'danger' })
                    throw "Server Error"
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    searchTextChange = (text) => {
        this.setState({ searchText: text })
    }


    sendDraft = async (draftid, chatid, message) => {
        var drafts = this.state.draftMessages;
        if (drafts.findIndex(data => data.draftID == draftid) == 0) {
            let index = drafts.findIndex(data => data.draftID == draftid)
            drafts[index].time = ""
            this.setState({
                draftMessages: drafts,
                counter: this.state.counter += 1,
            }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
        }
        else if (drafts.findIndex(data => data.draftID == draftid)) {
            let index = drafts.findIndex(data => data.draftID == draftid)
            drafts[index].time = ""
            this.setState({
                draftMessages: drafts,
                counter: this.state.counter += 1,
            }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
        }
        return fetch("http://localhost:3333/api/1.0.0/chat/" + chatid + "/message",
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
                body: JSON.stringify(
                    {
                        "message": message
                    }
                )
            })
            .then((response) => {
                if (response.status == 200) {
                    toast.show("Draft Message Sent", { type: 'success' })
                }
                else if (response.status == 400) {
                    toast.show("Bad Request", { type: 'danger' })
                    throw "Bad Request"
                }
                else if (response.status == 401) {
                    toast.show("Unauthorised", { type: 'danger' })
                    throw "Unauthorised"
                }
                else if (response.status == 403) {
                    toast.show("Forbidden", { type: 'danger' })
                    throw "Forbidden"
                }
                else if (response.status == 404) {
                    toast.show("Not Found", { type: 'danger' })
                    throw "Not Found"
                }
                else if (response.status == 500) {
                    toast.show("Something went wrong", { type: 'danger' })
                    throw "Server Error"
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    checkDraftTimes() {
        var drafts = this.state.draftMessages;
        let date = new Date()
        let time = date
        time.setSeconds(0);
        time.setMilliseconds(0);
        let timeFinal = new Date(time.toISOString())

        for (let i = 0; i < drafts.length; i++) {
            console.log(time)
            let draftDate = new Date(drafts[i].time)
            console.log(draftDate)
            if (draftDate.getTime() == timeFinal.getTime()) {
                let draftid = drafts[i].draftID
                let chatid = drafts[i].chatID
                let message = drafts[i].message
                this.sendDraft(draftid, chatid, message)
            }
            else {
                console.log('not same time')
            }
        }
    }

    async componentDidMount() {
        if (await AsyncStorage.getItem("draftMessages") == 'undefined') {
            await this.setState({
                draftMessages: await AsyncStorage.getItem("draftMessages"),
            })
        }
        else {
            await this.setState({
                draftMessages: JSON.parse(await AsyncStorage.getItem("draftMessages")),
            })
        }

        this.setState({
            isLoading: true,
            userID: await AsyncStorage.getItem("whatsthatID"),
            chatid: this.props.route.params.chatID.toString(),
            members: this.props.route.params.chatMembers,
        })
        this.fetchContacts()
        this.draftTimerID = setInterval(() => { this.checkDraftTimes() }, 10000)

        this.props.navigation.addListener('focus', async () => {
            await this.setState({
                isLoading: true,
            })
            this.fetchContacts()
            this.draftTimerID = setInterval(() => { this.checkDraftTimes() }, 10000)
        });
    }

    componentWillUnmount() {
        clearInterval(this.draftTimerID),
            console.log('unmounted')
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
                                    } else {
                                        return (
                                            <View style={[styles.contactBox,]}>
                                                <View style={[styles.contactInfoBox]}>
                                                    <Text style={[styles.contactInfoName,]}>{item.given_name} {item.family_name}</Text>
                                                    <Text style={[styles.contactInfoEmail,]}>{item.email}</Text>
                                                    <Text style={[styles.contactInfoUserID,]}>User ID: {item.user_id} </Text>
                                                </View>
                                                <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                    <TouchableOpacity onPress={() => { this.addMember(item.user_id) }}>
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
                                {
                                    if (item.user_id == this.state.userID) {
                                    }
                                    else if (this.state.members.findIndex(data => data.user_id == item.user_id) == true) {
                                    }
                                    else {
                                        return (
                                            <View style={[styles.contactBox,]}>
                                                <View style={[styles.contactInfoBox]}>
                                                    <Text style={[styles.contactInfoName,]}>{item.first_name} {item.last_name}</Text>
                                                    <Text style={[styles.contactInfoEmail,]}>{item.email}</Text>
                                                    <Text style={[styles.contactInfoUserID,]}>User ID: {item.user_id} </Text>
                                                </View>
                                                <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                    <TouchableOpacity onPress={() => { this.addMember(item.user_id) }}>
                                                        <Image style={[styles.addContact]} source={require('./images/addcontact.png')} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>)
                                    }
                                }
                            }}
                        />
                    </View>
                </View>
            </View >
        );
    }
}