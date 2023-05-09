/* eslint-disable react/no-unstable-nested-components */
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Chats from './chats.js';
import Contacts from './contacts.js';
import Profile from './profile.js';

import StylesLight from './stylesheet.js';

const Tab = createBottomTabNavigator();

export default class AppHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: 'light',
      styles: StylesLight,
      navLight: { fo: '#2A2F4F', unfo: '#ffffff' },
      navDark: { fo: '#ffffff', unfo: '#ffffff' },
      navColor: null,
      navBackLight: { fo: '#ffffff', unfo: '#2a2f4f' },
      navBackDark: { fo: '#595a63', unfo: '#2a2f4f' },
      navBack: null,
      loading: true,
    };
  }

  async setColorScheme() {
    if (this.state.style == 'light') {
      this.setState({
        navColor: this.state.navLight,
        navBack: this.state.navBackLight,
      }, () => { this.setState({ loading: false }); });
    } else {
      this.setState({
        navColor: this.state.navDark,
        navBack: this.state.navBackDark,
      }, () => { this.setState({ loading: false }); });
    }
  }

  async componentDidMount() {
    if (await AsyncStorage.getItem('draftMessages')) {
      console.log('draft message exists');
    } else {
      await AsyncStorage.setItem('draftMessages');
    }
    if (await AsyncStorage.getItem('colorScheme')) {
      this.setState({
        style: await AsyncStorage.getItem('colorScheme'),
      }, () => { this.setColorScheme(); });
    } else {
      await AsyncStorage.setItem('colorScheme', 'light');
      this.setColorScheme();
    }
  }

  render() {
    if (this.state.loading) {
      return (<Text>Loading</Text>);
    }
    return (
      <View style={[this.state.styles.background]}>
        <Tab.Navigator
          screenOptions={{
            unmountOnBlur: true,
          }}
        >
          <Tab.Screen
            name="Chats"
            component={Chats}
            options={{
              headerTitle: '',
              headerTransparent: true,
              tabBarLabel: ({ focused }) => (
                <Text
                  style={[this.state.styles.tabText,
                    { color: focused ? this.state.navColor.fo : this.state.navColor.unfo }]}
                >
                  Chats
                </Text>
              ),
              tabBarIcon: () => { },
              tabBarActiveBackgroundColor: this.state.navBack.fo,
              tabBarInactiveBackgroundColor: this.state.navBack.unfo,
            }}
          />
          <Tab.Screen
            name="Contacts"
            component={Contacts}
            options={{
              headerTitle: '',
              headerTransparent: true,
              tabBarLabel: ({ focused }) => (
                <Text
                  style={[this.state.styles.tabText,
                    { color: focused ? this.state.navColor.fo : this.state.navColor.unfo }]}
                >
                  Contacts
                </Text>
              ),
              tabBarIcon: () => { },
              tabBarActiveBackgroundColor: this.state.navBack.fo,
              tabBarInactiveBackgroundColor: this.state.navBack.unfo,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              headerTitle: '',
              headerTransparent: true,
              tabBarLabel: ({ focused }) => (
                <Text
                  style={[this.state.styles.tabText,
                    { color: focused ? this.state.navColor.fo : this.state.navColor.unfo }]}
                >
                  Profile
                </Text>
              ),
              tabBarIcon: () => { },
              tabBarActiveBackgroundColor: this.state.navBack.fo,
              tabBarInactiveBackgroundColor: this.state.navBack.unfo,
            }}
          />
        </Tab.Navigator>
      </View>
    );
  }
}
