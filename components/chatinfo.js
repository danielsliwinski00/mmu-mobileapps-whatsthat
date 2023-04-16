import React, { Component } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image, Modal } from 'react-native';
import { TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native-web';
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
        }
    }

    async fetchChatData() {
        this.setState({
            isLoading: true,
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
        return fetch("http://192.168.1.209:3333/api/1.0.0/chat/" + this.state.chatid,
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
                    this.setState({
                        chatNameText: '',
                        chatNameModal: false
                    }, () => { this.fetchChatData() })
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

    addMember() {
        this.props.navigation.navigate('AddMember', { chatID: this.state.chatid, chatMembers: this.state.chatData.members })
    }

    async removeMember(id) {
        this.setState({
            isLoading: true,
        })
        return fetch("http://192.168.1.209:3333/api/1.0.0/chat/" + this.state.chatid + "/user/" + id,
            {
                method: 'delete',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    this.fetchChatData();
                    this.setState({
                        isLoading: false,
                    })
                }
                else if (response.status == 400) {
                    throw "You can't remove yourself as a contact"
                }
                else if (response.status == 401) {
                    throw "Unauthorized"
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

    changeChatNameText = (text) => {
        this.setState({
            chatNameText: text
        })
    }

    async componentDidMount() {
        await this.setState({
            isLoading: true,
            chatid: this.props.route.params.chatID.toString(),
            userID: await AsyncStorage.getItem("whatsthatID"),
        })
        this.fetchChatData();
        this.props.navigation.addListener('focus', async () => {
            await this.setState({
                isLoading: true,
                chatid: this.props.route.params.chatID.toString(),
                userID: await AsyncStorage.getItem("whatsthatID"),
            })
            this.fetchChatData()
        });
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <View style={[{ flex: 1, backgroundColor: '#FDE2F340' }]}>
                    <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                        <View style={[styles.header]}>
                            <View style={[{ marginHorizontal: 55 }]}>
                                <Text style={[styles.headerText]} numberOfLines={1} ellipsizeMode='tail'>{this.state.chatData.name}</Text>
                            </View>
                        </View>
                        <View style={[styles.view, { flex: 10, }]}>
                            <ActivityIndicator style={{ marginTop: 350, alignSelf: 'center' }} />
                        </View>
                    </View>
                </View>
            );
        }
        return (
            <View scrollEnabled={false} style={[{ flex: 1, marignBottom: 0, backgroundColor: '#FDE2F320' }]} contentContainerStyle={{ flexGrow: 1 }}>

                <Modal
                    animationType="none" transparent={true} visible={false}>
                    <TouchableOpacity
                        style={{ width: '100%', flex: 1, backgroundColor: '#00000080', alignSelf: 'center' }}
                        activeOpacity={1}>
                        <View style={[styles.optionsPanelContacts, { height: 140, width: '80%', top: 200, right: '10%', borderRadius: 15, margin: 10, }]}>
                            <TouchableOpacity
                                style={{ alignSelf: 'center' }}
                                onPress={() => { this.setState({ isLoading: true }); this.props.navigation.navigate('chatinfo', { chatID: this.state.chatid }) }}>
                                <Text style={[styles.text, {
                                    fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 5, borderWidth: 2, borderColor: '#000000', width: 140, height: 40
                                }]}>
                                    Create Chat
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ marginTop: -10, alignSelf: 'center' }}
                                onPress={() => { this.setState({ modalVisible: false }); }}>
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

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.chatNameModal}
                    onRequestClose={() => {
                        this.setState({ creatingChat: false });
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
                                value={this.state.chatNameText}
                                placeholder='Chat name'
                                onChangeText={this.changeChatNameText}>
                            </TextInput>
                            <TouchableOpacity
                                style={{ alignSelf: 'center', width: '60%' }}
                                onPress={() => {
                                    if (this.state.chatNameText == '') {
                                        this.changeChatName()
                                    }
                                    else {
                                        { this.changeChatName() }
                                    }
                                }}>
                                <Text style={[styles.text, {
                                    fontSize: 20, color: '#2e4052', alignSelf: 'Center', alignItems: 'center',
                                    paddingHorizontal: 12, paddingVertical: 5,
                                    borderRadius: 5, borderWidth: 2, borderColor: '#000000', height: 40
                                }]}>
                                    Change Name
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ marginTop: -20, alignSelf: 'center', width: '60%' }}
                                onPress={() => { this.setState({ chatNameModal: false }); }}>
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

                <View style={[styles.viewHome, { flex: 1, padding: 0, width: '100%' }]}>
                    <View style={[styles.header]}>
                        <View style={[{ marginLeft: 55, marginRight: 15, flexDirection: 'row' }]}>
                            <Text style={[styles.headerText, { flex: 8, alignSelf: 'flex-start' }]} numberOfLines={1} ellipsizeMode='tail'>{this.state.chatData.name}</Text>
                            <View style={[styles.contactOptions, { marginTop: 10, flex: 2, alignSelf: 'flex-end' }]}>

                            </View>
                        </View>
                    </View>
                    <View style={[{ flex: 10, justifyContent: 'flex-start' }]}>
                        <View style={[{ flex: 1, justifyContent: 'flex-start' }]}>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    chatNameModal: true
                                })
                            }}>
                                <Text style={[styles.text, { alignSelf: 'center' }]}>{this.state.chatData.name}</Text>
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
                                                <View style={[{ flex: 1, flexDirection: 'row', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                                    <View style={[{ flex: 8, marginLeft: 10, alignSelf: 'flex-start' }]}>
                                                        <Text style={[styles.text, { marginTop: 10, fontSize: 25 }]}>{item.first_name} {item.last_name}</Text>
                                                        <Text style={[styles.text, { marginTop: 2, fontSize: 18 }]}>{item.email}</Text>
                                                    </View>
                                                    <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                    </View>
                                                </View>)
                                        }
                                        else {
                                            return(
                                            <View style={[{ flex: 1, flexDirection: 'row', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                                <View style={[{ flex: 8, marginLeft: 10, alignSelf: 'flex-start' }]}>
                                                    <Text style={[styles.text, { marginTop: 10, fontSize: 25 }]}>{item.first_name} {item.last_name}</Text>
                                                    <Text style={[styles.text, { marginTop: 2, fontSize: 18 }]}>{item.email}</Text>
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
                                            <View style={[{ flex: 1, flexDirection: 'row', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                                <View style={[{ flex: 8, marginLeft: 10, alignSelf: 'flex-start' }]}>
                                                    <Text style={[styles.text, { marginTop: 10, fontSize: 25 }]}>{item.first_name} {item.last_name}</Text>
                                                    <Text style={[styles.text, { marginTop: 2, fontSize: 18 }]}>{item.email}</Text>
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