import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';

class SignUp extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "",
      emailTest:'email@mail.com',
      passwordTest:'Password1!',
    }
  }

  login() {
    return fetch("http://localhost:3333/api/1.0.0/login",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "email": this.state.emailTest,
          "password": this.state.passwordTest
        })
      })
      .then((response) => {
        if(response.status == 200){
          return response.json();
        }else if(response.status == 400){
          throw "Invalid email or password"
        }else{
          throw "Something went wrong"
        }
      })
      .then(async (responseJson) => {
        try{
          await AsyncStorage.setItem("whatsthatID", responseJson.id)
          await AsyncStorage.setItem("whatsthatSessionToken", responseJson.token)
          this.setState({email: "",
          password: "",})
          this.props.navigation.navigate('AppHome');
        }catch{
          throw "something went wrong"
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  validate(){
    if(validation(this.state.email, this.state.password)==true){
      this.login();
    }
    else{
      alert("Incorect email or password");
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
          onPress={ () => this.login()}>
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
