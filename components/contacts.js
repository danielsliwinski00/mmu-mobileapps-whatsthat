import React, { Component } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image, Modal } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents } from 'react-navigation';
import styles from './stylesheet.js';
import { useFocusEffect } from '@react-navigation/native';
import validation from './validation.js';

class Contacts extends Component {
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
        return fetch("http://192.168.1.209:3333/api/1.0.0/search?search_in=contacts&q=" + this.state.searchText,
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
        return fetch("http://192.168.1.209:3333/api/1.0.0/contacts",
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
        return fetch("http://192.168.1.209:3333/api/1.0.0/user/" + id + "/contact",
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
        return fetch("http://192.168.1.209:3333/api/1.0.0/user/" + id + "/block",
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
                <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
                    <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
                        <View style={[styles.header]}>
                            <Text style={[styles.headerText]}>
                                Contacts
                            </Text>
                        </View>
                        <View style={[{ flex: 1, marginTop: 10, marginHorizontal: 10, backgroundColor: 'transparent', flexDirection: 'row' }]}>
                            <TextInput style={[styles.contactSearch, { alignSelf: 'flex-start', width: 340, }]}
                                placeholder='Search'
                                onChangeText={this.searchTextChange}
                                onSubmitEditing={() => this.searchPrep()}>
                            </TextInput>
                            <TouchableOpacity style={[styles.contactOptions]} onPress={() => {  }}>
                                <Image style={[styles.contactOptions]} source={require('./images/optionsg.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.view, { flex: 11, }]}>
                            <ActivityIndicator style={{ marginTop: 350, alignSelf: 'center' }} />
                        </View>
                    </View>
                </View>
            );
        }
        if (this.state.addingContact == true) {
            return (
                <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
                    <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
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
                                            <View style={[{ flex: 1, flexDirection: 'row', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                                <View style={[{ flex: 8, alignSelf: 'flex-start' }]}>
                                                    <Text style={[styles.text, { marginTop: 10, marginLeft: 10, fontSize: 20 }]}> {item.given_name} {item.family_name} </Text>
                                                    <Text style={[styles.text, { marginTop: 2, marginLeft: 10, fontSize: 20 }]}> {item.email} </Text>
                                                    <Text style={[styles.text, { marginTop: 2, marginLeft: 10, fontSize: 15 }]}> User ID: {item.user_id} </Text>
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
            <ScrollView scrollEnabled={false} style={[{ flex: 1, marignBottom: 0, backgroundColor: '#f2f2f2' }]} contentContainerStyle={{ flexGrow: 1 }}>

                <Modal
                    animationType="none" 
                    transparent={true} 
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false });
                    }}>
                    <TouchableOpacity style={{ width: '100%', flex: 1, backgroundColor: 'transparent' }} activeOpacity={1} onPressOut={() => { this.setState({ modalVisible: false }) }}>
                        <View style={[styles.optionsPanelContacts]}>
                            <TouchableOpacity onPress={() => { this.setState({ isLoading: true, optionPanel: false, modalVisible: false }); this.props.navigation.navigate('Search') }}>
                                <Text style={[styles.text, { fontSize: 20, color: '#2e4052', alignSelf: 'center' }]}>
                                    Add Contact
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.setState({ isLoading: true, optionPanel: false, modalVisible: false }); this.props.navigation.navigate('Blocked') }}>
                                <Text style={[styles.text, { fontSize: 20, color: '#2e4052', alignSelf: 'center' }]}>
                                    View Blocked List
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <View style={[styles.viewHome, { width: '100%', flex: 1, padding: 0, }]}>
                    <View style={[styles.header]}>
                        <Text style={[styles.headerText]}>
                            Contacts
                        </Text>
                    </View>
                    <View style={[{ flex: 1, marginTop: 10, marginHorizontal: 10, backgroundColor: 'transparent', flexDirection: 'row' }]}>
                        <TextInput style={[styles.contactSearch, { alignSelf: 'flex-start', width: 340, }]}
                            placeholder='Search Contacts'
                            onChangeText={this.searchTextChange}
                            onSubmitEditing={() => this.searchPrep()}>
                        </TextInput>
                        <TouchableOpacity style={[styles.contactOptions]} onPress={() => {this.setState({ modalVisible: true })}}>
                            <Image style={[styles.contactOptions]} source={require('./images/optionsg.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={[{ flex: 10, justifyContent: 'flex-start' }]}>
                        <FlatList
                            nestedScrollEnabled
                            data={this.state.contactsData}
                            keyExtractor={item => item.user_id}
                            renderItem={({ item }) => {
                                if (item.user_id != this.state.userID) {
                                    return (
                                        <View style={[{ flex: 1, flexDirection: 'row', borderColor: '#000000', borderWidth: 2, margin: 2, }]}>
                                            <View style={[{ flex: 8, marginLeft: 10, alignSelf: 'flex-start' }]}>
                                                <Text style={[styles.text, { marginTop: 10, fontSize: 25 }]}>{item.first_name} {item.last_name}</Text>
                                                <Text style={[styles.text, { marginTop: 2, fontSize: 18 }]}>{item.email}</Text>
                                                <Text style={[styles.text, { marginTop: 2, fontSize: 15 }]}>User ID: {item.user_id} </Text>
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
                                    return
                                }
                            }}
                        />
                    </View>
                </View>
            </ScrollView >
        );
    }
}

export default Contacts;

/**
 *                         <TouchableOpacity style={[styles.addContactBtn]}>
                            <Image style={[styles.addContact]} source={require('./images/removecontact.png')} />
                        </TouchableOpacity>

                                                <TouchableOpacity style={[styles.addContactBtn]}>
                            <Image style={[styles.addContact]} source={require('./images/addcontact.png')} />
                        </TouchableOpacity>

                                        <Animated.View style={[styles.optionsPanelContacts, { transform: [{ translateX: this.state.animateOptionsPanel }] }]}>
                    <TouchableOpacity onPress={() => { this.slideOut(); this.setState({ isLoading: true, optionPanel: false }); this.props.navigation.navigate('Search') }}>
                        <Text style={[styles.text, { fontSize: 20, color: '#2e4052', alignSelf: 'center' }]}>
                            Add Contact
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.slideOut(); this.setState({ isLoading: true, optionPanel: false }); this.props.navigation.navigate('Blocked') }}>
                        <Text style={[styles.text, { fontSize: 20, color: '#2e4052', alignSelf: 'center' }]}>
                            View Blocked List
                        </Text>
                    </TouchableOpacity>
                </Animated.View>


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
 */