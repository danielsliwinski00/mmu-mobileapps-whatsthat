import React, { Component, useEffect } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image, Modal } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';

class Chats extends Component {
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
        return fetch("http://192.168.1.209:3333/api/1.0.0/chat",
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
        return fetch("http://192.168.1.209:3333/api/1.0.0/chat",
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
        return fetch("http://192.168.1.209:3333/api/1.0.0/chat",
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
                <View style={[{ flex: 1, backgroundColor: '#FDE2F340' }]}>
                    <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                        <View style={[styles.header]}>
                            <Text style={[styles.headerText, { color: '#ffffff', alignSelf: 'center' }]}>
                                Chats
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

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.creatingChat}
                    onRequestClose={() => {
                        this.setState({ creatingChat: false });
                    }}>
                    <TouchableOpacity
                        style={{ width: '100%', flex: 1, backgroundColor: '#00000080', alignSelf: 'center' }}
                        activeOpacity={1}>
                        <View style={[styles.optionsPanelContacts, { height: 200, width: '80%', top: 200, right: '10%', borderRadius: 15, margin: 10, }]}>
                            <TextInput
                                autoCapitalize='words'
                                style={[styles.text, {
                                    fontSize: 22, color: '#000000', alignSelf: 'center', placeholderTextColor: 'grey',
                                    borderRadius: 10, width: '85%', height: 60, backgroundColor: '#d1d9e0', paddingLeft: 10,
                                }]}
                                value={this.state.createChatName}
                                placeholder='Chat Name'
                                onChangeText={this.createChatNameChange}>
                            </TextInput>
                            <TouchableOpacity
                                style={{ alignSelf: 'center' }}
                                onPress={() => { this.setState({ isLoading: true }), this.createChat() }}>
                                <Text style={[styles.text, {
                                    fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 5, borderWidth: 2, borderColor: '#000000', width: 140, height: 40
                                }]}>
                                    Create Chat
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ marginTop: -20, alignSelf: 'center' }}
                                onPress={() => { this.setState({ creatingChat: false }); }}>
                                <Text style={[styles.text, {
                                    fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 5, borderWidth: 2, borderColor: '#000000', width: 140, height: 40
                                }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                    <View style={[styles.header]}>
                        <Text style={[styles.headerText]}>
                            Chats
                        </Text>
                    </View>
                    <View style={[{ flex: 11, justifyContent: 'flex-start' }]}>
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
                                        <View style={[{ flex: 1, flexDirection: 'column', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                            <TouchableOpacity onPress={() => { clearInterval(this.timerId), this.props.navigation.navigate("Chat", { chatID: item.chat_id }) }}>
                                                <Text
                                                    numberOfLines={1}
                                                    ellipsizeMode='tail'
                                                    style={[styles.text, { marginTop: 10, marginLeft: 10, fontSize: 25, alignItems: 'center' }]}>
                                                    {item.name}
                                                </Text>
                                                <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                                    <Text
                                                        numberOfLines={1}
                                                        ellipsizeMode='tail'
                                                        style={[styles.text, { flex: 7, marginTop: 2, marginLeft: 10, fontSize: 25, alignSelf: 'flex-start' }]}>
                                                    </Text>

                                                </View>
                                                <View>
                                                    <Text style={[styles.text, { marginTop: 2, marginLeft: 10, fontSize: 15, alignSelf: 'flex-end' }]}>
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>)
                                }
                                else {
                                    return (
                                        <View style={[{ flex: 1, flexDirection: 'column', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                            <TouchableOpacity onPress={() => { this.props.navigation.navigate("Chat", { chatID: item.chat_id }) }}>
                                                <Text
                                                    numberOfLines={1}
                                                    ellipsizeMode='tail'
                                                    style={[styles.text, { marginTop: 10, marginLeft: 10, fontSize: 25, alignItems: 'center', fontWeight: 600 }]}>
                                                    {item.name}
                                                </Text>
                                                <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                                    <Text
                                                        numberOfLines={1}
                                                        ellipsizeMode='tail'
                                                        style={[styles.text, { flex: 7, marginTop: 2, marginLeft: 10, fontSize: 22, alignSelf: 'flex-start', fontWeight: 500 }]}>
                                                        {item.last_message.author.first_name}: {item.last_message.message}
                                                    </Text>

                                                </View>
                                                <View>
                                                    <Text style={[styles.text, { marginTop: 2, marginLeft: 10, fontSize: 15, alignSelf: 'flex-end' }]}>
                                                        {this.timestampToString(item.last_message.timestamp)}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>)
                                }
                            }}
                        />
                    </View>
                </View>
                <View style={[{ position: 'absolute', bottom: 20, right: 20, borderRadius: 10, borderWidth: 3, borderColor: '#000000', height: 60, width: 120, backgroundColor: '#e7e8e9' }]}>
                    <TouchableOpacity style={[{ flex: 1, }]} onPress={() => { this.setState({ creatingChat: true, }) }}>
                        <Text style={[styles.text, { fontSize: 18 }]}>
                            New Chat
                        </Text>
                    </TouchableOpacity>
                </View>
            </View >)

    }
}

export default Chats;