import React, { Component } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image, Modal } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents } from 'react-navigation';
import styles from './stylesheet.js';
import validation from './validation.js';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      profileEdit: false,
      profileData: {},
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dataReceived: false,
      fnameChanged: false,
      lnameChanged: false,
      emailChanged: false,
      passwordChanged: false,
    }
  }

  async userInfo() {
    return fetch("http://192.168.1.102:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
      })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        //console.log(responseJson)
        this.setState({
          profileData: responseJson,
          isLoading: false,
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async logOut() {
    return fetch("http://192.168.1.102:3333/api/1.0.0/logout",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
      })
      .then(async (response) => {
        if (response.status == 200) {
          await AsyncStorage.removeItem("whatsthatID")
          await AsyncStorage.removeItem("whatsthatSessionToken")
          this.props.navigation.navigate('Home');
        }
        else if (response.status == 401) {
          await AsyncStorage.removeItem("whatsthatID")
          await AsyncStorage.removeItem("whatsthatSessionToken")
          this.props.navigation.navigate('Home');
        }
        else {
          throw "Something went wrong"
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async updateUserRequest() {
    if (this.state.fnameChanged == true) {
      await this.updateUserFName();
    }
    if (this.state.lnameChanged == true) {
      await this.updateUserLName();
    }
    if (this.state.emailChanged == true) {
      if (this.validateEmail(this.state.email, "email") == true) {
        await this.updateUserEmail();
      }
    }
    if (this.state.passwordChanged == true) {
      if (this.validatePassword(this.state.password, "password") == true) {
        await this.updateUserPassword();
      }
    }
    this.userInfo();
    this.setState({
      profileEdit: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      fnameChanged: false,
      lnameChanged: false,
      emailChanged: false,
      passwordChanged: false,
    })
  }

  async updateUserFName() {
    return fetch("http://192.168.1.102:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
        body: JSON.stringify({
          'first_name': this.state.firstName,
        })
      })
      .then((response) => {
        console.log("successfully changed first name");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async updateUserLName() {
    return fetch("http://192.168.1.102:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
        body: JSON.stringify({
          'last_name': this.state.lastName,
        })
      })
      .then((response) => {
        console.log("successfully changed last name");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async updateUserEmail() {
    return fetch("http://192.168.1.102:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
        body: JSON.stringify({
          'email': this.state.email,
        })
      })
      .then((response) => {
        console.log("successfully changed email");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async updateUserPassword() {
    return fetch("http://192.168.1.102:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
        body: JSON.stringify({
          'password': this.state.password,
        })
      })
      .then((response) => {
        console.log("successfully changed password");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateUser() {
    if (this.state.firstName == '') {
      this.setState({
        fnameChanged: false,
      })
    }
    if (this.state.lastName == '') {
      this.setState({
        lnameChanged: false,
      })
    }
    if (this.state.email == '') {
      this.setState({
        emailChanged: false,
      })
    }
    if (this.state.password == '') {
      this.setState({
        passwordChanged: false
      })
    }

    this.updateUserRequest();
  }

  validateEmail() {
    if (validation(this.state.email, 'email') == true) {
      return true;
    }
    else {
      alert("Incorect email format");
    }
  }

  validatePassword() {
    if (validation(this.state.password, 'password') == true) {
      return true;
    }
    else {
      alert("Incorect password format");
    }
  }

  firstNameChange = (text) => {
    this.setState({ firstName: text, fnameChanged: true, })
  }

  lastNameChange = (text) => {
    this.setState({ lastName: text, lnameChanged: true, })
  }

  emailChange = (text) => {
    this.setState({ email: text, emailChanged: true, })
  }

  passwordChange = (text) => {
    this.setState({ password: text, passwordChanged: true, })
  }

  async componentDidMount() {
    await this.userInfo();
  }

  render() {
    if (this.state.isLoading == true) {
      return (
        <View style={[styles.background]}>
          <View style={[styles.view]}>
            <View style={[styles.header]}>
              <Text style={[styles.headerText,]}>
                Profile
              </Text>
            </View>
            <View style={[styles.activityIndicatorView]}>
              <ActivityIndicator style={[styles.activityIndicator]} />
            </View>
          </View>
        </View>
      );
    }
    if (this.state.profileEdit == true) {
      return (
        <View style={[styles.background]}>
          <View style={[styles.view]}>
            <View style={[styles.header]}>
              <Text style={[styles.headerText]}>
                Edit Profile
              </Text>
            </View>
            <ScrollView style={[{ flex: 8, }]}>
              <View style={[{ flex: 1 }]}>
                <Text style={[styles.profileText]}>
                  First Name:{'\n'}{this.state.profileData.first_name}
                </Text>
                <TextInput
                  style={[styles.profileTextInput,]}
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChangeText={this.firstNameChange}
                />
                <Text style={[styles.profileText,]}>
                  Last Name:{'\n'}{this.state.profileData.last_name}
                </Text>
                <TextInput
                  style={[styles.profileTextInput,]}
                  placeholder='Last Name'
                  value={this.state.lastName}
                  onChangeText={this.lastNameChange}
                />
                <Text style={[styles.profileText,]}>
                  Email:{'\n'}{this.state.profileData.email}
                </Text>
                <TextInput
                  style={[styles.profileTextInput,]}
                  placeholder='Email'
                  value={this.state.email}
                  onChangeText={this.emailChange}
                />
                <Text style={[styles.profileText,]}>
                  Password:
                </Text>
                <TextInput
                  style={[styles.profileTextInput,]}
                  placeholder='Password'
                  value={this.state.password}
                  onChangeText={this.passwordChange}
                />
              </View>
            </ScrollView>
            <View style={[{ flex: 3, justifyContent: 'flex-end' }]}>
              <TouchableOpacity
                style={styles.box}
                title='updatebtn'
                onPress={() => this.updateUser()}>
                <Text style={[styles.profileTextInput,]}>Update User Info
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.box}
                title='updatebtn'
                onPress={() => this.setState({
                  profileEdit: false,
                })}>
                <Text style={[styles.profileTextInput,]}>Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
    return (
      <View style={[styles.background]}>
        <View style={[styles.view]}>
          <View style={[styles.header]}>
            <Text style={[styles.headerText]}>
              Profile
            </Text>
          </View>
          <View style={[{ flex: 7, justifyContent: 'flex-start' }]}>
            <Text style={[styles.profileText,]}>
              First Name:{'\n'}{this.state.profileData.first_name}
            </Text>
            <Text style={[styles.profileText,]}>
              Last Name:{'\n'}{this.state.profileData.last_name}
            </Text>
            <Text style={[styles.profileText,]}>
              Email:{'\n'}{this.state.profileData.email}
            </Text>
          </View>
          <View style={[{ flex: 4, justifyContent: 'flex-end' }]}>
            <TouchableOpacity style={[styles.box]}
              onPress={() => this.setState({ profileEdit: true })}>
              <Text style={[styles.profileText]}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.box]}
              onPress={() => this.logOut()}>
              <Text style={[styles.profileText]}>Log out</Text>
            </TouchableOpacity >
          </View>
        </View>
      </View>
    );
  }
}

/*
<TouchableOpacity
              style={styles.box}
              title="Home"
              onPress={() => this.props.navigation.navigate('AppHome')}>
              <Text style={styles.profileText}>Home
              </Text>
            </TouchableOpacity>
*/