import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert,  } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from './stylesheet.js';
import validation from './validation.js';

class SignUp extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: ""
    }
  }

  emailChange = (text) => {
    this.setState({email: text})
  }

  passwordChange = (text) => {
    this.setState({password: text})
  }

  render() {
    return (
      <View style={[styles.view]}>
        <TextInput 
          style={[styles.text]}
          placeholder='Email'
          value={this.state.email}
          onChangeText={this.emailChange}
        />
        <TextInput 
          style={styles.text}
          placeholder='Password'
          value={this.state.password}
          onChangeText={this.passwordChange}
        />
        <TouchableOpacity 
          style={styles.box}
          title='Log In'
          onPress={ () => validation(this.state.email, this.state.password)}>
          <Text style={styles.text}>Log in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.box}
          title="Home"
          onPress={()=> this.props.navigation.navigate('Home')}>
            <Text style={styles.text}>Home
            </Text>
        </TouchableOpacity>
      </View>
    )
  }

}

export default SignUp;
