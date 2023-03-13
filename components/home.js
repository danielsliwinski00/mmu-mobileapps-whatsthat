import React, { Component } from 'react';
import { Text, View  , Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from './stylesheet.js';

class HomeScreen extends Component{
  render(){
    return(
        <View style={[styles.viewHome]}>

          <Text style={[styles.text]}>Home Screen</Text>

          <TouchableOpacity style={[styles.box]}
            onPress={()=> this.props.navigation.navigate('Log in')}>
            <Text style={[styles.text]}>Log in</Text>
          </TouchableOpacity >

          <TouchableOpacity style={[styles.box]}
            onPress={()=> this.props.navigation.navigate('API')}>
            <Text style={[styles.text]}>API</Text>
          </TouchableOpacity >

        </View>
    );
  }
}

export default HomeScreen;
