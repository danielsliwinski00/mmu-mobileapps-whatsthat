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
  Text, TextInput, View, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StylesLight from './stylesheet.js';
import StylesDark from './stylesheetdarkmode.js';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      // emailTest: 'test@mail.com',
      // passwordTest: 'Password1!',
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

  login() {
    return fetch(
      'http://localhost:3333/api/1.0.0/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'email': this.state.email,
          'password': this.state.password,
        }),
      },
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 400) {
          toast.show('Invalid email or password', { type: 'danger' });
          throw 'Invalid email or password';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Something went wrong';
        }
      })
      .then(async (responseJson) => {
        try {
          await AsyncStorage.setItem('whatsthatID', responseJson.id);
          await AsyncStorage.setItem('whatsthatSessionToken', responseJson.token);
          this.setState({
            email: '',
            password: '',
          });
          this.props.navigation.navigate('AppHome');
        } catch {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'something went wrong';
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  emailChange = (text) => {
    this.setState({ email: text });
  };

  passwordChange = (text) => {
    this.setState({ password: text });
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
  }

  render() {
    if (this.state.isLoading == true) {
      return (
        <View style={[this.state.styles.background]}>
          <View style={[this.state.styles.view]}>
            <View style={[this.state.styles.header]}>
              <Text style={[this.state.styles.headerText]}>
                Welcome to WhatsThat
              </Text>
            </View>
            <View style={[this.state.styles.activityIndicatorView]}>
              <ActivityIndicator style={[this.state.styles.activityIndicator]} />
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={[this.state.styles.background]}>
        <View style={[this.state.styles.view]}>
          <View style={[this.state.styles.header]}>
            <Text style={[this.state.styles.headerText]}>
              Log in
            </Text>
          </View>
          <View style={[{ flex: 7, justifyContent: 'flex-start' }]}>
            <TextInput
              style={[this.state.styles.signupTextInput]}
              autoCapitalize="none"
              placeholder="Email"
              value={this.state.email}
              onChangeText={this.emailChange}
            />
            <TextInput
              style={[this.state.styles.signupTextInput]}
              autoCapitalize="none"
              secureTextEntry
              placeholder="Password"
              value={this.state.password}
              onChangeText={this.passwordChange}
            />
          </View>
          <View style={[{ flex: 3, justifyContent: 'flex-end' }]}>
            <TouchableOpacity
              style={this.state.styles.box}
              title="Log In"
              onPress={() => this.login()}
            >
              <Text style={this.state.styles.text}>
                Log in
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={this.state.styles.box}
              title="Home"
              onPress={() => this.props.navigation.navigate('Home')}
            >
              <Text style={this.state.styles.text}>
                Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
