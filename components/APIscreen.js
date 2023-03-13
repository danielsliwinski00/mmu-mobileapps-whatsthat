import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, } from 'react-native';
import styles from './stylesheet.js';


class API extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            shoppingListData: []
        }
    }

    getData() {
        return fetch('http://localhost:3333/list')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    shoppingListData: responseJson,
                });

            })
            .catch((error) => {
                console.log(error);
            });

    }

    componentDidMount(){
        this.getData();
    }

    render() {

        if(this.state.isLoading){
            return(
              <View>
                <ActivityIndicator/>
              </View>
            )
        }
      
        return (
            <View>
                <FlatList
                    data={this.state.shoppingListData}
                    renderItem={({ item }) => <Text style={styles.text}>{item.item_name} - {item.description}</Text>}
                    keyExtractor={({ id }, index) => id}
                />
            </View>
        );
    }

}

export default API;