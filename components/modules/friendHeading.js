import React, {Component} from 'react';
import { View,Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "./stylesheet";
import IsLoading from "./isLoading";
import ProfileImage from './profileImage';


class FriendHeading extends Component {

    constructor(props){
        super(props);

        this.state = {
            user_id: '',
            first_name: '',
            last_name: '',
            email: '',
            friend_count: '',
            userPostList: [],
            addPost: '',
            isLoading: true,
            alertMessage: '',
        }
    }

    componentDidMount(){
        this.loadFriend();
    }


    loadFriend = async() => {

        let token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.props.friend_id, {
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
                profile: responseJson,
                first_name: responseJson.first_name,
                last_name: responseJson.last_name,
                user_id: responseJson.user_id,
                email: responseJson.email,
                friend_count: responseJson.friend_count,
                isLoading: false,
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


    render(){
        
        return(
        
        <View style = {stylesIn.flexContainer}> 

            <View style = {stylesIn.subContainer} >
            <Text style = {styles.errorMessage}>{this.state.alertMessage}</Text>
                <View style = {stylesIn.friendImage}>
                <ProfileImage
                    userId = {this.props.friend_id}
                    isEditable = {false}
                    width = {100}
                    height = {100}
                    navigation={this.props.navigation}
                ></ProfileImage>
                </View>
                <View style = {stylesIn.friendInfo}>
                    <Text style = {styles.profileText}> ID: {this.state.user_id} | {this.state.first_name} {this.state.last_name}</Text>
                    <Text>Email: {this.state.email}</Text>
                    <Text>Friend count: {this.state.friend_count}</Text>
                </View>
            </View>    
        </View>
        )
        
    }
}

 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: "#fdf6e4",
    },

    subContainer:{
        flex: 1,
        flexDirection: 'row'
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

export default FriendHeading ;


