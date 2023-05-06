import React, { Component } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            contactsData: [],
            searchData: [],
            addingContact: false,
            userID: '',
            searchText: '',
            searchID: '',
            draftMessages: [],
        }
    }

    searchPrep() {
        this.setState({
            isLoading: true,
        })
        this.search();
    }

    async search() {
        return fetch("http://localhost:3333/api/1.0.0/search?limit=50&q=" + this.state.searchText,
            {
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then((response) => {
                if (response.status == 200) {
                    return response.json()
                }
                else if (response.status == 400) {
                    toast.show("Bad Request", { type: 'danger' })
                    throw "Bad Request"
                }
                else if (response.status == 401) {
                    toast.show("Unauthorised", { type: 'danger' })
                    throw "Unauthorized"
                }
                else if (response.status == 500) {
                    toast.show("Server Error", { type: 'danger' })
                    throw "Server Error"
                }
            })
            .then((responseJson) => {
                this.setState({
                    contactsData: responseJson,
                    isLoading: false,
                    searchText: '',
                    searchID: '',
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async addContact(id) {
        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/contact",
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    toast.show("Contact Added", { type: 'success' })
                    this.fetchAccounts();
                    this.setState({
                        searchID: '',
                    })
                    this.props.navigation.pop()
                }
                else if (response.status == 400) {
                    toast.show("You can't add yourself as a contact", { type: 'danger' })
                    throw "You can't add yourself as a contact"
                }
                else if (response.status == 401) {
                    toast.show("Unauthorised", { type: 'danger' })
                    throw "Unauthorized"
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

    async fetchAccounts() {
        return fetch("http://localhost:3333/api/1.0.0/search",
            {
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    return response.json();
                }
                else if (response.status == 400) {
                    toast.show("Unauthorised", { type: 'danger' })
                    throw "Bad Request"
                }
                else if (response.status == 401) {
                    toast.show("Unauthorised", { type: 'danger' })
                    throw "Unauthorised"
                }
                else if (response.status == 500) {
                    toast.show("Something went wrong", { type: 'danger' })
                    throw "Server Error"
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

    searchTextChange = (text) => {
        this.setState({ searchText: text })
    }

    searchIDChange = (text) => {
        this.setState({ searchID: text })
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
            userID: await AsyncStorage.getItem("whatsthatID")
        })
        this.fetchAccounts();
        this.draftTimerID = setInterval(() => { this.checkDraftTimes() }, 10000)

        this.props.navigation.addListener('focus', async () => {
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
                    <View style={[styles.view]}>
                        <View style={[styles.header]}>
                            <Text style={[styles.headerText]}>
                                Search
                            </Text>
                        </View>
                        <View style={[styles.view, { flex: 10, }]}>
                            <ActivityIndicator style={[styles.activityIndicator]} />
                        </View>
                    </View>
                </View>
            );
        }
        return (
            <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
                <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                    <View style={[styles.header]}>
                        <Text style={[styles.headerText]}>
                            Search
                        </Text>
                    </View>
                    <View style={[{ flex: 1, marginTop: 10, marginHorizontal: 10, backgroundColor: 'transparent', flexDirection: 'column' }]}>
                        <TextInput style={[styles.contactSearch, { alignSelf: 'center', width: 340, marginRight: 0, fontSize: 20, color: '#000000', }]}
                            placeholder='Search name lastname or email'
                            onChangeText={this.searchTextChange}
                            onSubmitEditing={() => this.searchPrep()}>
                        </TextInput>
                    </View>
                    <View style={[{ flex: 1, marginTop: -25, backgroundColor: 'transparent' }]}>
                        <Text style={[styles.text, { alignSelf: 'center', fontSize: 20 }]}>Your User ID: {this.state.userID}</Text>
                    </View>
                    <View style={[{ flex: 9, justifyContent: 'flex-start' }]}>
                        <FlatList
                            data={this.state.contactsData}
                            keyExtractor={item => item.user_id}
                            renderItem={({ item }) => {
                                if (item.user_id != this.state.userID) {
                                    return (
                                        <View style={[{ flex: 1, flexDirection: 'row', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                            <View style={[{ flex: 8, alignSelf: 'flex-start' }]}>
                                                <Text style={[styles.text, { marginTop: 10, marginLeft: 10, fontSize: 25 }]}> {item.given_name} {item.family_name} </Text>
                                                <Text style={[styles.text, { marginTop: 2, marginLeft: 10, fontSize: 18 }]}> {item.email} </Text>
                                                <Text style={[styles.text, { marginTop: 2, marginLeft: 10, fontSize: 15 }]}> User ID: {item.user_id} </Text>
                                            </View>
                                            <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                <TouchableOpacity onPress={() => { this.addContact(item.user_id) }}>
                                                    <Image style={[styles.addContact]} source={require('./images/addcontact.png')} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>)
                                } else {
                                    return
                                }
                            }}
                        />
                    </View>
                </View>
            </View >)
    }
}