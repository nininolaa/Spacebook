import React, {Component} from 'react';
import { View,Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../modules/logo';
import IsLoading from "../modules/isLoading";
import styles from "../modules/stylesheet";
import ProfileImage from '../modules/profileImage';
import UserWall from '../modules/userWall';

 class ProfileScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            user_id: '',
            first_name: '',
            last_name: '',
            friend_count: '',
            email: '',
            isLoading: true,
            userProfile: [],
            userPostList: [],
            alertMessage: '',
        }
    }

    async componentDidMount() {

        this.state.user_id = await AsyncStorage.getItem('user_id');
        this.loadProfile();

        this.focusListener = this.props.navigation.addListener('focus', async () => {  
           this.loadProfile();
        })
    }
    

    loadProfile = async() => {

        let user_id = await AsyncStorage.getItem('user_id');
        let token = await AsyncStorage.getItem('@session_token');
        console.log(token)
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
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
        .then(response => {
            this.setState({
                userProfile: response,
                user_id: response.user_id,
                first_name: response.first_name,
                last_name: response.last_name,
                friend_count: response.friend_count,
                email: response.email,
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

    userPosts = async() => {

        let user_id = await AsyncStorage.getItem('user_id');
        let token = await AsyncStorage.getItem('@session_token');

        return fetch("http://localhost:3333/api/1.0.0/user/"+ user_id + "/post", {
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
                    throw {errorCase: "UnauthorisedPost"}
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
                userPostList: responseJson,
                isLoading: false
            })
        })
        .catch((error) => {
            console.log(error);
            switch (error.errorCase){

                case 'Unauthorised':    
                    this.setState({
                        alertMessage: 'Unauthorised, Please login',
                        isLoading: false
                    })
                    break
                case 'UnauthorisedPost':    
                    this.setState({
                        alertMessage: 'You can only view the post of yourself or your friends',
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

        if(this.state.isLoading == true){
            return(
                <IsLoading></IsLoading>
              );
        }

        else{
            return(

            <View style = {stylesIn.flexContainer}>

                <View style = {stylesIn.firstSubContainer}>

                        <View style = {stylesIn.homeLogo}> 
                            <Logo></Logo>
                        </View>

                        <View style = {stylesIn.profilePicture}>
                            <ProfileImage
                            userId = {this.state.user_id}
                            isEditable = {true}
                            width = {100}
                            height = {100}
                            navigation={this.props.navigation}
                            style = {stylesIn.imageAlign}
                            ></ProfileImage>
                        </View>

                    <View style = {stylesIn.userInfo}>
                        <Text style = {styles.profileText}> ID:{this.state.user_id}  |  {this.state.first_name} {this.state.last_name} </Text>
                        <Text style = {styles.profileMiniText}> {this.state.email}</Text>
                        <Text style = {styles.profileMiniText}> Total friend: {this.state.friend_count} {'\n'} </Text>

                        <TouchableOpacity
                        onPress = {() => {this.props.navigation.navigate("Setting")}}
                        style = {styles.navigateBtn}
                        ><Text style = {styles.navigateBtnText}>Edit information</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style = {stylesIn.secondSubContainer}>
                    <View style = {stylesIn.userPost}>
                    <Text style = {styles.errorMessage}>{this.state.alertMessage}</Text>
                        <UserWall
                        navigation = {this.props.navigation}
                        ></UserWall>
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

    firstSubContainer:{
        flex:1,
    },

    secondSubContainer:{
        flex: 1,
    },

    homeLogo: {
        flex: 1,
    },

    profilePicture: {
        flex: 2.5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    userInfo: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },

    userPost: {
        flex: 8,
    },

    imageAlign:{
        marginLeft:30,
        paddingLeft: 30,
    }

 })

 export default ProfileScreen;


