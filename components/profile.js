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
  ActivityIndicator, Text, TextInput, View, Image,
} from 'react-native';
import {
  TouchableOpacity, ScrollView,
} from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StylesLight from './stylesheet.js';
import StylesDark from './stylesheetdarkmode.js';
import validation from './validation.js';
import CameraBasic from './camera.js';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      profileEdit: false,
      profileData: {},
      profileUpdateData: [],
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordChanged: false,
      draftMessages: [],
      photoU: false,
      profilePhoto: undefined,
      style: 'light',
      styles: StylesLight,
    };
  }

  async setColorScheme() {
    if (this.state.style == 'light') {
      this.setState({ styles: StylesLight });
    } else {
      this.setState({ styles: StylesDark });
    }
  }

  async switchStyle() {
    this.setState({
      isLoading: true,
    });
    if (this.state.style == 'light') {
      this.setState({
        style: 'dark', styles: StylesDark, isLoading: false,
      });
      await AsyncStorage.setItem('colorScheme', 'dark');
    } else {
      this.setState({
        style: 'light', styles: StylesLight, isLoading: false,
      });
      await AsyncStorage.setItem('colorScheme', 'light');
    }
  }

  async userProfilePhoto() {
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + await AsyncStorage.getItem('whatsthatID') + '/photo',
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then((response) => {
        if (response.status == 200) {
          return response.blob();
        } else if (response.status == 401) {
          toast.show('Unauthorized', { type: 'danger' });
        } else if (response.status == 404) {
          toast.show('Not Found', { type: 'danger' });
          throw 'Not Found';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .then((responseBlob) => {
        const data = URL.createObjectURL(responseBlob);
        this.setState({
          profilePhoto: data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async userInfo() {
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + await AsyncStorage.getItem('whatsthatID'),
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 401) {
          toast.show('Unauthorized', { type: 'danger' });
        } else if (response.status == 404) {
          toast.show('Not Found', { type: 'danger' });
          throw 'Not Found';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .then((responseJson) => {
        // console.log(responseJson)
        this.setState({
          profileData: responseJson,
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          email: responseJson.email,
          isLoading: false,
        }, () => { this.userProfilePhoto(); });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async logOut() {
    return fetch(
      'http://localhost:3333/api/1.0.0/logout',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then(async (response) => {
        if (response.status == 200) {
          toast.show('Logged out', { type: 'success' });
          await AsyncStorage.removeItem('whatsthatID');
          await AsyncStorage.removeItem('whatsthatSessionToken');
          this.props.navigation.navigate('Home');
        } else if (response.status == 401) {
          toast.show('Unauthorized', { type: 'danger' });
          await AsyncStorage.removeItem('whatsthatID');
          await AsyncStorage.removeItem('whatsthatSessionToken');
          this.props.navigation.navigate('Home');
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async logOutLoading() {
    await AsyncStorage.removeItem('whatsthatID');
    await AsyncStorage.removeItem('whatsthatSessionToken');
    this.props.navigation.navigate('Home');
  }

  async updateUserInfo() {
    console.log(this.state.profileUpdateData);
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + await AsyncStorage.getItem('whatsthatID'),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
        body: JSON.stringify(this.state.profileUpdateData),
      },
    )
      .then((response) => {
        if (response.status == 200) {
          toast.show('User Updated', { type: 'success' });
          this.setState({ profileEdit: false, password: '' });
          this.userInfo();
        } else if (response.status == 400) {
          toast.show('Bad Request', { type: 'danger' });
        } else if (response.status == 401) {
          toast.show('Unauthorized', { type: 'danger' });
        } else if (response.status == 403) {
          toast.show('Forbidden', { type: 'danger' });
        } else if (response.status == 404) {
          toast.show('Not Found', { type: 'danger' });
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async updateUserRequest() {
    var updated = {};
    if (this.state.firstName != this.state.profileData.first_name && this.state.firstName != '') {
      updated.first_name = this.state.firstName;
    }
    if (this.state.lastName != this.state.profileData.last_name && this.state.firstName != '') {
      updated.last_name = this.state.lastName;
    }
    if (this.state.email != this.state.profileData.email && this.state.email != '') {
      if (this.validateEmail(this.state.email, 'email') == true) {
        updated.email = this.state.email;
      }
    }
    if (this.state.passwordChanged == true) {
      if (this.validatePassword(this.state.password, 'password') == true) {
        updated.password = this.state.password;
      }
    }
    this.setState({
      profileUpdateData: updated,
    }, () => { this.updateUserInfo(); });
  }

  updateUser() {
    if (this.state.password == '') {
      this.setState({
        passwordChanged: false,
      });
    }
    this.updateUserRequest();
  }

  validateEmail() {
    if (validation(this.state.email, 'email') == true) {
      return true;
    } else {
      toast.show('Incorrect Email Format', { type: 'danger' });
    }
  }

  validatePassword() {
    if (validation(this.state.password, 'password') == true) {
      return true;
    } else {
      toast.show('Incorrect Password Format', { type: 'danger' });
    }
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
    this.setState({ password: text, passwordChanged: true });
  };

  sendDraft = async (draftid, chatid, message) => {
    var drafts = this.state.draftMessages;
    if (drafts.findIndex((data) => data.draftID == draftid) == 0) {
      const index = drafts.findIndex((data) => data.draftID == draftid);
      drafts[index].time = '';
      this.setState({
        draftMessages: drafts,
        counter: this.state.counter += 1,
      }, async () => { await AsyncStorage.setItem('draftMessages', JSON.stringify(this.state.draftMessages)); });
    } else if (drafts.findIndex((data) => data.draftID == draftid)) {
      const index = drafts.findIndex((data) => data.draftID == draftid);
      drafts[index].time = '';
      this.setState({
        draftMessages: drafts,
        counter: this.state.counter += 1,
      }, async () => { await AsyncStorage.setItem('draftMessages', JSON.stringify(this.state.draftMessages)); });
    }
    return fetch(
      'http://localhost:3333/api/1.0.0/chat/' + chatid + '/message',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
        body: JSON.stringify(
          {
            'message': message,
          },
        ),
      },
    )
      .then((response) => {
        if (response.status == 200) {
          console.log('profile');
          toast.show('Draft Message Sent', { type: 'success' });
        } else if (response.status == 400) {
          toast.show('Bad Request', { type: 'danger' });
          throw 'Bad Request';
        } else if (response.status == 401) {
          toast.show('Unauthorised', { type: 'danger' });
          throw 'Unauthorised';
        } else if (response.status == 403) {
          toast.show('Forbidden', { type: 'danger' });
          throw 'Forbidden';
        } else if (response.status == 404) {
          toast.show('Not Found', { type: 'danger' });
          throw 'Not Found';
        } else {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkDraftTimes() {
    var drafts = this.state.draftMessages;
    const date = new Date();
    const time = date;
    time.setSeconds(0);
    time.setMilliseconds(0);
    const timeFinal = new Date(time.toISOString());

    for (let i = 0; i < drafts.length; i++) {
      const draftDate = new Date(drafts[i].time);
      if (draftDate.getTime() == timeFinal.getTime()) {
        const draftid = drafts[i].draftID;
        const chatid = drafts[i].chatID;
        const message = drafts[i].message;
        this.sendDraft(draftid, chatid, message);
      }
    }
  }

  async componentDidMount() {
    if (await AsyncStorage.getItem('draftMessages') == 'undefined') {
      await this.setState({
        draftMessages: await AsyncStorage.getItem('draftMessages'),
      });
    } else {
      await this.setState({
        draftMessages: JSON.parse(await AsyncStorage.getItem('draftMessages')),
      });
    }
    if (await AsyncStorage.getItem('colorScheme')) {
      this.setState({
        style: await AsyncStorage.getItem('colorScheme'),
      }, () => { this.setColorScheme(); });
    } else {
      await AsyncStorage.setItem('colorScheme', 'light');
      this.setColorScheme();
    }

    this.userInfo();
    this.draftTimerID = setInterval(() => { this.checkDraftTimes(); }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.draftTimerID);
    console.log('unmounted');
  }

  render() {
    if (this.state.isLoading == true) {
      return (
        <View style={[this.state.styles.background]}>
          <View style={[this.state.styles.view]}>
            <View style={[this.state.styles.header]}>
              <Text style={[this.state.styles.headerText]}>
                Profile
              </Text>
            </View>
            <View style={[this.state.styles.activityIndicatorView]}>
              <ActivityIndicator style={[this.state.styles.activityIndicator]} />
            </View>
            <View style={[{ justifyContent: 'flex-end' }]}>
              <TouchableOpacity
                style={[this.state.styles.box]}
                onPress={() => this.logOutLoading()}
              >
                <Text style={[this.state.styles.profileText]}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    if (this.state.photoU == true) {
      return (
        <View style={[this.state.styles.background]}>
          <View style={{ flex: 20 }}>
            <CameraBasic />
          </View>
          <View style={{ flex: 2 }}>
            <TouchableOpacity
              style={[this.state.styles.box]}
              onPress={() => { this.userInfo(); this.setState({ photoU: false }); }}
            >
              <Text style={[this.state.styles.profileText]}>Back/Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (this.state.profileEdit == true) {
      return (
        <View style={[this.state.styles.background]}>
          <View style={[this.state.styles.view]}>
            <View style={[this.state.styles.header]}>
              <Text style={[this.state.styles.headerText]}>
                Edit Profile
              </Text>
            </View>
            <ScrollView style={[{ flex: 13 }]}>
              <View style={[{ flex: 1 }]}>
                <Text style={[this.state.styles.profileText]}>
                  Photo:
                </Text>
                <Image
                  style={{
                    width: 80, height: 80, marginLeft: 20,
                  }}
                  source={{ uri: this.state.profilePhoto }}
                />
                <Text style={[this.state.styles.profileText]}>
                  First Name:
                </Text>
                <TextInput
                  style={[this.state.styles.profileTextInput]}
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChangeText={this.firstNameChange}
                />
                <Text style={[this.state.styles.profileText]}>
                  Last Name:
                </Text>
                <TextInput
                  style={[this.state.styles.profileTextInput]}
                  placeholder="Last Name"
                  value={this.state.lastName}
                  onChangeText={this.lastNameChange}
                />
                <Text style={[this.state.styles.profileText]}>
                  Email:
                </Text>
                <TextInput
                  style={[this.state.styles.profileTextInput]}
                  placeholder="Email"
                  value={this.state.email}
                  onChangeText={this.emailChange}
                />
                <Text style={[this.state.styles.profileText]}>
                  Password:
                </Text>
                <TextInput
                  style={[this.state.styles.profileTextInput]}
                  secureTextEntry
                  placeholder="Password"
                  value={this.state.password}
                  onChangeText={this.passwordChange}
                />
              </View>
            </ScrollView>
            <View style={[{ flex: 3 }]}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={[this.state.styles.box, { flex: 1 }]}
                  title="updatebtn"
                  onPress={() => this.updateUser()}
                >
                  <Text style={[this.state.styles.profileText, { fontSize: 16 }]}>
                    Update User Info
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[this.state.styles.box, { flex: 1 }]}
                  onPress={() => this.setState({ photoU: true })}
                >
                  <Text
                    style={[this.state.styles.profileText, { fontSize: 16 }]}
                  >
                    Update Photo
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={this.state.styles.box}
                  title="updatebtn"
                  onPress={() => this.setState({
                    profileEdit: false,
                  })}
                >
                  <Text style={[this.state.styles.profileText]}>
                    Back/Cancel
                  </Text>
                </TouchableOpacity>
              </View>
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
              Profile
            </Text>
          </View>
          <ScrollView style={[{ flex: 7 }]}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 2 }}>
                <Text style={[this.state.styles.profileText]}>
                  Profile Photo:
                </Text>
                <Image
                  style={{ width: 80, height: 80, marginLeft: 20 }}
                  source={{ uri: this.state.profilePhoto }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={[this.state.styles.box, {
                    width: '60%', height: '40%', marginTop: 20, marginLeft: 40, textAlign: 'center',
                  }]}
                  onPress={() => this.switchStyle()}
                >
                  <Text
                    style={[this.state.styles.profileText, { fontSize: 14, margin: 3 }]}
                  >
                    Change Color
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[this.state.styles.profileText]}>
              First Name:
              {'\n'}
              {this.state.firstName}
            </Text>
            <Text style={[this.state.styles.profileText]}>
              Last Name:
              {'\n'}
              {this.state.lastName}
            </Text>
            <Text style={[this.state.styles.profileText]}>
              Email:
              {'\n'}
              {this.state.email}
            </Text>
          </ScrollView>
          <View style={[{ flex: 3, justifyContent: 'flex-end' }]}>
            <TouchableOpacity
              style={[this.state.styles.box]}
              onPress={() => this.setState({ profileEdit: true })}
            >
              <Text style={[this.state.styles.profileText]}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[this.state.styles.box]}
              onPress={() => this.logOut()}
            >
              <Text style={[this.state.styles.profileText]}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
