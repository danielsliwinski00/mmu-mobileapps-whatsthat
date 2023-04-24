import React, { Component } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image, Modal } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView, TouchableHighlight } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents } from 'react-navigation';
import styles from './stylesheet.js';

export default class Contacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            contactsData: [],
            searchData: [],
            addingContact: false,
            userID: '',
            searchText: '',
            optionPanel: false,
            animateOptionsPanel: new Animated.Value(210),
            modalVisible: false,
        }
    }

    searchPrep() {
        this.setState({
            isLoading: true,
        })
        this.search();
    }


    async search() {
        return fetch("http://192.168.1.102:3333/api/1.0.0/search?search_in=contacts&q=" + this.state.searchText,
            {
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                this.setState({
                    searchData: responseJson,
                    isLoading: false,
                    addingContact: true,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async fetchContacts() {
        return fetch("http://192.168.1.102:3333/api/1.0.0/contacts",
            {
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    return response.json();
                }
                else if (response.status == 401) {
                    throw "Unauthorised"
                }
                else {
                    throw "Something went wrong"
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

    async removeContact(id) {
        this.setState({
            isLoading: true,
        })
        return fetch("http://192.168.1.102:3333/api/1.0.0/user/" + id + "/contact",
            {
                method: 'delete',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    this.fetchContacts();
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

    async blockContact(id) {
        this.setState({
            isLoading: true,
        })
        return fetch("http://192.168.1.102:3333/api/1.0.0/user/" + id + "/block",
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    this.fetchContacts();
                    this.setState({
                        isLoading: false,
                    })
                }
                else if (response.status == 400) {
                    throw "You can't block yourself"
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

    async componentDidMount() {
        this.setState({
            isLoading: true,
            userID: await AsyncStorage.getItem("whatsthatID"),
        })
        this.fetchContacts();

        this.props.navigation.addListener('focus', async () => {
            await this.setState({
                isLoading: true,
            })
            this.fetchContacts()
        });
    }

    searchTextChange = (text) => {
        this.setState({ searchText: text })
    }

    render() {
        if (this.state.isLoading == true) {
            return (
                <View style={[styles.background]}>
                    <View style={[styles.view]}>
                        <View style={[styles.header]}>
                            <Text style={[styles.headerText]}>
                                Contacts
                            </Text>
                        </View>
                        <View style={[styles.contactsSearchView]}>
                            <TextInput style={[styles.contactSearch, { alignSelf: 'flex-start', width: 340, }]}
                                placeholder='Search'
                                onChangeText={this.searchTextChange}
                                onSubmitEditing={() => this.searchPrep()}>
                            </TextInput>
                            <TouchableOpacity style={[styles.contactOptions]} onPress={() => { }}>
                                <Image style={[styles.contactOptions]} source={require('./images/optionsg.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.view, { flex: 10, }]}>
                            <ActivityIndicator style={[styles.activityIndicator]} />
                        </View>
                    </View>
                </View>
            );
        }
        if (this.state.addingContact == true) {
            return (
                <View style={[styles.background]}>
                    <View style={[styles.view]}>
                        <View style={[styles.header]}>
                            <Text style={[styles.headerText]}>
                                Contacts
                            </Text>
                        </View>
                        <View style={[{ flex: 9, justifyContent: 'flex-start' }]}>
                            <FlatList
                                data={this.state.searchData}
                                keyExtractor={item => item.user_id}
                                renderItem={({ item }) => {
                                    if (item.user_id != this.state.userID) {
                                        return (
                                            <View style={[styles.contactBox]}>
                                                <View style={[styles.contactInfoBox]}>
                                                    <Text style={[styles.contactInfoName]}> {item.given_name} {item.family_name} </Text>
                                                    <Text style={[styles.contactInfoEmail]}> {item.email} </Text>
                                                    <Text style={[styles.contactInfoUserID]}> User ID: {item.user_id} </Text>
                                                </View>
                                                <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                    <TouchableOpacity onPress={() => { this.addContact(item.user_id) }}>
                                                        <Image style={[styles.addContact]} source={require('./images/addcontact.png')} /></TouchableOpacity></View>
                                            </View>)
                                    } else {
                                        return
                                    }
                                }
                                }
                            />
                        </View>
                        <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
                            <TouchableOpacity
                                style={styles.box}
                                onPress={() => {
                                    this.setState({
                                        addingContact: false,
                                        optionPanel: false,
                                    })
                                }}>

                                <Text style={styles.text}>Back
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >)
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
                        onPressOut={() => { this.setState({ modalVisible: false }) }}
                    >
                        <TouchableHighlight style={[styles.optionsPanelContacts]}>
                            <View style={[styles.contactsModalViewButtons]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ isLoading: true, optionPanel: false, modalVisible: false });
                                        this.props.navigation.navigate('Search')
                                    }}
                                >
                                    <Text style={[styles.contactsModalViewButtonsText]}>
                                        Add Contact
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ isLoading: true, optionPanel: false, modalVisible: false });
                                        this.props.navigation.navigate('Blocked')
                                    }}
                                >
                                    <Text style={[styles.contactsModalViewButtonsText]}>
                                        View Blocked List
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </Modal>

                <View style={[styles.view]}>
                    <View style={[styles.header]}>
                        <Text style={[styles.headerText]}>
                            Contacts
                        </Text>
                    </View>
                    <View style={[styles.contactsSearchView]}>
                        <TextInput style={[styles.contactSearch, { alignSelf: 'flex-start', width: 340, }]}
                            placeholder='Search Contacts'
                            onChangeText={this.searchTextChange}
                            onSubmitEditing={() => this.searchPrep()}>
                        </TextInput>
                        <TouchableOpacity style={[styles.contactOptions]} onPress={() => { this.setState({ modalVisible: true }) }}>
                            <Image style={[styles.contactOptions]} source={require('./images/optionsg.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={[{ flex: 9, }]}>
                        <View style={[{ flex: 1, }]}>
                            <FlatList
                                removeClippedSubviews={false}
                                scrollsToTop={false}
                                bounces={false}
                                data={this.state.contactsData}
                                keyExtractor={item => item.user_id}
                                renderItem={({ item }) => {
                                    if (item.user_id != this.state.userID) {
                                        return (
                                            <View style={[styles.contactBox]}>
                                                <View style={[styles.contactInfoBox]}>
                                                    <Text style={[styles.contactInfoName]}>{item.first_name} {item.last_name}</Text>
                                                    <Text style={[styles.contactInfoEmail]}>{item.email}</Text>
                                                    <Text style={[styles.contactInfoUserID]}>User ID: {item.user_id} </Text>
                                                </View>
                                                <View style={[{ flex: 2, alignSelf: 'center' }]}>
                                                    <TouchableOpacity onPress={() => { this.removeContact(item.user_id) }}>
                                                        <Image style={[styles.addContact]} source={require('./images/removecontact.png')} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => { this.blockContact(item.user_id) }}>
                                                        <Image style={[styles.addContact]} source={require('./images/blockcontact.png')} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>)
                                    } else {
                                    }
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View >
        );
    }
}