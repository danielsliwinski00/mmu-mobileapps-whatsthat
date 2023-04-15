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
            animateOptionsPanel: new Animated.Value(210),
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
                this.slideOutOnLoad();
                await this.setState({
                    chatData: responseJson,
                    messagesData: responseJson.messages,
                }, () => { this.addMessagesData(0) }
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

    changeMessageText = (text) => {
        this.setState({
            sendMessageText: text
        })
    }

    addMessagesData = (page) => {
        const newMessagesData = []
        //newMessagesData = this.state.messagesData
        for (var i = page * 50, imax = i + 50; i < imax && i < this.state.messagesData.length; i++) {
            console.log(i)
            newMessagesData.push(this.state.messagesData[i]);
        }
        this.setState({
            viewableMessagesData: [...this.state.viewableMessagesData, ...newMessagesData],
            isLoading: false,
        })
    }

    onScrollHandler = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            this.addMessagesData(this.state.page)
        })
    }

    slideIn = () => {
        Animated.timing(this.state.animateOptionsPanel, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }

    slideOut = () => {
        Animated.timing(this.state.animateOptionsPanel, {
            toValue: 210,
            duration: 200,
            useNativeDriver: true,
        }).start();
        this.setState({
            optionPanel: false
        })
    }

    slideOutOnLoad = () => {
        Animated.timing(this.state.animateOptionsPanel, {
            toValue: 210,
            duration: 1,
            useNativeDriver: true,
        }).start();
        this.setState({
            optionPanel: false
        })
    }

    optionButton() {
        if (this.state.optionPanel == true) {
            this.slideOut();
            this.setState({
                optionPanel: false
            })
        }
        else {
            this.slideIn();
            this.setState({
                optionPanel: true
            })
        }
    }
    
    timestampToString = (timestamp) => {
        let currentDate = new Date();
        var date = new Date(timestamp)

        var interval = currentDate - date
        var aDay = 60 * 1000;

        interval = interval / aDay

        return (Math.round(interval) + " minutes ago")
    }

    async componentDidMount() {
        await this.setState({
            isLoading: true,
            chatid: this.props.route.params.chatID.toString(),
            userID: await AsyncStorage.getItem("whatsthatID"),
            animateOptionsPanel: new Animated.Value(210),
        })
        this.fetchChatData();
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
                    <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                        <View style={[{ flex: 1, backgroundColor: '#412234' }]}>
                            <View style={[{ marginHorizontal: 55 }]}>
                                <Text style={[styles.text, { color: '#ffffff', alignSelf: 'center' }]} numberOfLines={1} ellipsizeMode='tail'>{this.state.chatData.name}</Text>
                            </View>
                        </View>
                        <View style={[styles.view, { flex: 10, }]}>
                            <ActivityIndicator style={{ marginTop: 350, alignSelf: 'center' }} />
                        </View>
                        <View style={[{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', backgroundColor: '#7d566d', marginTop: 2 }]}>
                            <TextInput
                                style={[styles.text, { flex: 8, placeholderTextColor: 'grey', width: 240, height: 50, borderRadius: 15, borderColor: '#000000', borderWidth: 2, paddingLeft: 10, backgroundColor: '#ffffff' }]}
                                placeholder='Aa' onChangeText={this.changeMessageText}></TextInput>
                            <TouchableOpacity style={[{ flex: 3, width: 20, height: 50, marginTop: 5, marginRight: 10, borderRadius: 15, borderColor: '#000000', borderWidth: 2, marginTop: 15 }]} onPress={() => { this.sendMessage(this.state.sendMessageText) }}><Text style={[styles.text, { color: '#ffffff', marginTop: 5, alignSelf: 'center' }]}>Send</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }
        return (
            <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
                <TouchableOpacity style={{flex:1}} activeOpacity={1} onPress={()=>{this.slideOut()}}>
                <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                    <View style={[{ flex: 1, backgroundColor: '#412234' }]}>
                        <View style={[{ marginLeft: 55, marginRight: 15, flexDirection: 'row' }]}>
                            <Text style={[styles.text, {flex:8, color: '#ffffff', alignSelf: 'flex-start' }]} numberOfLines={1} ellipsizeMode='tail'>{this.state.chatData.name}</Text>
                            <TouchableOpacity style={[styles.contactOptions, {marginTop:10, flex:2, alignSelf: 'flex-end'}] } onPress={() => { alert("options pressed") }}>
                            <Image style={[styles.contactOptions]} source={require('./images/optionsg.png')} />
                        </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[{ flex: 10, justifyContent: 'flex-start' }]}>
                        <View style={[{ flex: 9, justifyContent: 'flex-start' }]}>
                            <FlatList
                                data={this.state.viewableMessagesData}
                                inverted
                                onEndReached={this.onScrollHandler}
                                onEndThreshold={0}
                                keyExtractor={item => item.message_id}
                                renderItem={({ item }) => {
                                    if (item.author.user_id == this.state.userID) {
                                        return (
                                            <View style={[{ flexDirection: 'row' }]}>
                                                <View style={[{ flex: 1, }]}></View>
                                                <View style={[{ flex: 11, flexDirection: 'column', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                                    <Text style={[styles.text, { marginTop: 10, marginLeft: 10, fontSize: 20, alignItems: 'center' }]}>{item.message}</Text>
                                                    <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                                        <Text style={[styles.text, { flex: 7, marginTop: 2, marginLeft: 10, fontSize: 15, alignSelf: 'flex-start' }]}>{this.timestampToString(item.timestamp)}</Text>
                                                        <Text style={[styles.text, { flex: 3, marginTop: 2, marginLeft: 10, fontSize: 15, alignSelf: 'flex-end' }]}>{item.author.first_name}</Text>
                                                    </View>
                                                </View>
                                            </View>)
                                    }
                                    else {
                                        return (
                                            <View style={[{ flexDirection: 'row' }]}>
                                                <View style={[{ flex: 11, flexDirection: 'column', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                                    <Text style={[styles.text, { marginTop: 10, marginLeft: 10, fontSize: 20, alignItems: 'center' }]}>{item.message}</Text>
                                                    <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                                        <Text style={[styles.text, { flex: 7, marginTop: 2, marginLeft: 10, fontSize: 15, alignSelf: 'flex-start' }]}></Text>
                                                        <Text style={[styles.text, { flex: 3, marginTop: 2, marginLeft: 10, fontSize: 15, alignSelf: 'flex-end' }]}>{item.author.first_name}</Text>
                                                    </View>
                                                </View>
                                                <View style={[{ flex: 1, }]}></View>
                                            </View>)
                                    }
                                }}
                            />
                        </View>
                    </View>
                    <View style={[{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', backgroundColor: '#7d566d', marginTop: 2 }]}>
                        <TextInput value={this.state.sendMessageText} style={[styles.text, { flex: 8, placeholderTextColor: 'grey', width: 240, height: 50, borderRadius: 15, borderColor: '#000000', borderWidth: 2, paddingLeft: 10, backgroundColor: '#ffffff' }]} placeholder='Aa' onChangeText={this.changeMessageText}></TextInput>
                        <TouchableOpacity style={[{ flex: 3, width: 20, height: 50, marginTop: 5, marginRight: 10, borderRadius: 15, borderColor: '#000000', borderWidth: 2, marginTop: 15 }]} onPress={() => { this.sendMessage(this.state.sendMessageText) }}><Text style={[styles.text, { color: '#ffffff', marginTop: 5, alignSelf: 'center' }]}>Send</Text></TouchableOpacity>
                    </View>
                    
                </View>
                </TouchableOpacity>
                <Animated.View style={[styles.optionsPanelContacts, { transform: [{ translateX: this.state.animateOptionsPanel }] }]}>
                    <TouchableOpacity onPress={() => { this.slideOut(); this.setState({ isLoading: true, optionPanel: false }); this.props.navigation.navigate('Search') }}>
                        <Text style={[styles.text, { fontSize: 20, color: '#2e4052', alignSelf: 'center' }]}>
                            View chat info
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View >)

    }
}

export default Chats;