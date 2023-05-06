import React, { Component, useEffect } from 'react';
import { Animated, FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, Image, Modal } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';


export default class HomeScreen extends Component {

  async componentDidMount() {
    if (await AsyncStorage.getItem("whatsthatSessionToken")) {
      this.props.navigation.navigate('AppHome')
    }
  }

  render() {
    return (
      <View style={[styles.background]}>
        <View style={[styles.view]}>
          <View style={[styles.header]}>
            <Text style={[styles.headerText]}>Home</Text>
          </View>
          <View style={[{ flex: 10, justifyContent: 'flex-end' }]}>
            <TouchableOpacity style={[styles.box]}
              onPress={() => this.props.navigation.navigate('Log in')}>
              <Text style={[styles.text]}>Log in</Text>
            </TouchableOpacity >
            <TouchableOpacity style={[styles.box]}
              onPress={() => this.props.navigation.navigate('Sign up')}>
              <Text style={[styles.text]}>Sign Up</Text>
            </TouchableOpacity >
          </View>
        </View>
      </View>
    );
  }
}