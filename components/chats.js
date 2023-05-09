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
  FlatList, ActivityIndicator, Text, TextInput, View, Modal,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StylesLight from './stylesheet.js';
import StylesDark from './stylesheetdarkmode.js';

export default class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chatsData: [],
      creatingChat: false,
      createChatName: '',
      draftMessages: [],
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

  async fetchChats() {
    return fetch(
      'http://localhost:3333/api/1.0.0/chat',
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 401) {
          toast.show('Unauthorized', { type: 'danger' });
          throw 'Unauthorized';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .then((responseJson) => {
        this.setState({
          chatsData: responseJson,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async fetchChatsUpdate() {
    return fetch(
      'http://localhost:3333/api/1.0.0/chat',
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 401) {
          toast.show('Unauthorized', { type: 'danger' });
          throw 'Unauthorized';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .then((responseJson) => {
        this.setState({
          chatsData: responseJson,
        }, () => { this.getOrderChatsData(); });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async createChat() {
    if (this.state.createChatName !== '') {
      await this.createChatRequest();
      this.fetchChats();
      this.setState({
        isLoading: false,
        creatingChat: false,
        createChatName: '',
      });
    } else {
      this.setState({
        isLoading: false,
        creatingChat: false,
        createChatName: '',
      });
      alert('empty chat name');
    }
  }

  async createChatRequest() {
    return fetch(
      'http://localhost:3333/api/1.0.0/chat',
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
        body: JSON.stringify(
          {
            'name': this.state.createChatName,
          },
        ),
      },
    )
      .then((response) => {
        if (response.status == 200) {
          toast.show('Chat Created', { type: 'success' });
          console.log('successfully created chat');
        } else if (response.status == 400) {
          toast.show('Bad Request', { type: 'danger' });
          throw 'Bad Request';
        } else if (response.status == 401) {
          toast.show('Unauthorized', { type: 'danger' });
          throw 'Unauthorised';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getOrderChatsData() {
    var dataToSort = [];
    var sortedData = [];
    dataToSort = this.state.chatsData;

    sortedData = dataToSort.sort((x, y) => new Date(x.last_message.timestamp)
    - new Date(y.last_message.timestamp));

    return sortedData;
  }

  timestampToString = (timestamp) => {
    const currentDate = new Date();
    var date = new Date(timestamp);

    var interval = currentDate - date;
    var mili = 60 * 1000;

    interval /= mili;

    if (interval / 60 / 24 < 1) { // if (minutes/ hours/) days is less than 1
      if ((interval / 60) % 1 == 0) { // if no minutes
        interval /= 60;
        switch (true) {
          case Math.round(interval) == 1:
            return (Math.round(interval) + ' hour ago');
          case Math.round(interval) > 1:
            return (Math.round(interval) + ' hours ago');
          default:
            return ('');
        }
      } else if (interval / 60 < 1) { // if only minutes
        interval %= 60;
        switch (true) {
          case Math.round(interval) == 1:
            return (Math.round(interval) + ' minute ago');
          case Math.round(interval) > 1:
            return (Math.round(interval) + ' minutes ago');
          case Math.round(interval) < 1:
            return ('Just now');
          default:
            return ('');
        }
      } else {
        const hours = (Math.round(interval / 60));
        const minutes = (Math.round(interval % 60));
        switch (true) {
          case hours == 1 && minutes == 1:
            return (hours + ' hour ' + minutes + ' minute ago');
          case hours == 1:
            return (hours + ' hour ' + minutes + ' minutes ago');
          case minutes == 1:
            return (hours + ' hours ' + minutes + ' minute ago');
          case hours > 1 && minutes > 1:
            return (hours + ' hours ' + minutes + ' minutes ago');
          default:
            return ('');
        }
      }
    } else if ((interval / 60) % 24 == 0) { // days leftover is 0
      switch (true) {
        case interval == 1:
          return (Math.round(interval) + ' day ago');
        case interval > 1:
          return (Math.round(interval) + ' days ago');
        default:
          return ('');
      }
    } else if ((interval / 60) % 24 > 0 && interval / 60 < 24) {
      // days leftover is more than 0 and hours is less than 1 day
      interval %= 60;

      switch (true) {
        case interval == 1:
          return (Math.round(interval) + ' hour ago');
        case interval > 1:
          return (Math.round(interval) + ' hours ago');
        default:
          return ('');
      }
    } else {
      const days = Math.round(interval / 60 / 24); // get days
      const hours = Math.round((interval / 60) % 24); // get hours leftover

      switch (true) {
        case days == 1 && hours == 1:
          return (days + ' day ' + hours + ' hour ago');
        case days == 1:
          return (days + ' day ' + hours + ' hours ago');
        case hours == 1:
          return (days + ' days ' + hours + ' hour ago');
        case days > 1 && hours > 1:
          return (days + ' days ' + hours + ' hours ago');
        default:
          return ('');
      }
    }
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
          console.log('chats');
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

  createChatNameChange = (text) => {
    this.setState({
      createChatName: text,
    });
  };

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

    this.setState({
      isLoading: false,
    });

    this.fetchChats();
    this.chatsInterval = setInterval(() => { this.fetchChatsUpdate(); }, 3000);
    this.draftTimerID = setInterval(() => { this.checkDraftTimes(); }, 10000);

    this.props.navigation.addListener('focus', async () => {
      this.setState({
        isLoading: false,
        createChatName: '',
      });
      this.fetchChatsUpdate();
    });
  }

  componentWillUnmount() {
    clearInterval(this.chatsInterval);
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
                Chats
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
          visible={this.state.creatingChat}
          onRequestClose={() => {
            this.setState({ creatingChat: false });
          }}
        >
          <TouchableOpacity
            style={[this.state.styles.modalBackground]}
            activeOpacity={1}
          >
            <View style={[this.state.styles.chatsNewChatModal]}>
              <TextInput
                autoCapitalize="words"
                style={[this.state.styles.chatsNewChatTextInput]}
                value={this.state.createChatName}
                placeholder="Chat Name"
                onChangeText={this.createChatNameChange}
              />
              <TouchableOpacity
                style={{ alignSelf: 'center' }}
                onPress={() => { this.setState({ isLoading: true }); this.createChat(); }}
              >
                <Text style={[this.state.styles.chatsNewChatButtonText]}>
                  Create Chat
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginTop: -20, alignSelf: 'center' }}
                onPress={() => { this.setState({ creatingChat: false }); }}
              >
                <Text style={[this.state.styles.chatsNewChatButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={[this.state.styles.view]}>
          <View style={[this.state.styles.header]}>
            <Text style={[this.state.styles.headerText]}>
              Chats
            </Text>
          </View>
          <View style={[{ flex: 10, justifyContent: 'flex-start' }]}>
            <FlatList
              removeClippedSubviews={false}
              scrollsToTop={false}
              extraData={this.getOrderChatsData().reverse()}
              bounces={false}
              data={this.getOrderChatsData().reverse()}
              keyExtractor={(item) => item.chat_id}
              renderItem={({ item }) => {
                if (this.state.chatsData == []) {
                  return (<View />);
                }
                if (Object.keys(item.last_message).length == 0) {
                  return (
                    <View style={[this.state.styles.chatsChatView]}>
                      <TouchableOpacity
                        onPress={() => {
                          clearInterval(this.timerId);
                          this.props.navigation.navigate('Chat', { chatID: item.chat_id });
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={[this.state.styles.chatsChatName]}
                        >
                          {item.name}
                        </Text>
                        <View style={[{ flex: 1, flexDirection: 'row' }]}>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[this.state.styles.chatsLastMessage]}
                          />

                        </View>
                        <View>
                          <Text style={[this.state.styles.chatsTimestamp]} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                } else {
                  return (
                    <View style={[this.state.styles.chatsChatView]}>
                      <TouchableOpacity onPress={() => { this.props.navigation.navigate('Chat', { chatID: item.chat_id }); }}>
                        <View style={[{ flex: 1 }]}>
                          <View style={[{ flex: 2 }]}>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={[this.state.styles.chatsChatName]}
                            >
                              {item.name}
                            </Text>
                          </View>
                          <View style={[{ flex: 2, flexDirection: 'row' }]}>
                            <View style={[{ flex: 9 }]}>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={[this.state.styles.chatsLastMessage]}
                              >
                                {item.last_message.author.first_name}
                                :
                                {' '}
                                {item.last_message.message}
                              </Text>
                            </View>
                            <View style={[{ flex: 1 }]} />
                          </View>
                          <View style={[{ flex: 1 }]}>
                            <Text style={[this.state.styles.chatsTimestamp]}>
                              {this.timestampToString(item.last_message.timestamp)}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }
              }}
            />
          </View>
        </View>
        <View style={[this.state.styles.newChatButton]}>
          <TouchableOpacity
            style={[{ flex: 1 }]}
            onPress={() => { this.setState({ creatingChat: true }); }}
          >
            <Text style={[this.state.styles.newChatButtonText]}>
              New Chat
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
