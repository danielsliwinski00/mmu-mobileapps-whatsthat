import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from './stylesheet.js';
import validation from './validation.js';


class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      firstName:"",
      lastName:"",
      email:"",
      password:""
    }
  }

  addUser() {
    return fetch("http://localhost:3333/api/1.0.0/user",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "first_name": this.state.firstName,
          "last_name": this.state.lastName,
          "email": this.state.email,
          "password": this.state.password
        })
      })
      .then((response) => {
        this.props.navigation.navigate('Log in');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  firstNameChange = (text) => {
    this.setState({firstName: text})
  }

  lastNameChange = (text) => {
    this.setState({lastName: text})
  }

  emailChange = (text) => {
    this.setState({email: text})
  }

  passwordChange = (text) => {
    this.setState({password: text})
  }

  validate(){
    if(validation(this.state.email, this.state.password)==true){
      this.addUser();
    }
    else{
      alert("Incorect details");
    }
  }

  render() {
    return (
      <View style={[styles.view]}>
        <TextInput 
          style={[styles.text]}
          placeholder='First Name'
          value={this.state.firstName}
          onChangeText={this.firstNameChange}
        />
        <TextInput 
          style={[styles.text]}
          placeholder='Last Name'
          value={this.state.lastName}
          onChangeText={this.lastNameChange}
        />
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
          title='Sign Up'
          onPress={ () => this.validate() }>
          <Text style={styles.text}>Sign Up
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
    );
  }
}

export default SignUp;