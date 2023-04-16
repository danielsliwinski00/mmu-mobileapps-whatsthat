import React, { Component, useEffect } from 'react';
import { TouchableOpacity, Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image, Modal } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';

function timer() {

}

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
            oldChatName:'',
            newChatName:'',
        }
    }

    async fetchChatData() {
        this.setState({
            isLoading: true,
            messagesData: [],
            viewableMessagesData: [],
        })
        return fetch("http://192.168.1.209:3333/api/1.0.0/chat/" + this.state.chatid,
            {
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then((response) => {
                if (response.status == 200) {
                    return response.json();
                }
                else if (response.status == 401) {
                    throw "Unauthorized"
                }
                else {
                    throw "Something went wrong"
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
        return fetch("http://192.168.1.209:3333/api/1.0.0/chat/" + this.state.chatid,
            {
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then((response) => {
                if (response.status == 200) {
                    return response.json();
                }
                else if (response.status == 401) {
                    throw "Unauthorized"
                }
                else {
                    throw "Something went wrong"
                }
            })
            .then(async (responseJson) => {
                await this.setState({
                    newChatName: responseJson.name,
                    newMessagesData: responseJson.messages,
                }, () => {this.updateChatName(), this.addNewMessages() }
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
        return fetch("http://192.168.1.209:3333/api/1.0.0/chat/" + this.state.chatid + "/message",
            {
                method: 'post',
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
                    //this.fetchChatData();
                }
                else if (response.status == 400) {
                    throw "Bad Request"
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

    async editMessageRequest() {
        this.setState({
            isLoading: true,
        })
        return fetch("http://192.168.1.209:3333/api/1.0.0/chat/" + this.state.chatid + "/message/" + this.state.messageID,
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
                    this.setState({
                        editMessageText: '',
                        messageID: '',
                    })
                    this.fetchChatData()
                }
                else if (response.status == 400) {
                    throw "Bad Request"
                }
                else if (response.status == 401) {
                    throw "Unauthorised"
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

    async deleteMessageRequest() {
        this.setState({
            isLoading: true,
        })
        return fetch("http://192.168.1.209:3333/api/1.0.0/chat/" + this.state.chatid + "/message/" + this.state.messageID,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
            })
            .then((response) => {
                if (response.status == 200) {
                    this.setState({
                        messageID: '',
                    })
                    this.fetchChatData()
                }
                else if (response.status == 400) {
                    throw "Bad Request"
                }
                else if (response.status == 401) {
                    throw "Unauthorised"
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

    changeMessageText = (text) => {
        this.setState({
            sendMessageText: text
        })
    }

    editMessageTextChange = (text) => {
        this.setState({
            editMessageText: text
        })
    }

    updateChatName(){
        if(this.state.oldChatName !== this.state.newChatName){
            this.setState({oldChatName: this.state.newChatName})
        }
    }

    compareMessages() {
        var oldMessages = this.state.messagesData
        const newMessages = this.state.newMessagesData


        if (oldMessages.length !== newMessages.length) {
            if(oldMessages.length > newMessages.length){
                this.setState({
                    messagesData: this.state.newMessagesData,
                    viewableMessagesData: [],
                },()=>{ this.addMessagesData(0)})
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
                    case interval == 1:
                        return (Math.round(interval) + " hour ago")
                    case interval > 1:
                        return (Math.round(interval) + " hours ago")
                }
            }
            else if (interval / 60 < 1) { // if only minutes
                interval = interval % 60
                switch (true) {
                    case Math.round(interval) == 0.6:
                        return (Math.round(interval) + " minute ago")
                    case interval > 0.6:
                        return (Math.round(interval) + " minutes ago")
                    case interval < 0.6:
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
        await this.setState({
            isLoading: true,
            chatid: this.props.route.params.chatID.toString(),
            userID: await AsyncStorage.getItem("whatsthatID"),
        })

        this.fetchChatData()
        this.timerId = setInterval(() => { this.fetchChatDataUpdate() }, 2000)

        this.props.navigation.addListener('focus', async () => {
            await this.setState({
                isLoading: true,
            })
            this.fetchChatData()
            this.timerId = setInterval(() => { this.fetchChatDataUpdate() }, 2000)
        });
    }

    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <View style={[{ flex: 1, backgroundColor: '#FDE2F340' }]}>
                    <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                        <View style={[styles.header, { flex: 2}]}>
                            <View style={[{ flex: 1, marginLeft: 55, marginRight: 15, flexDirection: 'row' }]}>
                                <Text style={[styles.headerText, { flex: 8, color: '#ffffff', alignSelf: 'flex-start' }]}
                                    numberOfLines={1}
                                    ellipsizeMode='tail'>
                                    {this.state.oldChatName}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.view, { flex: 7, }]}>
                            <ActivityIndicator style={{ marginTop: '50%', alignSelf: 'center' }} />
                        </View>
                        <View style={[{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', backgroundColor: '#2A2F4F', marginTop: 2 }]}>
                            <TextInput
                                multiline={true}
                                numberOfLines={1}
                                value={this.state.sendMessageText}
                                style={[styles.text, {
                                    flex: 8, placeholderTextColor: 'grey', width: 240, height: '60%', fontSize: 22, bottom: '20%', paddingTop: 2,
                                    borderRadius: 15, borderColor: '#000000', borderWidth: 2, paddingLeft: 10, backgroundColor: '#ffffff'
                                }]}
                                placeholder='Aa'
                                onChangeText={this.changeMessageText}></TextInput>
                            <TouchableOpacity style={[{
                                flex: 3, width: 20, height: '60%', marginTop: 5, marginRight: 10, bottom: '0%',
                                borderRadius: 15, borderColor: '#000000', borderWidth: 2, marginTop: 15
                            }]}
                                onPress={() => { if (this.state.sendMessageText == '') { } else { this.sendMessage(this.state.sendMessageText) } }}>
                                <Text style={[styles.text, { fontSize: 22, color: '#ffffff', marginTop: 5, alignSelf: 'center' }]}>
                                    Send
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }
        return (
            <View scrollEnabled={false} style={[{ flex: 1, width: '100%', margin: 0, backgroundColor: '#f2f2f2' }]}>

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false });
                    }}>
                    <TouchableOpacity
                        style={{ width: '100%', flex: 1, backgroundColor: '#00000080', alignSelf: 'center' }}
                        activeOpacity={1}>
                        <View style={[styles.optionsPanelContacts, { height: 140, width: '80%', top: 200, right: '10%', borderRadius: 15, margin: 10, }]}>
                            <TouchableOpacity
                                style={{ alignSelf: 'center', width: '80%', marginTop: 5 }}
                                onPress={() => { this.setState({ modalVisible: false }), clearInterval(this.timerId), this.props.navigation.navigate('ChatInfo', { chatID: this.state.chatid }) }}>
                                <Text style={[styles.text, {
                                    fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 5, borderWidth: 2, borderColor: '#000000', height: 40
                                }]}>
                                    View Chat Info
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ marginTop: -10, alignSelf: 'center' }}
                                onPress={() => { this.setState({ modalVisible: false }); }}>
                                <Text style={[styles.text, {
                                    fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 5, borderWidth: 2, borderColor: '#000000', width: '80%', height: 40
                                }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
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
                        style={{ width: '100%', flex: 1, backgroundColor: '#00000080', alignSelf: 'center' }}
                        activeOpacity={1}>
                        <View style={[styles.optionsPanelContacts, { height: 200, width: '80%', top: 200, right: '10%', borderRadius: 15, margin: 10, }]}>
                            <TextInput
                                style={[styles.text, {
                                    fontSize: 22, color: '#000000', alignSelf: 'center', placeholderTextColor: 'grey',
                                    borderRadius: 10, width: '85%', height: 60, backgroundColor: '#d1d9e0', paddingLeft: 10,
                                }]}
                                value={this.state.editMessageText}
                                placeholder=''
                                onChangeText={this.editMessageTextChange}>
                            </TextInput>
                            <TouchableOpacity
                                style={{ alignSelf: 'center', width: '80%', marginTop: 5 }}
                                onPress={() => { this.editMessageRequest(), this.setState({ editMessageModal: false, }) }}>
                                <Text style={[styles.text, {
                                    fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 5, borderWidth: 2, borderColor: '#000000', height: 40
                                }]}>
                                    Confirm Edit
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ alignSelf: 'center', width: '80%', marginTop: 5 }}
                                onPress={() => { this.setState({ editMessageModal: false, messageInfoModal: true }) }}>
                                <Text style={[styles.text, {
                                    fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 5, borderWidth: 2, borderColor: '#000000', height: 40
                                }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
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
                        style={{ width: '100%', flex: 1, backgroundColor: '#00000080', alignSelf: 'center' }}
                        activeOpacity={1}>
                        <View style={[styles.optionsPanelContacts, { height: 200, width: '80%', top: 200, right: '10%', borderRadius: 15, margin: 10, }]}>
                            <Text style={[styles.text, {
                                fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                paddingHorizontal: 12, paddingVertical: 5, height: 40
                            }]}>
                                Are you sure you wish to delete this message?
                            </Text>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={{ flex: 1, alignSelf: 'center', width: '40%', marginTop: 5, }}
                                    onPress={() => { this.deleteMessageRequest(), this.setState({ confirmDeleteModal: false, }) }}>
                                    <Text style={[styles.text, {
                                        fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                        paddingHorizontal: 12, paddingVertical: 5,
                                        borderRadius: 5, borderWidth: 2, borderColor: '#000000', height: 40
                                    }]}>
                                        Yes
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flex: 1, alignSelf: 'center', width: '40%', marginTop: 5 }}
                                    onPress={() => { this.setState({ confirmDeleteModal: false, messageInfoModal: true }) }}>
                                    <Text style={[styles.text, {
                                        fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                        paddingHorizontal: 12, paddingVertical: 5,
                                        borderRadius: 5, borderWidth: 2, borderColor: '#000000', height: 40
                                    }]}>
                                        No
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
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
                        style={{ width: '100%', flex: 1, backgroundColor: '#00000080', alignSelf: 'center' }}
                        activeOpacity={1}>
                        <View style={[styles.optionsPanelContacts, { height: 200, width: '80%', top: 200, right: '10%', borderRadius: 15, margin: 10, }]}>
                            <TouchableOpacity
                                style={{ alignSelf: 'center', width: '80%', marginTop: 5 }}
                                onPress={() => { this.setState({ messageInfoModal: false, editMessageModal: true, }) }}>
                                <Text style={[styles.text, {
                                    fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 5, borderWidth: 2, borderColor: '#000000', height: 40
                                }]}>
                                    Edit Message
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ alignSelf: 'center', width: '80%', marginTop: 5 }}
                                onPress={() => { this.setState({ messageInfoModal: false, confirmDeleteModal: true }) }}>
                                <Text style={[styles.text, {
                                    fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 5, borderWidth: 2, borderColor: '#000000', height: 40
                                }]}>
                                    Delete Message
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ marginTop: -10, alignSelf: 'center' }}
                                onPress={() => { this.setState({ messageInfoModal: false }); }}>
                                <Text style={[styles.text, {
                                    fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 5, borderWidth: 2, borderColor: '#000000', width: '80%', height: 40
                                }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <View style={[styles.viewHome, { flex: 1, padding: 0, width: '100%' }]}>
                    <View style={[styles.header, { flex: 2 }]}>
                        <View style={[{ flex: 1, marginLeft: 55, marginRight: 15, flexDirection: 'row' }]}>
                            <Text style={[styles.headerText, { flex: 8, color: '#ffffff', alignSelf: 'flex-start' }]}
                                numberOfLines={1}
                                ellipsizeMode='tail'>
                                {this.state.oldChatName}
                            </Text>
                        </View>
                        <View style={[{ flex: 1, flexDirection: 'row' }]}>
                            <Text style={[styles.text, { fontSize: 20, color: '#ffffff', flex: 7 }]}
                                numberOfLines={1}
                                ellipsizeMode='tail'>
                                Chat Creator: {this.state.chatData.creator.first_name} {this.state.chatData.creator.last_name}
                            </Text>
                            <TouchableOpacity
                                style={[styles.contactOptions, { flex: 3, height: 50, width: 40, alignSelf: 'center' }]}
                                onPress={() => {
                                    this.setState({
                                        modalVisible: true,
                                    })
                                }}>
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
                                                    <View style={[{
                                                        flex: 11, flexDirection: 'column', borderColor: '#000000', borderTopLeftRadius: 15,
                                                        borderBottomLeftRadius: 15, borderWidth: 2, margin: 2, backgroundColor: '#E5BEEC'
                                                    }]}>
                                                        <Text style={[styles.text, { marginTop: 10, marginLeft: 10, fontSize: 20, alignItems: 'center', color: '#000000' }]}>{item.message}</Text>
                                                        <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                                            <Text style={[styles.text, { flex: 7, marginTop: 2, marginLeft: 10, fontSize: 15, alignSelf: 'flex-start' }]}>
                                                                {this.timestampToString(item.timestamp)}
                                                            </Text>
                                                            <Text style={[styles.text, { flex: 3, marginTop: 2, marginLeft: 10, fontSize: 15, alignSelf: 'flex-end' }]}>
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
                                                <View style={[{
                                                    flex: 11, flexDirection: 'column', borderColor: '#000000', borderTopRightRadius: 15,
                                                    borderBottomRightRadius: 15, borderWidth: 2, margin: 2, backgroundColor: '#917FB3'
                                                }]}>
                                                    <Text style={[styles.text, { marginTop: 10, marginLeft: 10, fontSize: 20, alignItems: 'center' }]}>{item.message}</Text>
                                                    <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                                        <Text style={[styles.text, { flex: 7, marginTop: 2, marginLeft: 10, fontSize: 15, alignSelf: 'flex-start' }]}>
                                                            {this.timestampToString(item.timestamp)}
                                                        </Text>
                                                        <Text style={[styles.text, { flex: 3, marginTop: 2, marginLeft: 10, fontSize: 15, alignSelf: 'flex-end' }]}>
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
                    <View style={[{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', backgroundColor: '#2A2F4F', marginTop: 2 }]}>
                        <TextInput
                            onSubmitEditing={() => { if (this.state.sendMessageText == '') { } else { this.sendMessage(this.state.sendMessageText) } }}
                            value={this.state.sendMessageText}
                            style={[styles.text, {
                                flex: 8, placeholderTextColor: 'grey', width: 240, height: '60%', fontSize: 22, bottom: '20%', paddingTop: 2,
                                borderRadius: 15, borderColor: '#000000', borderWidth: 2, paddingLeft: 10, backgroundColor: '#ffffff'
                            }]}
                            placeholder='Aa'
                            onChangeText={this.changeMessageText}></TextInput>
                        <TouchableOpacity style={[{
                            flex: 3, width: 20, height: '60%', marginTop: 5, marginRight: 10, bottom: '0%',
                            borderRadius: 15, borderColor: '#000000', borderWidth: 2, marginTop: 15
                        }]}
                            onPress={() => { if (this.state.sendMessageText == '') { } else { this.sendMessage(this.state.sendMessageText) } }}>
                            <Text style={[styles.text, { fontSize: 22, color: '#ffffff', marginTop: 5, alignSelf: 'center' }]}>
                                Send
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )

    }
}