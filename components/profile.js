import React, { Component } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image, Modal } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents } from 'react-navigation';
import styles from './stylesheet.js';
import validation from './validation.js';
import CameraBasic from './camera.js';
import { Camera } from 'expo-camera';

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
      passwordChanged: false,
      userPhoto: undefined,
      draftMessages: [],
      photoU: false,
      profilePhoto: undefined,
    }
  }

  async userProfilePhoto() {
    return fetch("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID") + "/photo",
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
      })
      .then((response) => {
        if (response.status == 200) {
          return response.blob();
        }
        else if (response.status == 401) {
          toast.show("Unauthorized", { type: 'danger' })
        }
        else if (response.status == 404) {
          toast.show("Not Found", { type: 'danger' })
          throw 'Not Found'
        }
        else {
          toast.show("Something went wrong", { type: 'danger' })
          throw 'Server Error'
        }
      })
      .then((responseBlob) => {
        let data = URL.createObjectURL(responseBlob)
        this.setState({
          profilePhoto: data,
          isLoading: false,
        })
      })
      .catch((error) => {
        console.log(error);
      });
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
          throw 'Not Found'
        }
        else {
          toast.show("Something went wrong", { type: 'danger' })
          throw 'Server Error'
        }
      })
      .then((responseJson) => {
        //console.log(responseJson)
        this.setState({
          profileData: responseJson,
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          email: responseJson.email,
        }, () => { this.userProfilePhoto() })
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
          toast.show("Something went wrong", { type: 'danger' })
          throw "Server Error"
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async logOutLoading() {
    await AsyncStorage.removeItem("whatsthatID")
    await AsyncStorage.removeItem("whatsthatSessionToken")
    this.props.navigation.navigate('Home');
  }

  async updateUserInfo() {
    console.log(this.state.profileUpdateData)
    return fetch("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthatID"),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
        body: JSON.stringify(this.state.profileUpdateData)
      })
      .then((response) => {
        if (response.status == 200) {
          //toast.show("User Updated", { type: 'success' })
          this.setState({ profileEdit: false })
          this.userInfo();
        }
        else if (response.status == 400) {
          toast.show("Bad Request", { type: 'danger' })
        }
        else if (response.status == 401) {
          toast.show("Unauthorized", { type: 'danger' })
        }
        else if (response.status == 403) {
          toast.show("Forbidden", { type: 'danger' })
        }
        else if (response.status == 404) {
          toast.show("Not Found", { type: 'danger' })
        }
        else {
          toast.show("Something went wrong", { type: 'danger' })
          throw "Server Error"
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async updateUserRequest() {
    var updated = {}
    if (this.state.firstName != this.state.profileData.first_name && this.state.firstName != '') {
      updated['first_name'] = this.state.firstName
    }
    if (this.state.lastName != this.state.profileData.last_name && this.state.firstName != '') {
      updated['last_name'] = this.state.lastName
    }
    if (this.state.email != this.state.profileData.email && this.state.email != '') {
      if (this.validateEmail(this.state.email, "email") == true) {
        updated['email'] = this.state.email
      }
    }
    if (this.state.passwordChanged == true) {
      if (this.validatePassword(this.state.password, "password") == true) {
        updated['password'] = this.state.password
      }
    }
    this.setState({
      profileUpdateData: updated
    }, () => { this.updateUserInfo(); })
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

  sendDraft = async (draftid, chatid, message) => {
    var drafts = this.state.draftMessages;
    if (drafts.findIndex(data => data.draftID == draftid) == 0) {
      let index = drafts.findIndex(data => data.draftID == draftid)
      drafts[index].time = ""
      this.setState({
        draftMessages: drafts,
        counter: this.state.counter += 1,
      }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
    }
    else if (drafts.findIndex(data => data.draftID == draftid)) {
      let index = drafts.findIndex(data => data.draftID == draftid)
      drafts[index].time = ""
      this.setState({
        draftMessages: drafts,
        counter: this.state.counter += 1,
      }, async () => { await AsyncStorage.setItem("draftMessages", JSON.stringify(this.state.draftMessages)) })
    }
    return fetch("http://localhost:3333/api/1.0.0/chat/" + chatid + "/message",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") },
        body: JSON.stringify(
          {
            "message": message
          }
        )
      })
      .then((response) => {
        if (response.status == 200) {
          toast.show("Draft Message Sent", { type: 'success' })
        }
        else if (response.status == 400) {
          toast.show("Bad Request", { type: 'danger' })
          throw "Bad Request"
        }
        else if (response.status == 401) {
          toast.show("Unauthorised", { type: 'danger' })
          throw "Unauthorised"
        }
        else if (response.status == 403) {
          toast.show("Forbidden", { type: 'danger' })
          throw "Forbidden"
        }
        else if (response.status == 404) {
          toast.show("Not Found", { type: 'danger' })
          throw "Not Found"
        }
        else {
          toast.show("Something went wrong", { type: 'danger' })
          throw "Server Error"
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkDraftTimes() {
    var drafts = this.state.draftMessages;
    let date = new Date()
    let time = date
    time.setSeconds(0);
    time.setMilliseconds(0);
    let timeFinal = new Date(time.toISOString())

    for (let i = 0; i < drafts.length; i++) {
      console.log(time)
      let draftDate = new Date(drafts[i].time)
      console.log(draftDate)
      if (draftDate.getTime() == timeFinal.getTime()) {
        let draftid = drafts[i].draftID
        let chatid = drafts[i].chatID
        let message = drafts[i].message
        this.sendDraft(draftid, chatid, message)
      }
      else {
        console.log('not same time')
      }
    }
  }

  async componentDidMount() {
    if (await AsyncStorage.getItem("draftMessages") == 'undefined') {
      await this.setState({
        draftMessages: await AsyncStorage.getItem("draftMessages"),
      })
    }
    else {
      await this.setState({
        draftMessages: JSON.parse(await AsyncStorage.getItem("draftMessages")),
      })
    }

    this.userInfo();
    this.draftTimerID = setInterval(() => { this.checkDraftTimes() }, 10000)

    this.props.navigation.addListener('focus', async () => {
    });
  }

  componentWillUnmount() {
    clearInterval(this.draftTimerID),
      console.log('unmounted')
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
            <View style={[{ justifyContent: 'flex-end' }]}>
              <TouchableOpacity style={[styles.box]}
                onPress={() => this.logOutLoading()}>
                <Text style={[styles.profileText]}>Log out</Text>
              </TouchableOpacity >
            </View>
          </View>
        </View>
      );
    }
    if (this.state.photoU == true) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 14 }}>
            <CameraBasic />
          </View>
          <View style={{ flex: 2 }}>
            <TouchableOpacity style={[styles.box]}
              onPress={() => { this.userInfo(); this.setState({ photoU: false }) }}>
              <Text style={[styles.profileText]}>Back/Cancel</Text>
            </TouchableOpacity >
          </View>
        </View>
      )
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
                <Text style={[styles.profileText,]}>
                  Photo:
                </Text>
                <Image style={{ width: 80, height: 80, marginLeft: 20 }} source={{ uri: this.state.profilePhoto }} />
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
            <View style={[{ flex: 3 }]}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={[styles.box, { flex: 1 }]}
                  title='updatebtn'
                  onPress={() => this.updateUser()}>
                  <Text style={[styles.profileTextInput, { fontSize: 16 }]}>Update User Info
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.box, { flex: 1 }]}
                  onPress={() => this.setState({ photoU: true })}>
                  <Text style={[styles.profileText, { fontSize: 16 }]}>Update Photo</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.box}
                  title='updatebtn'
                  onPress={() => this.setState({
                    profileEdit: false,
                  })}>
                  <Text style={[styles.profileTextInput,]}>Back/Cancel
                  </Text>
                </TouchableOpacity>
              </View>
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
          <ScrollView style={[{ flex: 7 }]}>
            <Text style={[styles.profileText,]}>
              Photo:
            </Text>
            <Image style={{ width: 80, height: 80, marginLeft: 20 }} source={{ uri: this.state.profilePhoto }} />
            <Text style={[styles.profileText,]}>
              First Name:{'\n'}{this.state.firstName}
            </Text>
            <Text style={[styles.profileText,]}>
              Last Name:{'\n'}{this.state.lastName}
            </Text>
            <Text style={[styles.profileText,]}>
              Email:{'\n'}{this.state.email}
            </Text>
          </ScrollView>
          <View style={[{ flex: 3, justifyContent: 'flex-end' }]}>
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