import React, {Component} from 'react';
import { View,Text, StyleSheet, Button, TextInput, FlatList, Alert, TouchableWithoutFeedback} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from './modules/logo';
import IsLoading from "./modules/isLoading";

 class SearchResult extends Component {

    constructor(props){
        super(props);

        this.state = {
            searchList: [],
            isLoading: true,
        }
    }

    componentDidMount(){
       this.searchQuery();
    }

    async searchQuery (){

        let token = await AsyncStorage.getItem('@session_token');

        return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.props.route.params.query, {
            method: 'get',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'User id not found';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(responseJson => {
            console.log(responseJson);
            this.setState({
                searchList: responseJson,
                isLoading: false
            });
        }) 
    }

    loadFriendProfile(friendId) {
        //conditional check for friend and non-friend profile
        this.props.navigation.navigate("FriendProfile", {friendId: friendId})
    }

    render(){

        if(this.state.isLoading == true){
            return(
                <IsLoading></IsLoading>
            );
        }

        else{
 
        return(
        
        <View style = {stylesIn.flexContainer}>

            <View style = {stylesIn.homeLogo}>
            <Logo></Logo>
            </View>

            <View style = {stylesIn.friendSearch}>
            </View>

            <View style = {stylesIn.postFeed}>
           
            <Text>Search Result</Text>
            <FlatList
            
            data={this.state.searchList}
            
            //specify the item that we want to show on the list
            renderItem={({item}) => (
                <View>
                    <Text onPress={() => { this.loadFriendProfile(item.user_id)}}>{item.user_givenname} {item.user_familyname}  {'\n'}{'\n'}</Text>            
                </View>
            )}
            keyExtractor={(item) => item.user_id.toString()}
            />
            </View>

            <View styles = {stylesIn.mainMenu}>
                
            </View>
        </View>
        )}
    }
 }

 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
    },

    homeLogo: {
        flex: 5,
    },

    friendSearch: {
        flex: 5,
    },

    postFeed: {
        flex: 30,
    },

    mainMenu: {
        flex: 20,
    }
 
 })

 export default SearchResult ;


