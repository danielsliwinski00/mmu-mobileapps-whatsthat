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
        return fetch("http://localhost:3333/api/1.0.0/chat/" + this.state.chatid + "/user/" + id,
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