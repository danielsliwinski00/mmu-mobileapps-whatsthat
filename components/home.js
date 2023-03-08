import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';

class HomeScreen extends Component{
  render(){
    return(
        <View>
          <Text>Home Screen</Text>
          <Button 
          title="Log In"
          onPress={()=> this.props.navigation.navigate('Log In')}/>
        </View>
    );
  }
}

export default HomeScreen;
