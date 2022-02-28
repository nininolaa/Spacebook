import React, {Component} from 'react';
import { View,Text, StyleSheet, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar } from 'react-native-paper';

import styles from "./modules/stylesheet";
import ProfileImage from './modules/profileImage';
import HomeLogo from './modules/homeLogo';
import IsLoading from "./modules/isLoading";

 class SearchResult extends Component {

    constructor(props){
        super(props);

        this.token = '',

        this.state = {
            searchList: [],
            isLoading: true,
        }
    }

    async componentDidMount(){
        this.searchQuery();
    }

    //search_in ,limit and offset??
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
            switch(response.status){
                case 200: 
                    return response.json()
                    break
                case 400:
                    throw 'Bad request'
                    break
                case 401:
                    throw 'Unauthorised'
                    break
                case 500:
                    throw 'Server Error'
                    break
                default:
                    throw 'Something went wrong'
                    break
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
                <HomeLogo></HomeLogo>
            </View>

            <View style = {stylesIn.friendSearch}>
                <Searchbar 
                placeholder="Find friends"
                onChangeText = {(query) => {this.searchQuery = query}}
                onIconPress={() => {this.searchQuery()}}
                ></Searchbar>
            </View>

            <View style = {stylesIn.friendLists}>
           
                <Text style = {styles.postHeaderText}>Search Result</Text>

                <FlatList
                // calling the array 
                data={this.state.searchList}
                
                //specify the item that we want to show on the list
                renderItem={({item}) => (
                    <View style = {[styles.inPostContainer,styles.postBox]}>
                        <View style = {styles.inPostImage}>
                            <ProfileImage
                            userId = {item.user_id}
                            isEditable = {false}
                            width = {50}
                            height = {50}
                            navigation={this.props.navigation}
                            ></ProfileImage>
                        </View>
                        
                        <View style = {styles.inPostHeader}>    
                            <Text onPress = {() => {this.loadFriendProfile(item.user_id)}} style = {styles.postNameText}> {item.user_givenname} {item.user_familyname} {'\n'} </Text>              
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.user_id.toString()}
            />
            </View>

        </View>
        )}
    }
 }

 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: "#fdf6e4",
    },

    homeLogo: {
        flex: 1,
    },

    friendSearch: {
        flex: 0.5,
    },

    friendLists: {
        flex: 5,
    },

 
 })

 export default SearchResult ;


