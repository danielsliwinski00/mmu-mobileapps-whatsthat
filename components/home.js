import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from './stylesheet.js';

class HomeScreen extends Component {
  render() {
    return (
      <View style={[{ flex: 1, }]}>
        <View style={[styles.viewHome, { flex: 1, padding:0, }]}>

          <View style={[{ flex: 1, backgroundColor: '#412234'}]}>
            <Text style={[styles.text, {color:'#ffffff', alignSelf:'center'}]}>Home</Text>
          </View>

          <View style={[{ flex: 11 , justifyContent:'flex-end' }]}>
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

export default HomeScreen;
/*        <View style={{ flex: 1, backgroundColor: '#000000' }}>
        </View> */