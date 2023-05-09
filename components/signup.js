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
  Text, TextInput, View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StylesLight from './stylesheet.js';
import StylesDark from './stylesheetdarkmode.js';
import validation from './validation.js';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
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

  addUser() {
    return fetch(
      'http://localhost:3333/api/1.0.0/user',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'first_name': this.state.firstName,
          'last_name': this.state.lastName,
          'email': this.state.email,
          'password': this.state.password,
        }),
      },
    )
      .then((response) => {
        if (response.status == 201) {
          toast.show('User Created', { type: 'success' });
          this.props.navigation.navigate('Log in');
        } else if (response.status == 400) {
          toast.show('Bad Request', { type: 'danger' });
        } else if (response.status == 500) {
          toast.show('Server Error', { type: 'danger' });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  firstNameChange = (text) => {
    this.setState({ firstName: text });
  };

  lastNameChange = (text) => {
    this.setState({ lastName: text });
  };

  emailChange = (text) => {
    this.setState({ email: text });
  };

  passwordChange = (text) => {
    this.setState({ password: text });
  };

  validate() {
    if (this.validateEmail() && this.validatePassword() == true) {
      this.addUser();
    }
  }

  validateEmail() {
    if (validation(this.state.email, 'email') == true) {
      return true;
    } else {
      toast.show('Invalid email', { type: 'danger' });
    }
  }

  validatePassword() {
    if (validation(this.state.password, 'password') == true) {
      return true;
    } else {
      toast.show('Invalid password', { type: 'danger' });
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
  }

  render() {
    return (
      <View style={[this.state.styles.background]}>
        <View style={[this.state.styles.view]}>
          <View style={[this.state.styles.header]}>
            <Text style={[this.state.styles.headerText]}>
              Sign Up
            </Text>
          </View>
          <View style={[{ flex: 7, justifyContent: 'flex-start' }]}>
            <TextInput
              style={[this.state.styles.signupTextInput]}
              autoCapitalize="words"
              placeholder="First Name"
              value={this.state.firstName}
              onChangeText={this.firstNameChange}
            />
            <TextInput
              style={[this.state.styles.signupTextInput]}
              autoCapitalize="words"
              placeholder="Last Name"
              value={this.state.lastName}
              onChangeText={this.lastNameChange}
            />
            <TextInput
              style={[this.state.styles.signupTextInput]}
              autoCapitalize="none"
              placeholder="Email"
              value={this.state.email}
              onChangeText={this.emailChange}
            />
            <TextInput
              style={[this.state.styles.signupTextInput]}
              secureTextEntry
              autoCapitalize="none"
              placeholder="Password"
              value={this.state.password}
              onChangeText={this.passwordChange}
            />
          </View>
          <View style={[{ flex: 3, justifyContent: 'flex-end' }]}>
            <TouchableOpacity
              style={this.state.styles.box}
              title="Sign Up"
              onPress={() => this.validate()}
            >
              <Text style={this.state.styles.text}>
                Sign Up
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
