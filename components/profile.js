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
      profileUpdateData: [],
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dataReceived: false,
      fnameChanged: false,
      lnameChanged: false,
      emailChanged: false,
      passwordChanged: false,
      userPhoto: undefined,
    }
  }

  async userInfo() {
    return fetch("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
      })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
        else if (response.status == 401) {
          toast.show("Unauthorized", { type: 'danger' })
        }
        else if (response.status == 404) {
          toast.show("Not Found", { type: 'danger' })
        }
        else {
          toast.show("Server Error", { type: 'danger' })
        }
      })
      .then((responseJson) => {
        //console.log(responseJson)
        this.setState({
          profileData: responseJson,
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          email: responseJson.email,
          isLoading: false,
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async logOut() {
    return fetch("http://localhost:3333/api/1.0.0/logout",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
      })
      .then(async (response) => {
        if (response.status == 200) {
          toast.show("Logged out", { type: 'success' })
          await AsyncStorage.removeItem("whatsthatID")
          await AsyncStorage.removeItem("whatsthatSessionToken")
          this.props.navigation.navigate('Home');
        }
        else if (response.status == 401) {
          toast.show("Unauthorized", { type: 'danger' })
          await AsyncStorage.removeItem("whatsthatID")
          await AsyncStorage.removeItem("whatsthatSessionToken")
          this.props.navigation.navigate('Home');
        }
        else {
          toast.show("Server error", { type: 'danger' })
          throw "Something went wrong"
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async updateUserInfo() {
    console.log(this.state.profileUpdateData)
    return fetch("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
        body: JSON.stringify({
          'first_name': this.state.profileUpdateData.first_name,
          'last_name': this.state.profileUpdateData.last_name,
          'email': this.state.profileUpdateData.email,
          'password': this.state.profileUpdateData.password
        })
      })
      .then((response) => {
        if (response.status == 200) {
          toast.show("User Updated", { type: 'success' })
          this.userInfo();
        }
        if (response.status == 400) {
          toast.show("Bad Request", { type: 'danger' })
        }
        if (response.status == 401) {
          toast.show("Unauthorized", { type: 'danger' })
        }
        if (response.status == 403) {
          toast.show("Forbidden", { type: 'danger' })
        }
        if (response.status == 404) {
          toast.show("Not Found", { type: 'danger' })
        }
        else {
          toast.show("Server Error", { type: 'danger' })
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async updateUserRequest() {
    var updated = this.state.profileData
    if (this.state.firstName != this.state.profileData.first_name) {
      updated.first_name = this.state.firstName
    }
    if (this.state.lastName != this.state.profileData.last_name) {
      updated.last_name = this.state.lastName
    }
    if (this.state.email != this.state.profileData.email) {
      if (this.validateEmail(this.state.email, "email") == true) {
        updated.email = this.state.email
      }
    }
    if (this.state.passwordChanged == true) {
      if (this.validatePassword(this.state.password, "password") == true) {
        updated.password = this.state.password
      }
    }
    this.setState({
      profileUpdateData: updated
    }, () => { this.updateUserInfo(); })
  }

  async uploadPhoto() {
    return fetch("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID") + "/photo",
      {
        method: 'POST ',
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

  async getPhoto() {
    return fetch("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID") + "/photo",
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
      })
      .then((response) => {
        return response.JSON()
      })
      .then((responseJson) => {
        this.setState({
          userPhoto: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateUser() {
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
      toast.show("Incorrect Email Format", { type: 'danger' })
    }
  }

  validatePassword() {
    if (validation(this.state.password, 'password') == true) {
      return true;
    }
    else {
      toast.show("Incorrect Password Format", { type: 'danger' })
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

  componentDidMount() {
    this.userInfo();
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
                  First Name:
                </Text>
                <TextInput
                  style={[styles.profileTextInput,]}
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChangeText={this.firstNameChange}
                />
                <Text style={[styles.profileText,]}>
                  Last Name:
                </Text>
                <TextInput
                  style={[styles.profileTextInput,]}
                  placeholder='Last Name'
                  value={this.state.lastName}
                  onChangeText={this.lastNameChange}
                />
                <Text style={[styles.profileText,]}>
                  Email:
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
              First Name:{'\n'}{this.state.firstName}
            </Text>
            <Text style={[styles.profileText,]}>
              Last Name:{'\n'}{this.state.lastName}
            </Text>
            <Text style={[styles.profileText,]}>
              Email:{'\n'}{this.state.email}
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