import React, {Component} from 'react';
import { View,Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeLogo from '../modules/homeLogo';
import IsLoading from "../modules/isLoading";
import styles from "../modules/stylesheet";

 class FriendScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            friendId:'',
            friendRequestList: [],
            isLoading: true,
        }
    }
    
    componentDidMount(){
        this.friendRequests();
    }

    friendRequests = async() => {
        let token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
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
            this.setState({
                friendRequestList: responseJson,
                isLoading: false,
            })
        }) 
    }

    acceptFriend = async (user_id) => {

        let token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id , {
            method: 'post',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },  
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    console.log('friend accepted')
                    break
                case 401:
                    throw 'Unauthorised'
                    break
                case 404:
                    throw 'Not Found'
                    break
                case 500:
                    throw 'Server Error'
                    break
                default:
                    throw 'Something went wrong'
                    break
            }
        })
        .then((response) => {
            this.setState({isLoading: false})
            this.props.navigation.navigate("Friends")
          })
        .catch((error) => {
        console.log(error);
        })
    }


    removeFriend = async (user_id) => {

        let token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id , {
            method: 'delete',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },  
        })
        .then((response) => {
            switch(response.status){
                case 200:
                    console.log("Rejected friend request");
                    break
                case 401:
                    throw 'Unauthorised'
                    break
                case 404:
                    throw 'Not Found'
                    break
                case 500:
                    throw 'Server Error'
                    break
                default:
                    throw 'Something went wrong'
                    break
            }
        })
        .then((response) => {
            this.friendRequests();
        })
        .then((response) => {
            this.setState({isLoading: false})
          })
        .catch((error) => {
        console.log(error);
        })
    }


    render(){
        
        if(this.state.isLoading == true){
            return(
                <IsLoading></IsLoading>
            )
        }
        else{
            return(
            
            <View style = {stylesIn.flexContainer}>

                <View style = {stylesIn.homeLogo}>
                <HomeLogo></HomeLogo>
                </View>

                <View style = {stylesIn.mainContext}>
            
                <Text style={styles.postHeaderText}>Your friend requests</Text>
                
                <FlatList
                    // calling the array 
                    data={this.state.friendRequestList}

                    //specify the item that we want to show on the list
                    renderItem={({item}) => (
                        <View style = {styles.postBox}>
                        <View style = {styles.inPostContainer}>
                            <View style = {styles.inPostImage}>
                            </View>
                            <View style = {styles.inPostHeader}>
                            <Text style = {styles.postNameText}>{item.first_name} {item.last_name} </Text>
                            </View>
                        </View>
                            <View style = {stylesIn.btnContainer}>
                                <View style = {styles.btnContainer1}>
                                    <TouchableOpacity  
                                    style = {[styles.actionBtn, styles.actionBtnGreen]}
                                    onPress={() => this.acceptFriend(item.user_id)}>
                                    <Text style = {[styles.actionBtnLight]}>Accept</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style = {styles.btnContainer2}>
                                    <TouchableOpacity 
                                    style = {[styles.actionBtn,styles.actionBtnRed]}
                                    onPress={() => this.removeFriend(item.user_id)}>
                                    <Text style = {styles.actionBtnLight}>Reject</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.user_id.toString()}
                />
                </View>
            </View>
            )
    }   }
 }

 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: "#fdf6e4",
        paddingHorizontal: 20,
    },

    homeLogo: {
        flex: 1,
    },

    mainContext:{
        flex: 6,
    },

    btnContainer:{
        flex: 2,
        flexDirection: 'row',
    }
 
 })

 export default FriendScreen;


