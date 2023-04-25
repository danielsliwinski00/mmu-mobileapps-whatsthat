import React, { Component } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image, Modal } from 'react-native';
import { TouchableOpacity, ScrollView, TouchableWithoutFeedback, TouchableHighlight } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';

export default class ChatInfo extends Component {
    constructor(props) {

        super(props);
        this.state = {
            userID: '',
            chatData: [],
            chatid: '',
            chatNameModal: false,
            chatNameText: '',
            draftMessages:[],
        }
    }

    async fetchChatData() {
        this.setState({
            isLoading: true,
        })
        return fetch("http://localhost:3333/api/1.0.0/chat/" + this.state.chatid,
            {
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then((response) => {
                if (response.status == 200) {
                    return response.json();
                }
                else if (response.status == 401) {
                    toast.show("Unauthorised", { type: 'danger' })
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
                else {
                    toast.show("Something went wrong", { type: 'danger' })
                    throw "Server Error"
                }
            })
            .then(async (responseJson) => {
                await this.setState({
                    chatData: responseJson,
                })
                this.setState({
                    isLoading: false,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async changeChatName() {
        this.setState({
            isLoading: true,
        })
        return fetch("http://localhost:3333/api/1.0.0/chat/" + this.state.chatid,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
                body: JSON.stringify(
                    {
                        "name": this.state.chatNameText
                    }
                )
            })
            .then((response) => {
                if (response.status == 200) {
                    toast.show("Chat Name Changed", { type: 'success' })
                    this.setState({
                        chatNameText: '',
                        chatNameModal: false
                    }, () => { this.fetchChatData() })
                }
                else if (response.status == 400) {
                    toast.show("Bad Request", { type: 'danger' })
                    throw "Bad Request"
                }
                else if (response.status == 401) {
                    toast.show("Unauthorised", { type: 'danger' })
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
                else {
                    toast.show("Something went wrong", { type: 'danger' })
                    throw "Server Error"
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    addMember() {
        this.props.navigation.navigate('AddMember', { chatID: this.state.chatid, chatMembers: this.state.chatData.members })
    }

    async removeMember(id) {
        this.setState({
            isLoading: true,
        })
        return fetch("http://localhost:3333/api/1.0.0/chat/" + this.state.chatid + "/user/" + id,
            {
                method: 'delete',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    toast.show("Added Member", { type: 'success' })
                    this.fetchChatData();
                    this.setState({
                        isLoading: false,
                    })
                }
                else if (response.status == 400) {
                    toast.show("Bad Request", { type: 'danger' })
                    throw "Bad Request"
                }
                else if (response.status == 401) {
                    toast.show("Unauthorised", { type: 'danger' })
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
                else {
                    toast.show("Something went wrong", { type: 'danger' })
                    throw "Server Error"
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    changeChatNameText = (text) => {
        this.setState({
            chatNameText: text
        })
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

        await this.setState({
            isLoading: true,
            chatid: this.props.route.params.chatID.toString(),
            userID: await AsyncStorage.getItem("whatsthatID"),
        })

        this.fetchChatData();
        this.draftTimerID = setInterval(() => { this.checkDraftTimes() }, 10000)

        this.props.navigation.addListener('focus', async () => {
            await this.setState({
                isLoading: true,
                chatid: this.props.route.params.chatID.toString(),
                userID: await AsyncStorage.getItem("whatsthatID"),
            })
            this.fetchChatData()
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
                            <Text style={[styles.headerText,]}>
                                Chat Info
                            </Text>
                        </View>
                        <View style={[styles.activityIndicatorView]}>
                            <ActivityIndicator style={[styles.activityIndicator]} />
                        </View>
                    </View>
                </View>
            );
        }
        return (
            <View style={[styles.background]}>

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.chatNameModal}
                    onRequestClose={() => {
                        this.setState({ creatingChat: false });
                    }}>
                    <TouchableOpacity
                        style={[styles.modalOpacity]}
                        activeOpacity={1}
                        onPress={() => { this.setState({ creatingChat: false }) }}
                    >
                        <TouchableHighlight style={[styles.modalTouchableHighlight3Button]}>
                            <View style={[styles.modalViewButtons]}>
                                <TextInput
                                    style={[styles.modalTextInput]}
                                    value={this.state.chatNameText}
                                    placeholder='Chat name'
                                    onChangeText={this.changeChatNameText}>
                                </TextInput>
                                <TouchableOpacity
                                    style={[styles.modal3Button]}
                                    onPress={() => {
                                        if (this.state.chatNameText == '') {
                                            this.changeChatName()
                                        }
                                        else {
                                            { this.changeChatName() }
                                        }
                                    }}>
                                    <Text style={[styles.modalButtonText]}>
                                        Change Name
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modal3ButtonCancel]}
                                    onPress={() => { this.setState({ chatNameModal: false }); }}>
                                    <Text style={[styles.modalButtonText]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </Modal>

                <View style={[styles.view]}>
                    <View style={[styles.header]}>
                        <Text style={[styles.headerText]}>Chat Info</Text>
                    </View>
                    <View style={[{ flex: 10, justifyContent: 'flex-start' }]}>
                        <View style={[{ flex: 1, justifyContent: 'flex-start' }]}>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    chatNameModal: true
                                })
                            }}>
                                <Text style={[styles.text, { alignSelf: 'center', fontSize: 30 }]}>{this.state.chatData.name}</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                                <Text style={[styles.text, { alignSelf: 'center' }]}>Chat Members:</Text>
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.addMember() }}>
                                    <Image style={[styles.addContact]} source={require('./images/addcontact.png')} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                bounces={false}
                                data={this.state.chatData.members}
                                scrollsToTop={false}
                                keyExtractor={item => item.user_id}
                                renderItem={({ item }) => {
                                    if (this.state.userID == this.state.chatData.creator.user_id) {
                                        if (item.user_id == this.state.userID) {
                                            return (
                                                <View style={[styles.chatinfoMemberView]}>
                                                    <View style={[styles.chatinfoMemberInfoBox]}>
                                                        <Text style={[styles.contactInfoName]}>{item.first_name} {item.last_name}</Text>
                                                        <Text style={[styles.contactInfoEmail]}>{item.email}</Text>
                                                    </View>
                                                    <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                    </View>
                                                </View>)
                                        }
                                        else {
                                            return (
                                                <View style={[styles.chatinfoMemberView]}>
                                                    <View style={[styles.chatinfoMemberInfoBox]}>
                                                        <Text style={[styles.contactInfoName]}>{item.first_name} {item.last_name}</Text>
                                                        <Text style={[styles.contactInfoEmail]}>{item.email}</Text>
                                                    </View>
                                                    <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                        <TouchableOpacity onPress={() => { this.removeMember(item.user_id) }}>
                                                            <Image style={[styles.addContact]} source={require('./images/removecontact.png')} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>)
                                        }
                                    }
                                    else {
                                        return (
                                            <View style={[styles.chatinfoMemberView]}>
                                                <View style={[styles.chatinfoMemberInfoBox]}>
                                                    <Text style={[styles.contactInfoName]}>{item.first_name} {item.last_name}</Text>
                                                    <Text style={[styles.contactInfoEmail]}>{item.email}</Text>
                                                </View>
                                                <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                </View>
                                            </View>)
                                    }
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}