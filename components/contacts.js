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
import { TouchableOpacity, TouchableHighlight } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StylesLight from './stylesheet.js';
import StylesDark from './stylesheetdarkmode.js';

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactsData: [],
      searchData: [],
      addingContact: false,
      userID: '',
      searchText: '',
      modalVisible: false,
      draftMessages: [],
      styles: StylesLight,
      style: '',
    };
  }

  searchPrep() {
    this.setState({
      isLoading: true,
    });
    this.search();
  }

  async setColorScheme() {
    if (this.state.style == 'light') {
      this.setState({ styles: StylesLight });
    } else {
      this.setState({ styles: StylesDark });
    }
  }

  async search() {
    return fetch(
      'http://localhost:3333/api/1.0.0/search?search_in=contacts&q=' + this.state.searchText,
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 400) {
          toast.show('Bad Request', { type: 'danger' });
          throw 'Bad Request';
        } else if (response.status == 401) {
          toast.show('Unauthorised', { type: 'danger' });
          throw 'Unauthorised';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .then((responseJson) => {
        this.setState({
          searchData: responseJson,
          isLoading: false,
          addingContact: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async fetchContacts() {
    return fetch(
      'http://localhost:3333/api/1.0.0/contacts',
      {
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then(async (response) => {
        if (response.status == 200) {
          return response.json();
        } else if (response.status == 401) {
          toast.show('Unauthorised', { type: 'danger' });
          throw 'Unauthorised';
        } else if (response.status == 500) {
          toast.show('Something went wrong', { type: 'danger' });
          throw 'Server Error';
        }
      })
      .then((responseJson) => {
        this.setState({
          contactsData: responseJson,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async removeContact(id) {
    this.setState({
      isLoading: true,
    });
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + id + '/contact',
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then(async (response) => {
        if (response.status == 200) {
          toast.show('Contact Removed', { type: 'success' });
          this.fetchContacts();
          this.setState({
            isLoading: false,
          });
        } else if (response.status == 400) {
          toast.show("You can't remove yourself as a contact", { type: 'danger' });
          throw "You can't remove yourself as a contact";
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

  async blockContact(id) {
    this.setState({
      isLoading: true,
    });
    return fetch(
      'http://localhost:3333/api/1.0.0/user/' + id + '/block',
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem('whatsthatSessionToken') },
      },
    )
      .then(async (response) => {
        if (response.status == 200) {
          toast.show('User Blocked', { type: 'success' });
          this.fetchContacts();
          this.setState({
            isLoading: false,
          });
        } else if (response.status == 400) {
          toast.show("You can't block yourself", { type: 'danger' });
          throw "You can't block yourself";
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

  searchTextChange = (text) => {
    this.setState({ searchText: text });
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
          console.log('contacts');
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
        } else if (response.status == 500) {
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

    this.setState({
      isLoading: true,
      userID: await AsyncStorage.getItem('whatsthatID'),
    });

    this.fetchContacts();
    this.draftTimerID = setInterval(() => { this.checkDraftTimes(); }, 10000);

    if (this.state.contactsData.length <= 0) {
      this.setState({
        isLoading: false,
      });
    }

    this.props.navigation.addListener('focus', async () => {
      await this.setState({
        isLoading: true,
      });
      this.fetchContacts();
      this.draftTimerID = setInterval(() => { this.checkDraftTimes(); }, 10000);
    });
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
                Contacts
              </Text>
            </View>
            <View style={[this.state.styles.contactsSearchView]}>
              <TextInput
                style={[this.state.styles.contactSearch, { alignSelf: 'flex-start', width: 340 }]}
                placeholder="Search"
                onChangeText={this.searchTextChange}
                onSubmitEditing={() => this.searchPrep()}
              />
              <TouchableOpacity style={[this.state.styles.contactOptions]} onPress={() => { }}>
                <Image style={[this.state.styles.contactOptions]} source={require('./images/optionsg.png')} />
              </TouchableOpacity>
            </View>
            <View style={[this.state.styles.view, { flex: 10 }]}>
              <ActivityIndicator style={[this.state.styles.activityIndicator]} />
            </View>
          </View>
        </View>
      );
    }
    if (this.state.addingContact == true) {
      return (
        <View style={[this.state.styles.background]}>
          <View style={[this.state.styles.view]}>
            <View style={[this.state.styles.header]}>
              <Text style={[this.state.styles.headerText]}>
                Contacts
              </Text>
            </View>
            <View style={[{ flex: 9, justifyContent: 'flex-start' }]}>
              <FlatList
                data={this.state.searchData}
                keyExtractor={(item) => item.user_id}
                renderItem={({ item }) => {
                  if (item.user_id != this.state.userID) {
                    return (
                      <View style={[this.state.styles.contactBox]}>
                        <View style={[this.state.styles.contactInfoBox]}>
                          <Text style={[this.state.styles.contactInfoName]}>
                            {' '}
                            {item.given_name}
                            {' '}
                            {item.family_name}
                            {' '}
                          </Text>
                          <Text style={[this.state.styles.contactInfoEmail]}>
                            {' '}
                            {item.email}
                            {' '}
                          </Text>
                          <Text style={[this.state.styles.contactInfoUserID]}>
                            {' '}
                            User ID:
                            {item.user_id}
                            {' '}
                          </Text>
                        </View>
                        <View style={[{ flex: 2, alignSelf: 'center' }]}>
                          <TouchableOpacity onPress={() => { this.removeContact(item.user_id); }}>
                            <Image style={[this.state.styles.addContact]} source={require('./images/removecontact.png')} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => { this.blockContact(item.user_id); }}>
                            <Image style={[this.state.styles.addContact]} source={require('./images/blockcontact.png')} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }
                }}
              />
            </View>
            <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
              <TouchableOpacity
                style={this.state.styles.box}
                onPress={() => {
                  this.setState({
                    addingContact: false,
                  });
                }}
              >
                <Text style={this.state.styles.text}>
                  Back
                </Text>
              </TouchableOpacity>
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
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <TouchableOpacity
            style={[this.state.styles.modalOpacity]}
            activeOpacity={1}
            onPressOut={() => { this.setState({ modalVisible: false }); }}
          >
            <TouchableHighlight style={[this.state.styles.optionsPanelContacts]}>
              <View style={[this.state.styles.contactsModalViewButtons]}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ isLoading: true, modalVisible: false });
                    this.props.navigation.navigate('Search');
                  }}
                >
                  <Text style={[this.state.styles.contactsModalViewButtonsText]}>
                    Add Contact
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ isLoading: true, modalVisible: false });
                    this.props.navigation.navigate('Blocked');
                  }}
                >
                  <Text style={[this.state.styles.contactsModalViewButtonsText]}>
                    View Blocked List
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableHighlight>
          </TouchableOpacity>
        </Modal>

        <View style={[this.state.styles.view]}>
          <View style={[this.state.styles.header]}>
            <Text style={[this.state.styles.headerText]}>
              Contacts
            </Text>
          </View>
          <View style={[this.state.styles.contactsSearchView]}>
            <TextInput
              style={[this.state.styles.contactSearch, { alignSelf: 'flex-start', width: 340 }]}
              placeholder="Search Contacts"
              onChangeText={this.searchTextChange}
              onSubmitEditing={() => this.searchPrep()}
            />
            <TouchableOpacity
              style={[this.state.styles.contactOptions]}
              onPress={() => {
                this.setState({ modalVisible: true });
              }}
            >
              <Image style={[this.state.styles.contactOptions]} source={require('./images/optionsg.png')} />
            </TouchableOpacity>
          </View>
          <View style={[{ flex: 9 }]}>
            <View style={[{ flex: 1 }]}>
              <FlatList
                removeClippedSubviews={false}
                scrollsToTop={false}
                bounces={false}
                data={this.state.contactsData}
                keyExtractor={(item) => item.user_id}
                renderItem={({ item }) => {
                  if (item.user_id != this.state.userID) {
                    return (
                      <View style={[this.state.styles.contactBox]}>
                        <View style={[this.state.styles.contactInfoBox]}>
                          <Text style={[this.state.styles.contactInfoName]}>
                            {item.first_name}
                            {' '}
                            {item.last_name}
                          </Text>
                          <Text style={[this.state.styles.contactInfoEmail]}>{item.email}</Text>
                          <Text style={[this.state.styles.contactInfoUserID]}>
                            User ID:
                            {item.user_id}
                            {' '}

                          </Text>
                        </View>
                        <View style={[{ flex: 2, alignSelf: 'center' }]}>
                          <TouchableOpacity onPress={() => { this.removeContact(item.user_id); }}>
                            <Image style={[this.state.styles.addContact]} source={require('./images/removecontact.png')} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => { this.blockContact(item.user_id); }}>
                            <Image style={[this.state.styles.addContact]} source={require('./images/blockcontact.png')} />
                          </TouchableOpacity>
                        </View>
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
