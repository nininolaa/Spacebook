import React, {Component} from 'react';
import { View,Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "./stylesheet";
import ProfileImage from './profileImage';


class FriendList extends Component {

    constructor(props){
        super(props);

        this.token = '';
        this.user_id = '';

        this.state = {
            userFriendList: [],
        }
    }

    async componentDidMount(){

        this.token = await AsyncStorage.getItem('@session_token');
       
        
        this.seeAllFriend();
    }

    seeAllFriend = async() => {
        
        console.log("here", this.props.friend_id)
        
        let token = await AsyncStorage.getItem('@session_token');
        let userId = await AsyncStorage.getItem('user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/"+ this.props.friend_id + "/friends", {
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
                    this.props.navigation.navigate("ErrorAlert", {errorCase: "Unauthorised"})
                    break
                case 403:
                    this.props.navigation.navigate("ErrorAlert", {errorCase: "ViewFriend"})
                    break
                case 404:
                    this.props.navigation.navigate("ErrorAlert", {errorCase: "UserNotFound"})
                    break
                case 500:
                    this.props.navigation.navigate("ErrorAlert", {errorCase: "ServerError"})
                    break
                default:
                    this.props.navigation.navigate("ErrorAlert", {errorCase: "WentWrong"})
                    break
            }
        })
        .then(responseJson => {
            this.setState({
                userFriendList: responseJson,
            })
        }) 
        .catch((error) => {
            console.log(error);
        })

    }



    render(){
        return(
        
        <View style = {stylesIn.flexContainer}>  

            <Text style={styles.postHeaderText}>All friends:</Text>
            <FlatList
                // calling the array 
                data={this.state.userFriendList}
                
                //specify the item that we want to show on the list
                renderItem={({item}) => (
                    <View style = {[styles.inPostContainer,styles.postBox]}>
                        <View style = {styles.inPostImage}>
                        <ProfileImage
                        userId = {this.props.friend_id}
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
            />
        </View>
        )
    }
 }

 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: "#fdf6e4",
    },

    homeLogo: {
        flex: 1.5,
    },

    friendDetails: {
        flex: 2,
        flexDirection: 'row',
    },

    friendImage:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    friendInfo:{
        flex: 1.5,    
        justifyContent: 'center',
        alignItems: 'center',
    },

    friendBtnContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingLeft: 10,
    },

    seeFriendBtnContainer:{
        flex: 1,   
        padding:10,
    },

    seeFriendBtn:{
        borderWidth: 2,
        borderRadius: 5,
        width: '80%',
        height:'100%',
        alignItems:'center',
    },

    seeFriendBtnText:{
        fontSize: 15,
        alignItems:'center',
        textAlign:'center',
        color: 'white'
    },

    friendBtnOrange:{
        backgroundColor: '#f9943b',
        borderColor: '#f9943b',
    },

    friendBtnGrey:{
        backgroundColor: '#808080',
        borderColor: '#808080',
    },

    backToTab:{
        flex: 1,
        justifyContent: 'space-around',
        padding:10,
    },

    friendProfileHeaderText:{
        padding: 5,
        fontSize:18,
    },

    findfriendPost:{
        flex: 2,
        paddingHorizontal:10,
        marginTop:20,
        
    },

    addPost:{
        flex: 3,
        paddingHorizontal:10,
    },

    friendPosts:{
        flex: 5,
    },

    postInput:{
        borderWidth: 3,
        borderColor: '#ffc9a9',
        borderRadius: 3,
        padding: 30,
        fontSize: 15,
    },

})

export default FriendList ;


