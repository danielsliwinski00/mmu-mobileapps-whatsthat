import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet.js';
import validation from './validation.js';


class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            searchData: [],
            isLoading: true,
        }
    }

    async search() {
        return fetch("http://localhost:3333/api/1.0.0/search",
            {
                headers: {  'Content-Type': 'application/json', 'x-authorization': await AsyncStorage.getItem("whatsthatSessionToken") }
            })
            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                this.setState({
                    searchData: responseJson,
                    isLoading: false,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    /*
daniel.sliwinski.00@gmail.com

                    <TextInput
                        style={[styles.text]}
                        placeholder='Search name or email'
                        value={this.state.firstName}
                        onChangeText={this.searchTextChange}
                    />
    */

    searchTextChange = (text) => {
        this.setState({ firstName: text })
    }

    render() {
        if(this.state.isLoading){
            return (
                <View style={[styles.view]}>
                    <TouchableOpacity
                        style={styles.box}
                        title='Search'
                        onPress={() => this.search()}>
                        <Text style={styles.text}>Search
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return(
            <View style={[styles.view]}>
                {console.log(this.state.searchData)}
                <FlatList
                    data={this.state.searchData}
                    renderItem={({item}) => <Text style={styles.text}>{item.given_name} {item.family_name} - {item.email}</Text>}
                    keyExtractor={({id}, index) => id}
                />
            </View>
        );
    }
}

export default SignUp;