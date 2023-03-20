import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, TextInput, View, Button, Alert, } from 'react-native';
import styles from './stylesheet.js';


class API extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            ListData: [], 
            id: '',
            item_name: '',
            description: '',
            unit_price: '',
            quantity: ''
      
        }
    }

    deleteItem(id){
        return fetch('http://10.0.2.2:3333/list/' + id, {
            method: 'delete'
          })
          .then((response) => {
              this.getData();
          })
          .then((response) => {
    
            Alert.alert("Item deleted")
    
          })
          .catch((error) =>{
            console.log(error);
          });
      }    

    addItem(){
        return fetch("http://10.0.2.2:3333/list",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/js' },
          body: JSON.stringify({
            id: this.state.id,
            item_name: this.state.item_name,
            description: this.state.description,
            unit_price: this.state.unit_price,
            quantity: this.state.quantity
          })
        })
        .then((response) => {
          Alert.alert("Item Added!");
        })
        .catch((error) => {
          console.error(error);
        });
      }

    getData() {
        return fetch('http://localhost:3333/list')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    ListData: responseJson,
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
                    data={this.state.ListData}
                    renderItem={({ item }) => <Text style={styles.text}>{item.item_name} - {item.description}</Text>}
                    keyExtractor={({ id }, index) => id}
                />
            </View>
        );
    }

}

export default API;