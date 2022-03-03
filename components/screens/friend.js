import React, {Component} from 'react';
import { Searchbar } from 'react-native-paper';
import { View,Text, StyleSheet, Button, TextInput, FlatList,  ScrollView, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeLogo from '../modules/homeLogo';
import IsLoading from '../modules/isLoading';
import styles from "../modules/stylesheet";
import FriendList from '../modules/friendList';

 class FriendScreen extends Component {

    constructor(props){
        super(props);
        
        
        this.searchQuery = '';
        this.token = '',

        this.state = {
            friendId: '',
            friendRequestList: [],
            userFriendList: [],
            isLoading: false,
            user_id: '',
            alertMessage: '',
        }
    }

    async componentDidMount(){

        this.state.user_id = await AsyncStorage.getItem('user_id');
        // this.focusListener = this.props.navigation.addListener('focus', async () => {
        // this.seeAllFriend();
        // })
        console.log(this.state.user_id)
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

    seeAllFriend = async() => {
        
        let token = await AsyncStorage.getItem('@session_token');
        let userId = await AsyncStorage.getItem('user_id');

        return fetch("http://localhost:3333/api/1.0.0/user/"+ userId + "/friends", {
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
                case 401:
                    throw {errorCase: "Unauthorised"}
                    break
                case 403:
                    throw {errorCase: "ViewFriend"}
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
        .then(responseJson => {
            this.setState({
                userFriendList: responseJson,
                isLoading: false
            })
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

                case 'ViewFriend':    
                    this.setState({
                        alertMessage: 'Can only view the friends of yourself or your friends',
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
    
    friendRequestsNavigate() {
        this.props.navigation.navigate("FriendRequest");
    }

    onSearchPress(){
        this.props.navigation.navigate("SearchResult",{query:this.searchQuery, friends:this.state.userFriendList})
    }

    profileNavigate(friendId){
        this.props.navigation.navigate("FriendProfile", {friendId: friendId})
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
            <Text>{this.state.alertMessage}</Text>
            <View style = {stylesIn.homeLogo}>
            <HomeLogo></HomeLogo>
            </View>

            <View style = {stylesIn.friendSearch}>
            <Searchbar 
            placeholder="Find friends"
            onChangeText = {(query) => {this.searchQuery = query}}
            onIconPress={() => {this.onSearchPress()}}
            ></Searchbar>
            </View>

            <View style = {stylesIn.friendBtnContainer}>
                <View style = {stylesIn.friendRequestBtn}>
                    <TouchableOpacity 
                    style = {[styles.friendsBtn, styles.actionBtnOrange]}
                    onPress={() => {this.friendRequestsNavigate()}}
                    ><Text style = {[styles.actionBtnLight]}>See friend requests</Text>
                    </TouchableOpacity>
                </View>
            </View>
            

            {/* Add friend function */}
            {/* <Text>Add friend:</Text>
            <TextInput 
            placeholder = "Enter your friend's ID"
            onChangeText={(friendId) => this.friendId = friendId}
            />
            <Button 
            title = "Add friend"
            onPress= {() => this.addFriend()}
            ></Button> */}

            <View style = {stylesIn.friendList}>
                {/* <FriendList
                    userId={this.state.user_id}
                    navigation={this.props.navigation}
                ></FriendList> */}
                {/* <Text style={styles.postHeaderText}>All friends:</Text>
                <FlatList
                    // calling the array 
                    data={this.state.userFriendList}
                    
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
                                <Text 
                                onPress = {() => {this.profileNavigate(item.user_id)}} 
                                style = {styles.postNameText}> {item.user_givenname} {item.user_familyname} {'\n'} 
                                </Text>              
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.user_id.toString()}
                /> */}
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


