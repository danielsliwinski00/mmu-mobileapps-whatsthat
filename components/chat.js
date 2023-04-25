import React, { Component, useEffect } from 'react';
import { TouchableOpacity, Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image, Modal, TouchableHighlight } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';

export default class Chat extends Component {
    constructor(props) {

        super(props);
        this.state = {
            isLoading: true,
            chatData: [],
            messagesData: [],
            chatid: '',
            contactsData: [],
            creatingChat: false,
            userID: '',
            createChatName: '',
            sendMessageText: '',
            page: 0,
            viewableMessagesData: [],
            messageID: '',
            modalVisible: false,
            messageInfoModal: false,
            editMessageText: '',
            confirmDeleteModal: false,
            editMessageModal: false,
            refresh: false,
            newMessagesData: [],
            oldChatName: '',
            newChatName: '',
            draftMessageModal: false,
            draftMessageModalDetails: false,
            loadDraftMessageModal: false,
            draftMessageText: '',
            draftMessages: [],
            draftMessageID: 0,
            viewDraftMessagesModal: false,
            editDraftMessageModal: false,
            scheduleDraftMessage: false,
            counter: 0,
            date: new Date(),
            datepick: false,
            time: undefined,
            timepick: false,
            month: '',
            day: '',
            hour: '',
            minute: '',

        }
    }

