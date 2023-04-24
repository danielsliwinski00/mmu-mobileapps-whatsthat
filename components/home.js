import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from './stylesheet.js';

export default class HomeScreen extends Component {
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