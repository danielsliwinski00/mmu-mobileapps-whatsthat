/* eslint-disable global-require */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-var */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable quote-props */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
/* eslint-disable no-undef */
/* eslint-disable no-throw-literal */
/* eslint-disable no-else-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable react/sort-comp */
/* eslint-disable import/extensions */
// eslint-disable-next-line no-else-return
import React, { Component } from 'react';
import {
  FlatList, ActivityIndicator, Text, TextInput, View, Image,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StylesLight from './stylesheet.js';
import StylesDark from './stylesheetdarkmode.js';

export default class AddMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsData: [],
      searchData: [],
      addingContact: false,
      userID: '',
      searchText: '',
      chatid: '',
      members: [],
      styles: StylesLight,
      style: '',
    };
  }

  async setColorScheme() {
    if (this.state.style == 'light') {
      this.setState({ styles: StylesLight });
    } else {
      this.setState({ styles: StylesDark });
    }
  }

  searchPrep() {
    this.setState({
      isLoading: true,
    });
    this.search();
  }

  async search() {
    return fetch(
      'http://localhost:3333/api/1.0.0/search?search_in=contacts&q=' + this.state.searchText,
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 400) {
          toast.show('Bad Request', { type: 'danger' });
          throw 'Bad Request';
        } else if (response.status == 401) {
          toast.show('Unauthorized', { type: 'danger' });
          throw 'Unauthorised';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
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
    return fetch(
      'http://localhost:3333/api/1.0.0/contacts',
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then(async (response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 401) {
          toast.show('Unauthorized', { type: 'danger' });
          throw 'Unauthorised';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          contactsData: responseJson,
          isLoading: false,
        }, () => { console.log(this.state.members, this.state.contactsData); });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async addMember(id) {
    this.setState({
      isLoading: true,
    });
    console.log(this.state.chatid, id);
    return fetch(
      'http://localhost:3333/api/1.0.0/chat/' + this.state.chatid + '/user/' + id.toString(),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then(async (response) => {
        if (response.status == 200) {
          toast.show('Added Member', { type: 'success' });
          this.fetchContacts();
          this.setState({
            isLoading: false,
          });
          this.props.navigation.navigate('ChatInfo', { chatID: this.state.chatid });
        } else if (response.status == 400) {
          this.setState({
            isLoading: false,
          });
          this.props.navigation.navigate('ChatInfo', { chatID: this.state.chatid });
          toast.show('Bad Request', { type: 'danger' });
          throw 'Bad Request';
        } else if (response.status == 401) {
          toast.show('Unauthorized', { type: 'danger' });
          throw 'Unauthorized';
        } else if (response.status == 403) {
          toast.show('Forbidden', { type: 'danger' });
          throw 'Forbidden';
        } else if (response.status == 404) {
          toast.show('Not Found', { type: 'danger' });
          throw 'Not Found';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  searchTextChange = (text) => {
    this.setState({ searchText: text });
  };

  async componentDidMount() {
    if (await AsyncStorage.getItem('colorScheme')) {
      this.setState({
        style: await AsyncStorage.getItem('colorScheme'),
      }, () => { this.setColorScheme(); });
    } else {
      await AsyncStorage.setItem('colorScheme', 'light');
      this.setColorScheme();
    }

    this.setState({
      isLoading: true,
      userID: await AsyncStorage.getItem('whatsthatID'),
      chatid: this.props.route.params.chatID.toString(),
      members: this.props.route.params.chatMembers,
    });
    this.fetchContacts();

    this.props.navigation.addListener('focus', async () => {
      await this.setState({
        isLoading: true,
      });
      this.fetchContacts();
    });
  }

  componentWillUnmount() {
    console.log('unmounted');
  }

  render() {
    if (this.state.isLoading == true) {
      console.log(this.state.members, this.state.contactsData);
      return (
        <View style={[this.state.styles.background]}>
          <View style={[this.state.styles.view]}>
            <View style={[this.state.styles.header]}>
              <Text style={[this.state.styles.headerText]}>
                Contacts
              </Text>
            </View>
            <View style={[this.state.styles.addMemberSearchView]}>
              <TextInput
                style={[this.state.styles.contactSearch, { alignSelf: 'center', marginLeft: '5%', width: '90%' }]}
                placeholder="Search"
                onChangeText={this.searchTextChange}
                onSubmitEditing={() => this.searchPrep()}
              />
            </View>
            <View style={[this.state.styles.activityIndicatorView]}>
              <ActivityIndicator style={[this.state.styles.activityIndicator]} />
            </View>
          </View>
        </View>
      );
    }
    if (this.state.addingContact == true) {
      console.log(this.state.members, this.state.contactsData);
      return (
        <View style={[this.state.styles.background]}>
          <View style={[this.state.styles.view]}>
            <View style={[this.state.styles.header]}>
              <Text style={[this.state.styles.headerText]}>
                Contacts
              </Text>
            </View>
            <View style={[{ flex: 9, justifyContent: 'flex-start' }]}>
              <FlatList
                data={this.state.searchData}
                keyExtractor={(item) => item.user_id}
                renderItem={({ item }) => {
                  if (item.user_id == this.state.userID) {
                    return (<View />);
                  } else if (
                    this.state.members.findIndex((data) => data.user_id == item.user_id) == true
                    || this.state.members.findIndex((data) => data.user_id == item.user_id) == 0) {
                    return (<View />);
                  } else {
                    return (
                      <View style={[this.state.styles.contactBox]}>
                        <View style={[this.state.styles.contactInfoBox]}>
                          <Text style={[this.state.styles.contactInfoName]}>
                            {item.given_name}
                            {' '}
                            {item.family_name}
                          </Text>
                          <Text style={[this.state.styles.contactInfoEmail]}>{item.email}</Text>
                          <Text style={[this.state.styles.contactInfoUserID]}>
                            User ID:
                            {item.user_id}
                            {' '}

                          </Text>
                        </View>
                        <View style={[{ flex: 2, alignSelf: 'center' }]}>
                          <TouchableOpacity onPress={() => { this.addMember(item.user_id); }}>
                            <Image style={[this.state.styles.addContact]} source={require('./images/addcontact.png')} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }
                }}
              />
            </View>
            <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
              <TouchableOpacity
                style={this.state.styles.box}
                onPress={() => { this.setState({ addingContact: false }); }}
              >
                <Text style={this.state.styles.text}>
                  Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      console.log(this.state.members, this.state.contactsData);
      return (
        <View style={[this.state.styles.background]}>
          <View style={[this.state.styles.view]}>
            <View style={[this.state.styles.header]}>
              <Text style={[this.state.styles.headerText]}>
                Contacts
              </Text>
            </View>
            <View style={[this.state.styles.addMemberSearchView]}>
              <TextInput
                style={[this.state.styles.contactSearch, { alignSelf: 'center', marginLeft: '5%', width: '90%' }]}
                placeholder="Search Contacts"
                onChangeText={this.searchTextChange}
                onSubmitEditing={() => this.searchPrep()}
              />
            </View>
            <View style={[{ flex: 9, justifyContent: 'flex-start' }]}>
              <FlatList
                nestedScrollEnabled
                data={this.state.contactsData}
                keyExtractor={(item) => item.user_id}
                renderItem={({ item }) => {
                  if (item.user_id == this.state.userID) {
                    return (<View />);
                  } else if (
                    this.state.members.findIndex((data) => data.user_id == item.user_id) == true
                    || this.state.members.findIndex((data) => data.user_id == item.user_id) == 0) {
                    return (<View />);
                  } else {
                    return (
                      <View style={[this.state.styles.contactBox]}>
                        <View style={[this.state.styles.contactInfoBox]}>
                          <Text style={[this.state.styles.contactInfoName]}>
                            {item.first_name}
                            {' '}
                            {item.last_name}
                          </Text>
                          <Text style={[this.state.styles.contactInfoEmail]}>{item.email}</Text>
                          <Text style={[this.state.styles.contactInfoUserID]}>
                            User ID:
                            {item.user_id}
                            {' '}

                          </Text>
                        </View>
                        <View style={[{ flex: 2, alignSelf: 'center' }]}>
                          <TouchableOpacity onPress={() => { this.addMember(item.user_id); }}>
                            <Image style={[this.state.styles.addContact]} source={require('./images/addcontact.png')} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }
                }}
              />
            </View>
          </View>
        </View>
      );
    }
  }
}
