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
      passwordChanged: false,
    }
  }

  async userInfo() {
    return fetch("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
      })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          profileData: responseJson,
          isLoading: false,
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async updateUserInfo() {
    return fetch("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
        body: JSON.stringify({
          'first_name': this.state.firstName,
          'last_name': this.state.lastName,
          'email': this.state.email,
          'password': this.state.password,
        })
      })
      .then((response) => {
        this.setState({ profileEdit: false })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateUser() {
    if (this.state.firstName == '') {
      this.setState({ firstName: this.state.profileData.first_name })
    }
    if (this.state.lastName == '') {
      this.setState({ lastName: this.state.profileData.last_name })
    }
    if (this.state.email == '') {
      this.setState({ email: this.state.profileData.email })
    }

    this.updateUserInfo();
  }

  validateEmail() {
    if (validation(this.state.email, 'email') == true) {
      return true;
    }
    else {
      alert("Incorect email");
    }
  }

  validatePassword() {
    if (validation(this.state.password, 'password') == true) {
      return true;
    }
    else {
      alert("Incorect password");
    }
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

  async componentDidMount() {
    await this.userInfo();
  }

  render() {
    if (this.state.isLoading == true) {
      return (
        <View style={[styles.view]}>
          <ActivityIndicator />
        </View>
      );
    }
    if (this.state.profileEdit == true) {
      return (
        <View style={[styles.view]}>
          <Text style={[styles.text]}>
            First Name: {this.state.profileData.first_name}
          </Text>
          <TextInput
            style={[styles.text, { placeholderTextColor: 'grey' }]}
            placeholder="name"
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
         Password: {this.state.profileData.email}
          </Text>
          <TextInput
            style={[styles.text, { placeholderTextColor: 'grey' }]}
            placeholder='Password'
            value={this.state.password}
            onChangeText={this.passwordChange}
          />
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
              profileEdit:false,
            })}>
            <Text style={styles.text}>Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={[styles.view]}>
        <Text style={[styles.text]}>
          {this.state.profileData.first_name}
        </Text>
        <Text style={styles.text}> </Text>

        <Text style={[styles.text]}>
          {this.state.profileData.last_name}
        </Text>
        <Text style={styles.text}> </Text>

        <Text style={[styles.text]}>
          {this.state.profileData.email}
        </Text>
        <Text style={styles.text}> </Text>

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
    );
  }
}



export default Profile;
