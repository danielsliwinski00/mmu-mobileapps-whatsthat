import React, { Component } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image } from 'react-native';
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
        this.setState({
            isLoading: true,
        })
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

    async createChat() {
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

    timestampToString = (timestamp) =>{
        let currentDate = new Date();
        var date = new Date(timestamp)

        var interval = currentDate - date
        var aDay = 60*1000;

        interval = interval/aDay

        return(Math.round(interval) + " minutes ago")
    }

    async componentDidMount() {
        this.fetchChats();
        this.props.navigation.addListener('focus', () => {
            this.setState({
                isLoading: true,
            })
            this.fetchChats()
        });
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
                    <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                        <View style={[{ flex: 1, backgroundColor: '#412234' }]}>
                            <Text style={[styles.text, { color: '#ffffff', alignSelf: 'center' }]}>
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
                <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                    <View style={[{ flex: 1, backgroundColor: '#412234' }]}>
                        <Text style={[styles.text, { color: '#ffffff', alignSelf: 'center' }]}>
                            Chats
                        </Text>
                    </View>
                    <View style={[{ flex: 11, justifyContent: 'flex-start' }]}>
                        <FlatList
                            data={this.state.chatsData}
                            keyExtractor={item => item.chat_id}
                            renderItem={({ item }) => {
                                return (
                                    <View style={[{ flex: 1, flexDirection: 'column', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate("Chat", {chatID: item.chat_id} )}}>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { marginTop: 10, marginLeft: 10, fontSize: 25, alignItems:'center' }]}>{item.name}</Text>
                                        <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.text, { flex: 7, marginTop: 2, marginLeft: 10, fontSize: 25, alignSelf: 'flex-start' }]}>{item.last_message.message}</Text>
                                            <Text style={[styles.text, { flex: 3, marginTop: 2, marginLeft: 10, fontSize: 15, alignSelf: 'flex-end' }]}>{item.last_message.author.first_name}</Text>
                                        </View>
                                        <View>
                                        <Text style={[styles.text, {marginTop: 2, marginLeft: 10, fontSize: 15, alignSelf: 'flex-end' }]}>{this.timestampToString(item.last_message.timestamp)}</Text>
                                        </View>
                                        </TouchableOpacity>
                                    </View>)
                            }}
                        />
                    </View>
                    <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
                    </View>
                </View>
            </View >)

    }
}

export default Chats;