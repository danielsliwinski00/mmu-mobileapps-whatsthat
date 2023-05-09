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

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsData: [],
      userID: '',
      searchText: '',
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
      `http://localhost:3333/api/1.0.0/search?limit=50&q=${this.state.searchText}`,
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
        if (response.status == 400) {
          toast.show('Bad Request', { type: 'danger' });
          throw 'Bad Request';
        } else if (response.status == 401) {
          toast.show('Unauthorised', { type: 'danger' });
          throw 'Unauthorized';
        } else if (response.status == 500) {
          toast.show('Server Error', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .then((responseJson) => {
        this.setState({
          contactsData: responseJson,
          isLoading: false,
          searchText: '',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async addContact(id) {
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${id}/contact`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then(async (response) => {
        if (response.status == 200) {
          toast.show('Contact Added', { type: 'success' });
          this.fetchAccounts();
          this.props.navigation.pop();
        } else if (response.status == 400) {
          toast.show("You can't add yourself as a contact", { type: 'danger' });
          throw "You can't add yourself as a contact";
        } else if (response.status == 401) {
          toast.show('Unauthorised', { type: 'danger' });
          throw 'Unauthorized';
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

  async fetchAccounts() {
    return fetch(
      'http://localhost:3333/api/1.0.0/search',
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then(async (response) => {
        if (response.status == 200) {
          return response.json();
        }
        if (response.status == 400) {
          toast.show('Unauthorised', { type: 'danger' });
          throw 'Bad Request';
        } else if (response.status == 401) {
          toast.show('Unauthorised', { type: 'danger' });
          throw 'Unauthorised';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .then((responseJson) => {
        this.setState({
          contactsData: responseJson,
          isLoading: false,
        });
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
      userID: await AsyncStorage.getItem('whatsthatID'),
    });
    this.fetchAccounts();
  }

  componentWillUnmount() {
    console.log('unmounted');
  }

  render() {
    if (this.state.isLoading == true) {
      return (
        <View style={[this.state.styles.background]}>
          <View style={[this.state.styles.view]}>
            <View style={[this.state.styles.header]}>
              <Text style={[this.state.styles.headerText]}>
                Search
              </Text>
            </View>
            <View style={[this.state.styles.view, { flex: 10 }]}>
              <ActivityIndicator style={[this.state.styles.activityIndicator]} />
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={[this.state.styles.background]}>
        <View style={[this.state.styles.viewHome, { flex: 1, padding: 0 }]}>
          <View style={[this.state.styles.header]}>
            <Text style={[this.state.styles.headerText]}>
              Search
            </Text>
          </View>
          <View style={[{
            flex: 1, marginTop: 10, marginHorizontal: 10, backgroundColor: 'transparent', flexDirection: 'column',
          }]}
          >
            <TextInput
              style={[this.state.styles.contactSearch, {
                alignSelf: 'center', width: 340, marginRight: 0, fontSize: 20,
              }]}
              placeholder="Search name lastname or email"
              onChangeText={this.searchTextChange}
              onSubmitEditing={() => this.searchPrep()}
            />
          </View>
          <View style={[{ flex: 1, marginTop: -25, backgroundColor: 'transparent' }]}>
            <Text style={[this.state.styles.text, { alignSelf: 'center', fontSize: 20, marginTop: 25 }]}>
              Your User ID:
              {this.state.userID}
            </Text>
          </View>
          <View style={[{ flex: 9, justifyContent: 'flex-start' }]}>
            <FlatList
              data={this.state.contactsData}
              keyExtractor={(item) => item.user_id}
              renderItem={({ item }) => {
                if (item.user_id != this.state.userID) {
                  return (
                    <View style={[this.state.styles.contactBox]}>
                      <View style={[this.state.styles.contactInfoBox]}>
                        <Text style={[this.state.styles.contactInfoName]}>
                          {' '}
                          {item.given_name}
                          {' '}
                          {item.family_name}
                          {' '}
                        </Text>
                        <Text style={[this.state.styles.contactInfoEmail]}>
                          {' '}
                          {item.email}
                          {' '}
                        </Text>
                        <Text style={[this.state.styles.contactInfoUserID]}>
                          {' '}
                          User ID:
                          {item.user_id}
                          {' '}
                        </Text>
                      </View>
                      <View style={[{ flex: 2, alignSelf: 'center' }]}>
                        <TouchableOpacity onPress={() => { this.addContact(item.user_id); }}>
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