    async fetchChatData() {
        this.setState({
            isLoading: true,
            messagesData: [],
            viewableMessagesData: [],
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
                    oldChatName: responseJson.name,
                    messagesData: responseJson.messages,
                }, () => { this.addMessagesData(0) }
                )
                this.setState({
                    isLoading: false,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async fetchChatDataUpdate() {
        this.setState({
            newMessagesData: [],
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
                    newChatName: responseJson.name,
                    newMessagesData: responseJson.messages,
                }, () => { this.updateChatName(), this.addNewMessages() }
                )
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async sendMessage() {
        this.setState({
            isLoading: true,
        })
        return fetch("http://localhost:3333/api/1.0.0/chat/" + this.state.chatid + "/message",
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
                body: JSON.stringify(
                    {
                        "message": this.state.sendMessageText
                    }
                )
            })
            .then((response) => {
                if (response.status == 200) {
                    this.setState({
                        sendMessageText: '',
                    }, () => { this.fetchChatData() })
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

    async editMessageRequest() {
        this.setState({
            isLoading: true,
        })
        return fetch("http://localhost:3333/api/1.0.0/chat/" + this.state.chatid + "/message/" + this.state.messageID,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
                body: JSON.stringify(
                    {
                        "message": this.state.editMessageText
                    }
                )
            })
            .then((response) => {
                if (response.status == 200) {
                    toast.show("Message Edited", { type: 'success' })
                    this.setState({
                        editMessageText: '',
                        messageID: '',
                    })
                    this.fetchChatData()
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

    async deleteMessageRequest() {
        this.setState({
            isLoading: true,
        })
        return fetch("http://localhost:3333/api/1.0.0/chat/" + this.state.chatid + "/message/" + this.state.messageID,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
            })
            .then((response) => {
                if (response.status == 200) {
                    toast.show("Message Deleted", { type: 'success' })
                    this.setState({
                        messageID: '',
                    })
                    this.fetchChatData()
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

    async saveDraftMessage() {
        if (this.state.draftMessages == 'undefined') {
            let id = 0
            var obj = {}
            obj.draftID = id
            obj.message = this.state.sendMessageText

            var arr = new Array()
            arr[0] = obj
            this.setState({
                draftMessages: arr
            }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
        }
        else if (this.state.draftMessages.length <= 0) {
            let id = 0
            var obj = {}
            obj.draftID = id
            obj.message = this.state.sendMessageText

            var arr = new Array()
            arr[0] = obj
            this.setState({
                draftMessages: arr
            }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
        }
        else {
            console.log("not here")
            let index = this.state.draftMessages.length - 1;
            let id = this.state.draftMessages[index].draftID;
            id += 1;

            var obj = {}
            obj.draftID = id
            obj.message = this.state.sendMessageText
            var arr = this.state.draftMessages
            arr.push(obj)

            console.log(this.state.draftMessages)

            console.log(arr)

            this.setState({
                draftMessages: arr,
                counter: this.state.counter += 1
            }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
        }
    }

    loadDraftMessage() {
        var drafts = this.state.draftMessages

        if (drafts.findIndex(data => data.draftID == this.state.draftMessageID) == 0) {
            let index = drafts.findIndex(data => data.draftID == this.state.draftMessageID)
            this.setState({
                sendMessageText: drafts[index].message,
            })
        }
        else if (drafts.findIndex(data => data.draftID == this.state.draftMessageID)) {
            let index = drafts.findIndex(data => data.draftID == this.state.draftMessageID)
            this.setState({
                sendMessageText: drafts[index].message,
            })
        }
    }

    deleteDraftMessage() {
        var drafts = this.state.draftMessages
        if (drafts.findIndex(data => data.draftID == this.state.draftMessageID) == 0) {
            let index = drafts.findIndex(data => data.draftID == this.state.draftMessageID)
            drafts.splice(index, 1)
            this.setState({
                draftMessages: drafts,
                counter: this.state.counter += 1
            }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
        }
        else if (drafts.findIndex(data => data.draftID == this.state.draftMessageID)) {
            let index = drafts.findIndex(data => data.draftID == this.state.draftMessageID)
            drafts.splice(index, 1)
            this.setState({
                draftMessages: drafts,
                counter: this.state.counter += 1
            }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
        }
    }

    editDraftMessage() {
        var drafts = this.state.draftMessages
        if (drafts.findIndex(data => data.draftID == this.state.draftMessageID) == 0) {
            let index = drafts.findIndex(data => data.draftID == this.state.draftMessageID)
            drafts[index].message = this.state.draftMessageText
            this.setState({
                draftMessages: drafts,
                counter: this.state.counter += 1,
                editDraftMessageModal: false,
                viewDraftMessagesModal: true
            }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
        }
        else if (drafts.findIndex(data => data.draftID == this.state.draftMessageID)) {
            let index = drafts.findIndex(data => data.draftID == this.state.draftMessageID)
            drafts[index].message = this.state.draftMessageText
            this.setState({
                draftMessages: drafts,
                counter: this.state.counter += 1,
                editDraftMessageModal: false,
                viewDraftMessagesModal: true
            }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
        }
    }

    timeDraft() {
        const current = new Date()
        let yearTime = current.getFullYear()
        let yearString = yearTime.toString()
        let inputTime = new Date(yearString + "-" + this.state.month + "-" + this.state.day + "T" + this.state.hour + ":" + this.state.minute + ":00")

        var drafts = this.state.draftMessages;
        if (drafts.findIndex(data => data.draftID == this.state.draftMessageID) == 0) {
            let index = drafts.findIndex(data => data.draftID == this.state.draftMessageID)
            drafts[index]['time'] = inputTime;
            drafts[index]['chatID'] = this.state.chatid;
            this.setState({
                draftMessages: drafts,
                counter: this.state.counter += 1,
                editDraftMessageModal: false,
                viewDraftMessagesModal: true
            }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
        }
        else if (drafts.findIndex(data => data.draftID == this.state.draftMessageID)) {
            let index = drafts.findIndex(data => data.draftID == this.state.draftMessageID)
            drafts[index]['time'] = inputTime;
            drafts[index]['chatID'] = this.state.chatid;
            this.setState({
                draftMessages: drafts,
                counter: this.state.counter += 1,
                editDraftMessageModal: false,
                viewDraftMessagesModal: true
            }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
        }
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
                    this.fetchChatData()
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

    onChangeMonth(input) {
        input = input.replace(/[^0-9]/g, '')
        this.setState({
            month: input
        });
    }
    onChangeDay(input) {
        input = input.replace(/[^0-9]/g, '')
        this.setState({
            day: input
        });
    }
    onChangeHour(input) {
        input = input.replace(/[^0-9]/g, '')
        this.setState({
            hour: input
        });
    }
    onChangeMinute(input) {
        input = input.replace(/[^0-9]/g, '')
        this.setState({
            minute: input
        });
    }

    changeMessageText = (text) => {
        this.setState({
            sendMessageText: text
        })
    }

    draftMessageTextChange = (text) => {
        this.setState({
            draftMessageText: text
        })
    }

    editMessageTextChange = (text) => {
        this.setState({
            editMessageText: text
        })
    }

    updateChatName() {
        if (this.state.oldChatName !== this.state.newChatName) {
            this.setState({ oldChatName: this.state.newChatName })
        }
    }

    compareMessages() {
        var oldMessages = this.state.messagesData
        const newMessages = this.state.newMessagesData


        if (oldMessages.length !== newMessages.length) {
            if (oldMessages.length > newMessages.length) {
                this.setState({
                    messagesData: this.state.newMessagesData,
                    viewableMessagesData: [],
                }, () => { this.addMessagesData(0) })
            }
            this.setState({
                messagesData: this.state.newMessagesData
            })
        }
        else {
            for (var i = 0; i < this.state.newMessagesData.length; i++) {
                if (oldMessages[i].message_id == newMessages[i].message_id) {
                    if (oldMessages[i].message !== newMessages[i].message) {
                        oldMessages[i].message = newMessages[i].message
                    }
                }
                this.setState({
                    messagesData: this.state.newMessagesData
                })
            }
            this.setState({
                messagesData: oldMessages
            })
        }
    }

    addNewMessages() {
        const showMessages = []
        console.log(this.state.messagesData.length, this.state.newMessagesData.length, this.state.messagesData[0], this.state.newMessagesData[0])
        for (var i = this.state.messagesData.length; i < this.state.newMessagesData.length; i++) {
            showMessages.push(this.state.newMessagesData[0])
        }
        this.setState({
            viewableMessagesData: [...showMessages, ...this.state.viewableMessagesData],
            messagesData: [...showMessages, ...this.state.messagesData]
        })
        this.compareMessages()
    }

    addMessagesData = (page) => {
        const newMessagesData = []
        for (var i = page * 20, imax = i + 20; i < imax && i < this.state.messagesData.length; i++) {
            newMessagesData.push(this.state.messagesData[i]);
        }
        this.setState({
            viewableMessagesData: [...this.state.viewableMessagesData, ...newMessagesData]
        })
    }

    onScrollHandler = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            this.addMessagesData(this.state.page)
        })
    }

    timestampToString = (timestamp) => {
        let currentDate = new Date();
        var date = new Date(timestamp)

        var interval = currentDate - date
        var mili = 60 * 1000;

        interval = interval / mili

        interval = interval //minutes

        if (interval / 60 / 24 < 1) { //if (minutes/ hours/) days is less than 1
            if (interval / 60 % 1 == 0) { //if no minutes
                interval = interval / 60
                switch (true) {
                    case Math.round(interval) == 1:
                        return (Math.round(interval) + " hour ago")
                    case Math.round(interval) > 1:
                        return (Math.round(interval) + " hours ago")
                }
            }
            else if (interval / 60 < 1) { // if only minutes
                interval = interval % 60
                switch (true) {
                    case Math.round(interval) == 1:
                        return (Math.round(interval) + " minute ago")
                    case Math.round(interval) > 1:
                        return (Math.round(interval) + " minutes ago")
                    case Math.round(interval) < 1:
                        return ("Just now")
                }
            }
            else {
                let hours = (Math.round(interval / 60))
                let minutes = (Math.round(interval % 60))
                switch (true) {
                    case hours == 1 && minutes == 1:
                        return (hours + " hour " + minutes + " minute ago")
                    case hours == 1:
                        return (hours + " hour " + minutes + " minutes ago")
                    case minutes == 1:
                        return (hours + " hours " + minutes + " minute ago")
                    case hours > 1 && minutes > 1:
                        return (hours + " hours " + minutes + " minutes ago")
                }
            }
        }
        else if (interval / 60 % 24 == 0) { //days leftover is 0
            switch (true) {
                case interval == 1:
                    return (Math.round(interval) + " day ago")
                case interval > 1:
                    return (Math.round(interval) + " days ago")
            }
        }
        else if (interval / 60 % 24 > 0 && interval / 60 < 24) { //days leftover is more than 0 and hours is less than 1 day
            interval = interval % 60;

            switch (true) {
                case interval == 1:
                    return (Math.round(interval) + " hour ago")
                case interval > 1:
                    return (Math.round(interval) + " hours ago")
            }
        }
        else {
            let days = Math.round(interval / 60 / 24); //get days 
            let hours = Math.round(interval / 60 % 24) //get hours leftover

            switch (true) {
                case days == 1 && hours == 1:
                    return (days + " day " + hours + " hour ago")
                case days == 1:
                    return (days + " day " + hours + " hours ago")
                case hours == 1:
                    return (days + " days " + hours + " hour ago")
                case days > 1 && hours > 1:
                    return (days + " days " + hours + " hours ago")
            }
        }
    }

    async componentDidMount() {
        if (await AsyncStorage.getItem("draftMessages") == 'undefined') {
            await this.setState({
                isLoading: true,
                chatid: this.props.route.params.chatID.toString(),
                userID: await AsyncStorage.getItem("whatsthatID"),
                draftMessages: await AsyncStorage.getItem("draftMessages"),
            })
        }
        else {
            await this.setState({
                isLoading: true,
                chatid: this.props.route.params.chatID.toString(),
                userID: await AsyncStorage.getItem("whatsthatID"),
                draftMessages: JSON.parse(await AsyncStorage.getItem("draftMessages")),
            })
        }

        this.fetchChatData()
        this.timerID = setInterval(() => { this.fetchChatDataUpdate() }, 2000)
        this.draftTimerID = setInterval(() => { this.checkDraftTimes() }, 10000)

        this.props.navigation.addListener('focus', async () => {
            await this.setState({
                isLoading: true,
            })
            this.fetchChatData()
            this.timerID = setInterval(() => { this.fetchChatDataUpdate() }, 2000)
            this.draftTimerID = setInterval(() => { this.checkDraftTimes() }, 10000)
        });
    }

    componentWillUnmount() {
        clearInterval(this.timerID),
        clearInterval(this.draftTimerID),
        console.log('unmounted')
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <View style={[styles.background]}>
                    <View style={[styles.view]}>
                        <View style={[styles.header, { flex: 2 }]}>
                            <View style={[styles.chatChatNameView]}>
                                <Text style={[styles.chatChatName]}
                                    numberOfLines={1}
                                    ellipsizeMode='tail'>
                                    {this.state.oldChatName}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.view, { flex: 7, }]}>
                            <ActivityIndicator style={[styles.activityIndicator]} />
                        </View>
                        <View style={[styles.sendMessageView,]}>
                            <TouchableOpacity onLongPress={() => { this.setState({ draftMessageModal: true }) }}>
                                <TextInput
                                    onSubmitEditing={() => { if (this.state.sendMessageText == '') { } else { this.sendMessage(this.state.sendMessageText) } }}
                                    value={this.state.sendMessageText}
                                    style={[styles.sendMessageTextInput,]}
                                    placeholder='Aa'
                                    onChangeText={this.changeMessageText}>
                                </TextInput>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.sendMessageButton,]}
                                onPress={() => { if (this.state.sendMessageText == '') { } else { this.sendMessage(this.state.sendMessageText) } }}>
                                <Text style={[styles.sendMessageButtonText,]}>
                                    Send
                                </Text>
                            </TouchableOpacity>
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
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false });
                    }}>
                    <TouchableOpacity
                        style={[styles.modalOpacity]}
                        activeOpacity={1}
                        onPress={() => { this.setState({ modalVisible: false }) }}
                    >
                        <TouchableHighlight style={[styles.modalTouchableHighlight2Button]}>
                            <View style={[styles.modalViewButtons]}>
                                <TouchableOpacity
                                    style={[styles.modal2Button]}
                                    onPress={() => {
                                        this.setState({ modalVisible: false }),
                                            clearInterval(this.timerId),
                                            this.props.navigation.navigate('ChatInfo', { chatID: this.state.chatid })
                                    }}
                                >
                                    <Text style={[styles.modalButtonText]}>
                                        View Chat Info
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modal2ButtonCancel]}
                                    onPress={() => { this.setState({ modalVisible: false }); }}>
                                    <Text style={[styles.modalButtonText,]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.editDraftMessageModal}
                    onRequestClose={() => {
                        this.setState({ editDraftMessageModal: false });
                    }}>
                    <TouchableOpacity
                        style={[styles.modalOpacity]}
                        activeOpacity={1}
                        onPress={() => { this.setState({ editDraftMessageModal: false }) }}
                    >
                        <TouchableHighlight style={[styles.modalTouchableHighlight3Button]}>
                            <View style={[styles.modalViewButtons]}>
                                <TextInput
                                    style={[styles.modalTextInput]}
                                    value={this.state.draftMessageText}
                                    placeholder=''
                                    onChangeText={this.draftMessageTextChange}>
                                </TextInput>
                                <TouchableOpacity
                                    style={[styles.modal3Button]}
                                    onPress={() => { this.editDraftMessage() }}>
                                    <Text style={[styles.modalButtonText]}>
                                        Confirm Edit
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modal3ButtonCancel]}
                                    onPress={() => { this.setState({ editDraftMessageModal: false, draftMessageModalDetails: true }) }}>
                                    <Text style={[styles.modalButtonText,]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.scheduleDraftMessage}
                    onRequestClose={() => {
                        this.setState({ scheduleDraftMessage: false });
                    }}>
                    <TouchableOpacity
                        style={[styles.modalOpacity]}
                        activeOpacity={1}
                        onPress={() => { this.setState({ scheduleDraftMessage: false }) }}
                    >
                        <TouchableHighlight style={[styles.modalTouchableHighlight3Button]}>
                            <View style={[styles.modalViewButtons,]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextInput
                                        style={{ width: '20%', marginLeft: 10, marginTop: 10 }}
                                        placeholder='Month 01-12'
                                        value={this.state.month}
                                        onChangeText={(text) => this.onChangeMonth(text)}
                                    />
                                    <TextInput
                                        style={{ width: '20%', marginLeft: 10, marginTop: 10 }}
                                        placeholder='Day 01-31'
                                        value={this.state.day}
                                        onChangeText={(text) => this.onChangeDay(text)}
                                    />
                                    <TextInput
                                        style={{ width: '20%', marginLeft: 10, marginTop: 10 }}
                                        placeholder='Hour 00-23'
                                        value={this.state.hour}
                                        onChangeText={(text) => this.onChangeHour(text)}
                                    />
                                    <TextInput
                                        style={{ width: '20%', marginLeft: 10, marginTop: 10 }}
                                        placeholder='Minute 00-59'
                                        value={this.state.minute}
                                        onChangeText={(text) => this.onChangeMinute(text)}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[styles.modal3Button]}
                                    onPress={() => { this.timeDraft(), this.setState({ scheduleDraftMessage: false, }) }}>
                                    <Text style={[styles.modalButtonText]}>
                                        Confirm
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modal3ButtonCancel, {}]}
                                    onPress={() => { this.setState({ scheduleDraftMessage: false, draftMessageModalDetails: true }) }}>
                                    <Text style={[styles.modalButtonText,]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.draftMessageModalDetails}
                    onRequestClose={() => {
                        this.setState({ draftMessageModalDetails: false });
                    }}>
                    <TouchableOpacity
                        style={[styles.modalOpacity]}
                        activeOpacity={1}
                        onPress={() => { this.setState({ draftMessageModalDetails: false }) }}
                    >
                        <TouchableHighlight style={[styles.modalTouchableHighlight5Button]}>
                            <View style={[styles.modalViewButtons,]}>
                                <TouchableOpacity
                                    style={[styles.modal5Button]}
                                    onPress={() => { this.setState({ editDraftMessageModal: true, draftMessageModalDetails: false }) }}>
                                    <Text style={[styles.modalButtonText]}>
                                        Edit draft message
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modal5Button]}
                                    onPress={() => { this.loadDraftMessage(), this.setState({ draftMessageModalDetails: false, }) }}>
                                    <Text style={[styles.modalButtonText]}>
                                        Load draft message
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modal5Button]}
                                    onPress={() => { this.deleteDraftMessage(), this.setState({ draftMessageModalDetails: false, }) }}>
                                    <Text style={[styles.modalButtonText]}>
                                        Delete draft message
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modal5Button]}
                                    onPress={() => { this.setState({ scheduleDraftMessage: true, draftMessageModalDetails: false, }) }}>
                                    <Text style={[styles.modalButtonText]}>
                                        Send draft message at
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modal5ButtonCancel, {}]}
                                    onPress={() => { this.setState({ draftMessageModalDetails: false, viewDraftMessagesModal: true }) }}>
                                    <Text style={[styles.modalButtonText,]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.viewDraftMessagesModal}
                    onRequestClose={() => {
                        this.setState({ viewDraftMessagesModal: false });
                    }}>
                    <TouchableOpacity
                        style={[styles.modalOpacity]}
                        activeOpacity={1}
                        onPress={() => { this.setState({ viewDraftMessagesModal: false }) }}
                    >
                        <TouchableHighlight style={[styles.modalTouchableHighlight4Button]}>
                            <View style={[styles.modalViewButtons,]}>
                                <FlatList
                                    style={[{ backgroundColor: '#00000020' }]}
                                    extraData={this.state.counter}
                                    bounces={false}
                                    data={this.state.draftMessages}
                                    scrollsToTop={false}
                                    keyExtractor={item => item.draftID}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity onPress={() => {
                                                this.setState({
                                                    draftMessageModalDetails: true,
                                                    viewDraftMessagesModal: false,
                                                    draftMessageID: item.draftID,
                                                    draftMessageText: item.message
                                                })
                                            }} style={[styles.box, { borderWidth: 2, backgroundColor: '#ffffff' }]}>
                                                <Text style={[styles.text, { marginTop: 10, fontSize: 25 }]}>{item.message}</Text>
                                            </TouchableOpacity>)
                                    }}
                                />
                                <TouchableOpacity
                                    style={[styles.modal4ButtonCancel, { marginBottom: '1%' }]}
                                    onPress={() => { this.setState({ viewDraftMessagesModal: false, draftMessageModal: true }) }}>
                                    <Text style={[styles.modalButtonText,]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.draftMessageModal}
                    onRequestClose={() => {
                        this.setState({ draftMessageModal: false });
                    }}>
                    <TouchableOpacity
                        style={[styles.modalOpacity]}
                        activeOpacity={1}
                        onPress={() => { this.setState({ draftMessageModal: false }) }}
                    >
                        <TouchableHighlight style={[styles.modalTouchableHighlight3Button]}>
                            <View style={[styles.modalViewButtons]}>
                                <TouchableOpacity
                                    style={[styles.modal3Button]}
                                    onPress={() => { this.saveDraftMessage(), this.setState({ draftMessageModal: false, }) }}>
                                    <Text style={[styles.modalButtonText]}>
                                        Save as draft message
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modal3Button]}
                                    onPress={() => { this.setState({ draftMessageModal: false, viewDraftMessagesModal: true }) }}>
                                    <Text style={[styles.modalButtonText]}>
                                        View draft messages
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modal3ButtonCancel]}
                                    onPress={() => { this.setState({ draftMessageModal: false, }) }}>
                                    <Text style={[styles.modalButtonText,]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.editMessageModal}
                    onRequestClose={() => {
                        this.setState({ editMessageModal: false });
                    }}>
                    <TouchableOpacity
                        style={[styles.modalOpacity]}
                        activeOpacity={1}
                        onPress={() => { this.setState({ editMessageModal: false }) }}
                    >
                        <TouchableHighlight style={[styles.modalTouchableHighlight3Button]}>
                            <View style={[styles.modalViewButtons]}>
                                <TextInput
                                    style={[styles.modalTextInput]}
                                    value={this.state.editMessageText}
                                    placeholder=''
                                    onChangeText={this.editMessageTextChange}>
                                </TextInput>
                                <TouchableOpacity
                                    style={[styles.modal3Button]}
                                    onPress={() => { this.editMessageRequest(), this.setState({ editMessageModal: false, }) }}>
                                    <Text style={[styles.modalButtonText]}>
                                        Confirm Edit
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modal3ButtonCancel}
                                    onPress={() => { this.setState({ editMessageModal: false, messageInfoModal: true }) }}>
                                    <Text style={[styles.modalButtonText,]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.confirmDeleteModal}
                    onRequestClose={() => {
                        this.setState({ confirmDeleteModal: false });
                    }}>
                    <TouchableOpacity
                        style={[styles.modalOpacity]}
                        activeOpacity={1}
                        onPress={() => { this.setState({ confirmDeleteModal: false }) }}
                    >
                        <TouchableHighlight style={[styles.modalTouchableHighlight2Button]}>
                            <View style={[styles.modalViewButtons,]}>
                                <View style={{ flex: 1, textAlign: 'center', marginTop: '5%' }}>
                                    <Text style={[styles.modalButtonText]}>
                                        Are you sure you wish to delete this message?
                                    </Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={[styles.modalYesNoButton]}
                                        onPress={() => { this.deleteMessageRequest(), this.setState({ confirmDeleteModal: false, }) }}>
                                        <Text style={[styles.modalButtonText]}>
                                            Yes
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalYesNoButton]}
                                        onPress={() => { this.setState({ confirmDeleteModal: false, messageInfoModal: true }) }}>
                                        <Text style={[styles.modalButtonText]}>
                                            No
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.messageInfoModal}
                    onRequestClose={() => {
                        this.setState({ messageInfoModal: false, messageID: '', editMessageText: '', });
                    }}>
                    <TouchableOpacity
                        style={[styles.modalOpacity,]}
                        activeOpacity={1}
                        onPress={() => { this.setState({ messageInfoModal: false }) }}
                    >
                        <TouchableHighlight style={[styles.modalTouchableHighlight3Button]}>
                            <View style={[styles.modalViewButtons]}>
                                <TouchableOpacity
                                    style={[styles.modal3Button,]}
                                    onPress={() => { this.setState({ messageInfoModal: false, editMessageModal: true, }) }}>
                                    <Text style={[styles.modalButtonText,]}>
                                        Edit Message
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modal3Button,]}
                                    onPress={() => { this.setState({ messageInfoModal: false, confirmDeleteModal: true }) }}>
                                    <Text style={[styles.modalButtonText,]}>
                                        Delete Message
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modal3ButtonCancel,]}
                                    onPress={() => { this.setState({ messageInfoModal: false }); }}>
                                    <Text style={[styles.modalButtonText]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </Modal>

                <View style={[styles.view]}>
                    <View style={[styles.header, { flex: 2 }]}>
                        <View style={[styles.chatChatNameView,]}>
                            <Text style={[styles.chatChatName,]}
                                numberOfLines={1}
                                ellipsizeMode='tail'>
                                {this.state.oldChatName}
                            </Text>
                        </View>
                        <View style={[{ flex: 1, flexDirection: 'row' }]}>
                            <Text style={[styles.chatChatCreator,]}
                                numberOfLines={1}
                                ellipsizeMode='tail'>
                                Chat Creator: {this.state.chatData.creator.first_name} {this.state.chatData.creator.last_name}
                            </Text>
                            <TouchableOpacity
                                style={[styles.chatOptionsButton,]}
                                onPress={() => { this.setState({ modalVisible: true, }) }}>
                                <Image style={[styles.contactOptions, { transform: [{ rotate: '90deg' }] }]} source={require('./images/optionsg.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[{ flex: 7, justifyContent: 'flex-start' }]}>
                        <View style={[{ flex: 1, justifyContent: 'flex-start' }]}>
                            <FlatList
                                extraData={this.state.viewableMessagesData}
                                bounces={false}
                                data={this.state.viewableMessagesData}
                                inverted
                                onEndReached={this.onScrollHandler}
                                onEndThreshold={0}
                                scrollsToTop={false}

                                keyExtractor={item => item.message_id}
                                renderItem={({ item }) => {
                                    if (item.author.user_id == this.state.userID) {
                                        return (
                                            <TouchableOpacity onLongPress={() => {
                                                this.setState({
                                                    messageInfoModal: true,
                                                    messageID: item.message_id.toString(),
                                                    editMessageText: item.message
                                                })
                                            }}>
                                                <View style={[{ flexDirection: 'row' }]}>
                                                    <View style={[{ flex: 1, }]}></View>
                                                    <View style={[styles.userMessageView]}>
                                                        <Text style={[styles.messageMessage,]}>{item.message}</Text>
                                                        <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                                            <Text style={[styles.messageTimestamp,]}>
                                                                {this.timestampToString(item.timestamp)}
                                                            </Text>
                                                            <Text style={[styles.messageAuthor,]}>
                                                                {item.author.first_name}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>)
                                    }
                                    else {
                                        return (
                                            <View style={[{ flexDirection: 'row' }]}>
                                                <View style={[styles.replyMessageView,]}>
                                                    <Text style={[styles.messageMessage,]}>{item.message}</Text>
                                                    <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                                        <Text style={[styles.messageTimestamp,]}>
                                                            {this.timestampToString(item.timestamp)}
                                                        </Text>
                                                        <Text style={[styles.messageAuthor]}>
                                                            {item.author.first_name}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={[{ flex: 1, }]}></View>
                                            </View>
                                        )
                                    }
                                }}
                            />
                        </View>
                    </View>
                    <View style={[styles.sendMessageView,]}>
                        <TouchableOpacity onLongPress={() => { this.setState({ draftMessageModal: true }) }}>
                            <TextInput
                                onSubmitEditing={() => { if (this.state.sendMessageText == '') { } else { this.sendMessage(this.state.sendMessageText) } }}
                                value={this.state.sendMessageText}
                                style={[styles.sendMessageTextInput,]}
                                placeholder='Aa'
                                onChangeText={this.changeMessageText}>
                            </TextInput>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.sendMessageButton,]}
                            onPress={() => { if (this.state.sendMessageText == '') { } else { this.sendMessage(this.state.sendMessageText) } }}>
                            <Text style={[styles.sendMessageButtonText,]}>
                                Send
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        )
    }
}