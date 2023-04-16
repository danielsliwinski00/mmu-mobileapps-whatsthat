import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';

class Profile extends Component {
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
    return fetch("http://192.168.1.209:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
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
    return fetch("http://192.168.1.209:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
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
    return fetch("http://192.168.1.209:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
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
    return fetch("http://192.168.1.209:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
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
    return fetch("http://192.168.1.209:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
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
        <View style={{}}>
          <View style={[styles.header]}>
            <Text style={[styles.headerText]}>
              Edit Profile
            </Text>
          </View>
          <View style={[styles.view, {flex:11, top: '50%', alignSelf: 'center' }]}>
                    <ActivityIndicator />
                </View>
        </View>
      );
    }
    if (this.state.profileEdit == true) {
      return (
        <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
          <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
            <View style={[styles.header]}>
              <Text style={[styles.headerText]}>
                Edit Profile
              </Text>
            </View>
            <View style={[{ flex: 9, justifyContent: 'flex-start' }]}>
              <Text style={[styles.text]}>
                First Name: {this.state.profileData.first_name}
              </Text>
              <TextInput
                style={[styles.text, { placeholderTextColor: 'grey' }]}
                placeholder="First Name"
                value={this.state.firstName}
                onChangeText={this.firstNameChange}
              />
              <Text style={[styles.text]}>
                Last Name: {this.state.profileData.last_name}
              </Text>
              <TextInput
                style={[styles.text, { placeholderTextColor: 'grey' }]}
                placeholder='Last Name'
                value={this.state.lastName}
                onChangeText={this.lastNameChange}
              />
              <Text style={[styles.text]}>
                Email: {this.state.profileData.email}
              </Text>
              <TextInput
                style={[styles.text, { placeholderTextColor: 'grey' }]}
                placeholder='Email'
                value={this.state.email}
                onChangeText={this.emailChange}
              />
              <Text style={[styles.text]}>
                Password:
              </Text>
              <TextInput
                style={[styles.text, { placeholderTextColor: 'grey' }]}
                placeholder='Password'
                value={this.state.password}
                onChangeText={this.passwordChange}
              />
            </View>
            <View style={[{ flex: 2, justifyContent: 'flex-end' }]}>
              <TouchableOpacity
                style={styles.box}
                title='updatebtn'
                onPress={() => this.updateUser()}>
                <Text style={styles.text}>Update User Info
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.box}
                title='updatebtn'
                onPress={() => this.setState({
                  profileEdit: false,
                })}>
                <Text style={styles.text}>Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
    return (
      <View style={[{ flex: 1, backgroundColor: '#f2f2f2' }]}>
        <View style={[styles.viewHome, { flex: 1, padding: 0, }]}>
          <View style={[styles.header]}>
            <Text style={[styles.headerText]}>
              Profile
            </Text>
          </View>
          <View style={[{ flex: 7, justifyContent: 'flex-start' }]}>
            <Text style={[styles.text]}>
              First Name: {this.state.profileData.first_name}
            </Text>
            <Text style={styles.text}> </Text>

            <Text style={[styles.text]}>
              Last Name: {this.state.profileData.last_name}
            </Text>
            <Text style={styles.text}> </Text>

            <Text style={[styles.text]}>
              Email: {this.state.profileData.email}
            </Text>
            <Text style={styles.text}> </Text>
          </View>
          <View style={[{ flex: 4, justifyContent: 'flex-end' }]}>
            <TouchableOpacity style={[styles.box]}
              onPress={() => this.setState({ profileEdit: true })}>
              <Text style={[styles.text]}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.box}
              title="Home"
              onPress={() => this.props.navigation.navigate('AppHome')}>
              <Text style={styles.text}>Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}



export default Profile;
