import React, { Component } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';

export default class Blocked extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            contactsData: [],
            addingContact: false,
            userID: '',
            draftMessages:[],
        }
    }

    async unblockContact(id) {
        this.setState({
            isLoading: true,
        })
        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/block",
            {
                method: 'delete',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    toast.show("User Unblocked", { type: 'success' })
                    this.fetchAccounts();
                    this.setState({
                        isLoading: false,
                    })
                    this.props.navigation.pop()
                }
                else if (response.status == 400) {
                    toast.show("You can't block yourself", { type: 'danger' })
                    throw "You can't block yourself"
                }
                else if (response.status == 401) {
                    toast.show("Unauthorized", { type: 'danger' })
                    throw "Unauthorized"
                }
                else if (response.status == 404) {
                    toast.show("Not Found", { type: 'danger' })
                    throw "Not Found"
                }
                else {
                    toast.show("Something went wrong", { type: 'danger' })
                    throw "Server Error"
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async fetchAccounts() {
        return fetch("http://localhost:3333/api/1.0.0/blocked",
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
                else {
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
                else {
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
                                Blocked List
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
            <View style={[styles.background]}>
                <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                    <View style={[styles.header]}>
                        <Text style={[styles.headerText]}>
                            Blocked List
                        </Text>
                    </View>
                    <View style={[{ flex: 10, justifyContent: 'flex-start' }]}>
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
                </View>
            </View >)
    }
}