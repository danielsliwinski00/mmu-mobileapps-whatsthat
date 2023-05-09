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
  FlatList, ActivityIndicator, Text, View, Image,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StylesLight from './stylesheet.js';
import StylesDark from './stylesheetdarkmode.js';

export default class Blocked extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsData: [],
      userID: '',
      styles: StylesLight,
      style: '',
    };
  }

  async unblockContact(id) {
    this.setState({
      isLoading: true,
    });
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + id + '/block',
      {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then(async (response) => {
        if (response.status == 200) {
          toast.show('User Unblocked', { type: 'success' });
          this.fetchAccounts();
          this.setState({
            isLoading: false,
          });
          this.props.navigation.pop();
        } else if (response.status == 400) {
          toast.show("You can't block yourself", { type: 'danger' });
          throw "You can't block yourself";
        } else if (response.status == 401) {
          toast.show('Unauthorized', { type: 'danger' });
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
      'http://localhost:3333/api/1.0.0/blocked',
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

  async setColorScheme() {
    if (this.state.style == 'light') {
      this.setState({ styles: StylesLight });
    } else {
      this.setState({ styles: StylesDark });
    }
  }

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
                Blocked List
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
              Blocked List
            </Text>
          </View>
          <View style={[{ flex: 10, justifyContent: 'flex-start' }]}>
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
                          {item.first_name}
                          {' '}
                          {item.last_name}
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
                        <TouchableOpacity onPress={() => { this.unblockContact(item.user_id); }}>
                          <Image style={[this.state.styles.addContact]} source={require('./images/unblockcontact.png')} />
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
