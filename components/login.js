import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailTest: 'test@mail.com',
      passwordTest: 'Password1!',
    }
  }

  login() {
    return fetch("http://localhost:3333/api/1.0.0/login",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "email": this.state.emailTest,
          "password": this.state.passwordTest,
        })
      })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 400) {
          toast.show("Invalid email or password", { type: 'danger' })
          throw "Invalid email or password"
        } else {
          toast.show("Something went wrong", { type: 'danger' })
          throw "Something went wrong"
        }
      })
      .then(async (responseJson) => {
        try {
          await AsyncStorage.setItem("whatsthatID", responseJson.id)
          await AsyncStorage.setItem("whatsthatSessionToken", responseJson.token)
          this.setState({
            email: "",
            password: "",
          })
          this.props.navigation.navigate('AppHome');
        } catch {
          toast.show("Something went wrong", { type: 'danger' })
          throw "something went wrong"
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  validate() {
    if (validation(this.state.email, this.state.password) == true) {
      this.login();
    }
    else {
      toast.show("Invalid email or password", { type: 'danger' })
    }
  }

  emailChange = (text) => {
    this.setState({ email: text })
  }

  passwordChange = (text) => {
    this.setState({ password: text })
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={[styles.background]}>
        <View style={[styles.view]}>
          <View style={[styles.header]}>
            <Text style={[styles.headerText]}>
              Log in
            </Text>
          </View>
          <View style={[{ flex: 7, justifyContent: 'flex-start' }]}>
            <TextInput
              style={[styles.signupTextInput]}
              autoCapitalize={'none'}
              placeholder='Email'
              value={this.state.email}
              onChangeText={this.emailChange}
            />
            <TextInput
              style={[styles.signupTextInput]}
              autoCapitalize={'none'}
              secureTextEntry={true}
              placeholder='Password'
              value={this.state.password}
              onChangeText={this.passwordChange}
            />
          </View>
          <View style={[{ flex: 3, justifyContent: 'flex-end' }]}>
            <TouchableOpacity
              style={styles.box}
              title='Log In'
              onPress={() => this.login()}>
              <Text style={styles.text}>Log in
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
    )
  }
}