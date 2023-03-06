import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert,  } from 'react-native';

let emailValid = 0;
let passwordValid = 0;

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: ""
    }
  }

  emailValidate = (text) => {
    if(text.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
      emailValid = 1;
    }
    else{
      emailValid = 0;
    } 
  }

  passwordValidate = (text) => {
    if(text.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/)){
      passwordValid = 1;
    }
    else{
      passwordValid = 0;
    } 
  }

  emailChange = (text) => {
    this.setState({email: text})
  }

  passwordChange = (text) => {
    this.setState({password: text})
  }

  login = (email, password) => {
    this.emailValidate(email)
    this.passwordValidate(password)
    if(emailValid == 1){
      if(passwordValid == 1){
        alert(
          "your email and password are valid"
        )
      }
      else{
        alert(
          "your password is not valid"
        )
        location.reload()
      }
    }
    else{
      alert(
        "your email is not valid"
      )
      location.reload()
    }
    }

  render() {
    return (
      <View>
        <TextInput
          placeholder='Email'
          value={this.state.email}
          onChangeText={this.emailChange}
        />
        <TextInput
          placeholder='Password'
          value={this.state.password}
          onChangeText={this.passwordChange}
        />
        <Button
          title='Sign In'
          onPress={ () => this.login(this.state.email, this.state.password)}
        />
      </View>
    )
  }

}

export default App
