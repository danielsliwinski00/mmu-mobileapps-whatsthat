import React, { Component, useEffect } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image, Modal } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';

export default class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            chatsData: [],
            contactsData: [],
            creatingChat: false,
            userID: '',
            createChatName: '',
        }
    }

    async fetchChats() {
        return fetch("http://192.168.1.102:3333/api/1.0.0/chat",
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
            .then((responseJson) => {
                this.setState({
                    chatsData: responseJson,
                    isLoading: false,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async fetchChatsUpdate() {
        return fetch("http://192.168.1.102:3333/api/1.0.0/chat",
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
            .then((responseJson) => {
                this.setState({
                    chatsData: responseJson,
                }, () => { this.getOrderChatsData() })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async createChat() {
        if (this.state.createChatName !== '') {
            await this.createChatRequest();
            this.fetchChats();
            this.setState({
                isLoading: false,
                creatingChat: false,
                createChatName: '',
            })
        } else {
            this.setState({
                isLoading: false,
                creatingChat: false,
                createChatName: '',
            })
            alert('empty chat name')
        }
    }

    async createChatRequest() {
        return fetch("http://192.168.1.102:3333/api/1.0.0/chat",
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
                body: JSON.stringify(
                    {
                        "name": this.state.createChatName
                    }
                )
            })
            .then((response) => {
                if (response.status == 200) {
                    console.log('successfully created chat')
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

    getOrderChatsData() {
        var dataToSort = []
        var sortedData = []
        dataToSort = this.state.chatsData

        sortedData = dataToSort.sort((x, y) =>
            new Date(x.last_message.timestamp) - new Date(y.last_message.timestamp)
        )

        return sortedData.reverse()
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
        this.setState({
            isLoading: false,
        })

        this.fetchChats();
        this.timerId = setInterval(() => { this.fetchChatsUpdate() }, 1500)

        this.props.navigation.addListener('focus', async () => {
            await this.setState({
                isLoading: false,
                createChatName: '',
            })
            this.fetchChats()
            this.timerId = setInterval(() => { this.fetchChatsUpdate() }, 1500)
        });
    }

    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    createChatNameChange = (text) => {
        this.setState({
            createChatName: text
        })
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <View style={[styles.background]}>
                    <View style={[styles.view]}>
                        <View style={[styles.header]}>
                            <Text style={[styles.headerText,]}>
                                Chats
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
                    visible={this.state.creatingChat}
                    onRequestClose={() => {
                        this.setState({ creatingChat: false });
                    }}>
                    <TouchableOpacity
                        style={[styles.modalBackground,]}
                        activeOpacity={1}>
                        <View style={[styles.chatsNewChatModal,]}>
                            <TextInput
                                autoCapitalize='words'
                                style={[styles.chatsNewChatTextInput]}
                                value={this.state.createChatName}
                                placeholder='Chat Name'
                                onChangeText={this.createChatNameChange}>
                            </TextInput>
                            <TouchableOpacity
                                style={{ alignSelf: 'center' }}
                                onPress={() => { this.setState({ isLoading: true }), this.createChat() }}>
                                <Text style={[styles.chatsNewChatButtonText]}>
                                    Create Chat
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ marginTop: -20, alignSelf: 'center' }}
                                onPress={() => { this.setState({ creatingChat: false }); }}>
                                <Text style={[styles.chatsNewChatButtonText]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <View style={[styles.view]}>
                    <View style={[styles.header]}>
                        <Text style={[styles.headerText]}>
                            Chats
                        </Text>
                    </View>
                    <View style={[{ flex: 10, justifyContent: 'flex-start' }]}>
                        <FlatList
                            removeClippedSubviews={false}
                            scrollsToTop={false}
                            extraData={this.getOrderChatsData()}
                            bounces={false}
                            data={this.getOrderChatsData()}
                            keyExtractor={item => item.chat_id}
                            renderItem={({ item }) => {
                                if (this.state.chatsData == []) {
                                    return (<View></View>)
                                }
                                if (Object.keys(item.last_message).length == 0) {
                                    return (
                                        <View style={[styles.chatsChatView]}>
                                            <TouchableOpacity onPress={() => { clearInterval(this.timerId), this.props.navigation.navigate("Chat", { chatID: item.chat_id }) }}>
                                                <Text
                                                    numberOfLines={1}
                                                    ellipsizeMode='tail'
                                                    style={[styles.chatsChatName]}>
                                                    {item.name}
                                                </Text>
                                                <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                                    <Text
                                                        numberOfLines={1}
                                                        ellipsizeMode='tail'
                                                        style={[styles.chatsLastMessage]}>
                                                    </Text>

                                                </View>
                                                <View>
                                                    <Text style={[styles.chatsTimestamp]}>
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>)
                                }
                                else {
                                    return (
                                        <View style={[styles.chatsChatView]}>
                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate("Chat", { chatID: item.chat_id }) }}>
                                                <View style={[{ flex: 1, }]}>
                                                    <View style={[{ flex: 2, }]}>
                                                        <Text
                                                            numberOfLines={1}
                                                            ellipsizeMode='tail'
                                                            style={[styles.chatsChatName]}>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                    <View style={[{ flex: 2, flexDirection: 'row' }]}>
                                                        <View style={[{ flex: 9, }]}>
                                                            <Text
                                                                numberOfLines={1}
                                                                ellipsizeMode='tail'
                                                                style={[styles.chatsLastMessage]}>
                                                                {item.last_message.author.first_name}: {item.last_message.message}
                                                            </Text>
                                                        </View>
                                                        <View style={[{ flex: 1, }]}></View>
                                                    </View>
                                                    <View style={[{ flex: 1, }]}>
                                                        <Text style={[styles.chatsTimestamp]}>
                                                            {this.timestampToString(item.last_message.timestamp)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>)
                                }
                            }}
                        />
                    </View>
                </View>
                <View style={[styles.newChatButton]}>
                    <TouchableOpacity
                        style={[{ flex: 1, }]}
                        onPress={() => { this.setState({ creatingChat: true, }) }}>
                        <Text style={[styles.newChatButtonText,]}>
                            New Chat
                        </Text>
                    </TouchableOpacity>
                </View>
            </View >)
    }
}