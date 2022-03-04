import React, {Component} from 'react';
import { View,Text, StyleSheet, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar } from 'react-native-paper';

import styles from "../modules/stylesheet";
import ProfileImage from '../modules/profileImage';
import HomeLogo from '../modules/homeLogo';
import IsLoading from "../modules/isLoading";
import { TouchableOpacity } from 'react-native';

 class SearchResult extends Component {

    constructor(props){
        super(props);

        this.token = '',

        this.state = {
            searchList: [],
            isLoading: true,
            alertMessage: '',
            offset: '',
            limit: '',
        }
    }

    async componentDidMount(){
        this.searchQuery();
    }

    //search_in ,limit and offset??
    async searchQuery (){

        let token = await AsyncStorage.getItem('@session_token');

        return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.props.route.params.query + "&limit=7" + "&offset=5", {
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
                    throw {errorCase: "BadRequest"}
                    break
                case 401:
                    throw {errorCase: "Unauthorised"}
                    break
                case 500:
                    throw {errorCase: "ServerError"}
                    break
                default:
                    throw {errorCase: "WentWrong"}
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
        .catch((error) => {
            console.log(error);
            switch (error.errorCase){
    
                case 'BadRequest':    
                    this.setState({
                        alertMessage: 'Bad Request',
                        isLoading: false,
                    })
                    break
    
                case 'Unauthorised':    
                    this.setState({
                        alertMessage: 'Unauthorised, Please login',
                        isLoading: false,
                    })
                    break
                case "ServerError":
                    this.setState({
                        alertMessage: 'Cannot connect to the server, please try again',
                        isLoading: false,
                    })
                    break
                case "WentWrong":
                    this.setState({
                        alertMessage: 'Something went wrong, please try again',
                        isLoading: false,
                    })
                    break
            }
            })
    }

    loadFriendProfile(friendId) {
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
            
            <Text style = {styles.errorMessage}>{this.state.alertMessage}</Text>

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
            <View style = {stylesIn.btnContainer}>
                    <View style = {stylesIn.leftBtn}>
                        <TouchableOpacity
                        style = {[stylesIn.backBtn, styles.actionBtnOrange]}>
                            <Text style = {styles.actionBtnLight}>Back</Text>
                        </TouchableOpacity>
                    </View>
                    <View style = {stylesIn.rightBtn}>
                        <TouchableOpacity
                        style = {[stylesIn.backBtn, styles.actionBtnOrange]}>
                            <Text style = {styles.actionBtnLight}>Next</Text>
                        </TouchableOpacity>
                    </View>

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
    btnContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    leftBtn:{
        flex:1,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },

    rightBtn:{
        flex:1,
        flexDirection: 'column',
        alignItems: 'flex-end'
    },

    backBtn:{
        margin :5,
        padding: 10,
        width:'70%'
        
    }


 
 })

 export default SearchResult ;


