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
  FlatList, ActivityIndicator, Text, TextInput, View, Image, Modal,
} from 'react-native';
import {
  TouchableOpacity, TouchableHighlight,
} from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StylesLight from './stylesheet.js';
import StylesDark from './stylesheetdarkmode.js';

export default class ChatInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      chatData: [],
      chatid: '',
      chatNameModal: false,
      chatNameText: '',
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

  async fetchChatData() {
    this.setState({
      isLoading: true,
    });
    return fetch(
      'http://localhost:3333/api/1.0.0/chat/' + this.state.chatid,
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 401) {
          toast.show('Unauthorised', { type: 'danger' });
          throw 'Unauthorized';
        } else if (response.status == 403) {
          toast.show('Forbidden', { type: 'danger' });
          throw 'Forbidden';
        } else if (response.status == 404) {
          toast.show('Not Found', { type: 'danger' });
          throw 'Not Found';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .then(async (responseJson) => {
        await this.setState({
          chatData: responseJson,
        });
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async changeChatName() {
    this.setState({
      isLoading: true,
    });
    return fetch(
      'http://localhost:3333/api/1.0.0/chat/' + this.state.chatid,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
        body: JSON.stringify(
          {
            'name': this.state.chatNameText,
          },
        ),
      },
    )
      .then((response) => {
        if (response.status == 200) {
          toast.show('Chat Name Changed', { type: 'success' });
          this.setState({
            chatNameText: '',
            chatNameModal: false,
          }, () => { this.fetchChatData(); });
        } else if (response.status == 400) {
          toast.show('Bad Request', { type: 'danger' });
          throw 'Bad Request';
        } else if (response.status == 401) {
          toast.show('Unauthorised', { type: 'danger' });
          throw 'Unauthorized';
        } else if (response.status == 403) {
          toast.show('Forbidden', { type: 'danger' });
          throw 'Forbidden';
        } else if (response.status == 404) {
          toast.show('Not Found', { type: 'danger' });
          throw 'Not Found';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addMember() {
    this.props.navigation.navigate('AddMember', { chatID: this.state.chatid, chatMembers: this.state.chatData.members });
  }

  async removeMember(id) {
    this.setState({
      isLoading: true,
    });
    return fetch(
      'http://localhost:3333/api/1.0.0/chat/' + this.state.chatid + '/user/' + id,
      {
        method: 'delete',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then(async (response) => {
        if (response.status == 200) {
          toast.show('Removed Member', { type: 'success' });
          this.fetchChatData();
          this.setState({
            isLoading: false,
          });
        } else if (response.status == 400) {
          toast.show('Bad Request', { type: 'danger' });
          throw 'Bad Request';
        } else if (response.status == 401) {
          toast.show('Unauthorised', { type: 'danger' });
          throw 'Unauthorized';
        } else if (response.status == 403) {
          toast.show('Forbidden', { type: 'danger' });
          throw 'Forbidden';
        } else if (response.status == 404) {
          toast.show('Not Found', { type: 'danger' });
          throw 'Not Found';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  changeChatNameText = (text) => {
    this.setState({
      chatNameText: text,
    });
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

    await this.setState({
      isLoading: true,
      chatid: this.props.route.params.chatID.toString(),
      userID: await AsyncStorage.getItem('whatsthatID'),
    });

    this.fetchChatData();

    this.props.navigation.addListener('focus', async () => {
      await this.setState({
        isLoading: true,
        chatid: this.props.route.params.chatID.toString(),
        userID: await AsyncStorage.getItem('whatsthatID'),
      });
      this.fetchChatData();
    });
  }

  componentWillUnmount() {
    console.log('unmounted');
  }

  render() {
    if (this.state.isLoading == true) {
      return (
        <View style={[this.state.styles.background]}>
          <View style={[this.state.styles.view]}>
            <View style={[this.state.styles.header]}>
              <Text style={[this.state.styles.headerText]}>
                Chat Info
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

        <Modal
          animationType="none"
          transparent
          visible={this.state.chatNameModal}
          onRequestClose={() => {
            this.setState({ chatNameModal: false });
          }}
        >
          <TouchableOpacity
            style={[this.state.styles.modalOpacity]}
            activeOpacity={1}
            onPress={() => { this.setState({ chatNameModal: false }); }}
          >
            <TouchableHighlight style={[this.state.styles.modalTouchableHighlight3Button]}>
              <View style={[this.state.styles.modalViewButtons]}>
                <TextInput
                  style={[this.state.styles.modalTextInput]}
                  value={this.state.styles.chatNameText}
                  placeholder="Chat name"
                  onChangeText={this.changeChatNameText}
                />
                <TouchableOpacity
                  style={[this.state.styles.modal3Button]}
                  onPress={() => {
                    if (this.state.chatNameText != '') {
                      this.changeChatName();
                    }
                  }}
                >
                  <Text style={[this.state.styles.modalButtonText]}>
                    Change Name
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[this.state.styles.modal3ButtonCancel]}
                  onPress={() => { this.setState({ chatNameModal: false }); }}
                >
                  <Text style={[this.state.styles.modalButtonText]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableHighlight>
          </TouchableOpacity>
        </Modal>

        <View style={[this.state.styles.view]}>
          <View style={[this.state.styles.header]}>
            <Text style={[this.state.styles.headerText]}>Chat Info</Text>
          </View>
          <View style={[{ flex: 10, justifyContent: 'flex-start' }]}>
            <View style={[{ flex: 1, justifyContent: 'flex-start' }]}>
              <TouchableOpacity onPress={() => {
                this.setState({
                  chatNameModal: true,
                });
              }}
              >
                <Text style={[this.state.styles.text, { alignSelf: 'center', fontSize: 30 }]}>{this.state.chatData.name}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                <Text style={[this.state.styles.text, { alignSelf: 'center' }]}>Chat Members:</Text>
                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.addMember(); }}>
                  <Image style={[this.state.styles.addContact]} source={require('./images/addcontact.png')} />
                </TouchableOpacity>
              </View>
              <FlatList
                bounces={false}
                data={this.state.chatData.members}
                scrollsToTop={false}
                keyExtractor={(item) => item.user_id}
                renderItem={({ item }) => {
                  if (this.state.userID == this.state.chatData.creator.user_id) {
                    if (item.user_id == this.state.userID) {
                      return (
                        <View style={[this.state.styles.chatinfoMemberView]}>
                          <View style={[this.state.styles.chatinfoMemberInfoBox]}>
                            <Text style={[this.state.styles.contactInfoName]}>
                              {item.first_name}
                              {' '}
                              {item.last_name}
                            </Text>
                            <Text style={[this.state.styles.contactInfoEmail]}>{item.email}</Text>
                          </View>
                          <View style={[{ flex: 2, alignSelf: 'center' }]} />
                        </View>
                      );
                    } else {
                      return (
                        <View style={[this.state.styles.chatinfoMemberView]}>
                          <View style={[this.state.styles.chatinfoMemberInfoBox]}>
                            <Text style={[this.state.styles.contactInfoName]}>
                              {item.first_name}
                              {' '}
                              {item.last_name}
                            </Text>
                            <Text style={[this.state.styles.contactInfoEmail]}>{item.email}</Text>
                          </View>
                          <View style={[{ flex: 2, alignSelf: 'center' }]}>
                            <TouchableOpacity onPress={() => { this.removeMember(item.user_id); }}>
                              <Image style={[this.state.styles.addContact]} source={require('./images/removecontact.png')} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }
                  } else {
                    return (
                      <View style={[this.state.styles.chatinfoMemberView]}>
                        <View style={[this.state.styles.chatinfoMemberInfoBox]}>
                          <Text style={[this.state.styles.contactInfoName]}>
                            {item.first_name}
                            {' '}
                            {item.last_name}
                          </Text>
                          <Text style={[this.state.styles.contactInfoEmail]}>{item.email}</Text>
                        </View>
                        <View style={[{ flex: 2, alignSelf: 'center' }]} />
                      </View>
                    );
                  }
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
