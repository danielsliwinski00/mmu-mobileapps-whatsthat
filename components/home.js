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
  ActivityIndicator, Text, View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import stylesLight from './stylesheet.js';
import stylesDark from './stylesheetdarkmode.js';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: stylesLight,
      style: '',
      isLoading: true,
    };
  }

  async setColorScheme() {
    if (this.state.style == 'light') {
      this.setState({ styles: stylesLight, isLoading: false });
    } else {
      this.setState({ styles: stylesDark, isLoading: false });
    }
  }

  async componentDidMount() {
    if (await AsyncStorage.getItem('whatsthatSessionToken')) {
      this.props.navigation.navigate('AppHome');
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
    if (this.state.isLoading == true) {
      return (
        <View style={[this.state.styles.background]}>
          <View style={[this.state.styles.view]}>
            <View style={[this.state.styles.header]}>
              <Text style={[this.state.styles.headerText]}>
                Welcome to WhatsThat
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
        <View style={[this.state.styles.view]}>
          <View style={[this.state.styles.header]}>
            <Text style={[this.state.styles.headerText]}>Welcome to WhatsThat</Text>
          </View>
          <View style={[{ flex: 10, justifyContent: 'flex-end' }]}>
            <TouchableOpacity
              style={[this.state.styles.box]}
              onPress={() => this.props.navigation.navigate('Log in')}
            >
              <Text style={[this.state.styles.text]}>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[this.state.styles.box]}
              onPress={() => this.props.navigation.navigate('Sign up')}
            >
              <Text style={[this.state.styles.text]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
