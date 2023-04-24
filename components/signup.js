import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from './stylesheet.js';
import validation from './validation.js';

export default class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    }
  }

  addUser() {
    return fetch("http://localhost:3333/api/1.0.0/user",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "first_name": this.state.firstName,
          "last_name": this.state.lastName,
          "email": this.state.email,
          "password": this.state.password
        })
      })
      .then((response) => {
        if (response.status == 201) {
          toast.show("User Created", { type: 'success' })
          this.props.navigation.navigate('Log in');
        }
        else if (response.status == 400) {
          toast.show("Bad Request", { type: 'danger' })
        }
        else {
          toast.show("Server Error", { type: 'danger' })
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }

  firstNameChange = (text) => {
    this.setState({ firstName: text })
  }

  lastNameChange = (text) => {
    this.setState({ lastName: text })
  }

  emailChange = (text) => {
    this.setState({ email: text })
  }

  passwordChange = (text) => {
    this.setState({ password: text })
  }

  validate() {
    if (this.validateEmail() && this.validatePassword() == true) {
      this.addUser();
    }
    else {
    }
  }

  validateEmail() {
    if (validation(this.state.email, 'email') == true) {
      return true;
    }
    else {
      toast.show("Invalid email", { type: 'danger' })
    }
  }

  validatePassword() {
    if (validation(this.state.password, 'password') == true) {
      return true;
    }
    else {
      toast.show("Invalid password", { type: 'danger' })
    }
  }

  render() {
    return (
      <View style={[styles.background]}>
        <View style={[styles.view]}>
          <View style={[styles.header]}>
            <Text style={[styles.headerText]}>
              Sign Up
            </Text>
          </View>
          <View style={[{ flex: 7, justifyContent: 'flex-start' }]}>
            <TextInput
              style={[styles.signupTextInput]}
              autoCapitalize={'words'}
              placeholder='First Name'
              value={this.state.firstName}
              onChangeText={this.firstNameChange}
            />
            <TextInput
              style={[styles.signupTextInput]}
              autoCapitalize={'words'}
              placeholder='Last Name'
              value={this.state.lastName}
              onChangeText={this.lastNameChange}
            />
            <TextInput
              style={[styles.signupTextInput]}
              autoCapitalize={'none'}
              placeholder='Email'
              value={this.state.email}
              onChangeText={this.emailChange}
            />
            <TextInput
              style={[styles.signupTextInput]}
              secureTextEntry={true}
              autoCapitalize={'none'}
              placeholder='Password'
              value={this.state.password}
              onChangeText={this.passwordChange}
            />
          </View>
          <View style={[{ flex: 3, justifyContent: 'flex-end' }]}>
            <TouchableOpacity
              style={styles.box}
              title='Sign Up'
              onPress={() => this.validate()}>
              <Text style={styles.text}>Sign Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.box}
              title="Home"
              onPress={() => this.props.navigation.navigate('Home')}>
              <Text style={styles.text}>Home
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    );
  }
}