import React, {Component} from 'react';
import { Searchbar } from 'react-native-paper';
import { View,Text, StyleSheet, FlatList,  ScrollView, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeLogo from '../modules/homeLogo';
import IsLoading from '../modules/isLoading';
import styles from "../modules/stylesheet";
import ProfileImage from '../modules/profileImage';
import FriendList from '../modules/friendList';

 class FriendScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            friendId: '',
            friendRequestList: [],
            userFriendList: [],
            isLoading: false,
            user_id: '',
            alertMessage: '',
            searchQuery: ''
        }
    }

    async componentDidMount(){
        let userId = await AsyncStorage.getItem('user_id');
        this.setState({user_id: userId})

        // this.focusListener = this.props.navigation.addListener('focus', async () => {
        //     this.seeAllFriend();
        // })
    }
    

    addFriend = async() => {
        let token = await AsyncStorage.getItem('@session_token');
        let user_id = await AsyncStorage.getItem('user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.friendId + "/friends", {
            method: 'POST',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },  
        })
        .then((response) => {
            switch(response.status){
                case 200: 
                    break
                case 401:
                    throw {errorCase: "Unauthorised"}
                    break
                case 403:
                    throw {errorCase: "AlreadyAdded"}
                    break
                case 404:
                    throw {errorCase: "UserNotFound"}
                    break
                case 500:
                    throw {errorCase: "ServerError"}
                    break
                default:
                    throw {errorCase: "WentWrong"}
                    break
            }
        })
        .then((response) => {
            this.setState({isLoading: false})
            console.log("Request sent");
        })
        .catch((error) => {
        console.log(error);
            switch (error.errorCase){

                case 'Unauthorised':    
                    this.setState({
                        alertMessage: 'Unauthorised, Please login',
                        isLoading: false,
                    })
                    break
                case 'AlreadyAdded':    
                    this.setState({
                        alertMessage: 'User is already added as a friend',
                        isLoading: false,
                    })
                    break
                case 'UserNotFound':    
                    this.setState({
                        alertMessage: 'Not found',
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


    onSearchPress(){
        this.props.navigation.navigate("SearchResult",{query:this.state.searchQuery, friends:this.state.userFriendList})
    }

    render(){
        if(this.state.isLoading == true) {
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
            onChangeText = {(query) => {this.setState({searchQuery: query})}}
            onIconPress={() => {this.onSearchPress()}}
            ></Searchbar>
            </View>

            <View style = {stylesIn.friendBtnContainer}>
                <View style = {stylesIn.friendRequestBtn}>
                    <TouchableOpacity 
                    style = {[styles.friendsBtn, styles.actionBtnOrange]}
                    onPress={() => {(this.props.navigation.navigate("FriendRequest"))}}
                    ><Text style = {[styles.actionBtnLight]}>See friend requests</Text>
                    </TouchableOpacity>
                </View>
            </View>
            

            <View style = {stylesIn.friendList}>
                <Text style = {styles.errorMessage}>{this.state.alertMessage}</Text>
                <FriendList
                    userId={this.state.user_id}
                    navigation={this.props.navigation}
                ></FriendList>
            </View>
            
        </View>
        
        )  
        }
    }     
 }

 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: "#fdf6e4",
    },

    homeLogo: {
        flex: 0.8,
        //backgroundColor: 'blue'
    },

    friendSearch: {
        flex: 0.5,
        paddingHorizontal: 20,
        //backgroundColor: 'green'
    },

    friendBtnContainer:{
        flex: 0.5,
        flexDirection:'flex-end',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    allFriendBtn:{
        flex: 1,
        backgroundColor: 'pink'
    },
    friendRequestBtn:{
        flex: 1,
        //backgroundColor: 'orange'
    },
    friendList:{
        flex: 2,
       // backgroundColor: 'grey',
        paddingHorizontal: 20,
    },
 })

 export default FriendScreen;


