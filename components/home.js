import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from './stylesheet.js';

class HomeScreen extends Component {
  render() {
    return (
      <View style={[{ flex: 1 }]}>
        <View style={[styles.viewHome, { flex: 4, backgroundColor: '#ffffff', padding:0, }]}>

          <View style={[{ flex: 1, backgroundColor: 'cyan'}]}>
            <Text style={[styles.text]}>Home Screen</Text>
          </View>

          <View style={[{ flex: 6 , backgroundColor: 'white' }]}>
            <TouchableOpacity style={[styles.box]}
              onPress={() => this.props.navigation.navigate('Log in')}>
              <Text style={[styles.text]}>Log in</Text>
          </TouchableOpacity >

          <TouchableOpacity style={[styles.box]}
            onPress={() => this.props.navigation.navigate('API')}>
            <Text style={[styles.text]}>API</Text>
          </TouchableOpacity >

          <TouchableOpacity style={[styles.box]}
            onPress={() => this.props.navigation.navigate('Sign up')}>
            <Text style={[styles.text]}>Sign Up</Text>
          </TouchableOpacity >
          </View>

        </View>
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
        </View>
      </View>
    );
  }
}

export default HomeScreen;
