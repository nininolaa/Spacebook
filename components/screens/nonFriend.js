import React, {Component} from 'react';
import { View,Text, StyleSheet, Button, TextInput, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeLogo from '../modules/homeLogo';
import IsLoading from "../modules/isLoading";
import styles from "../modules/stylesheet";

 class NonFriendScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            user_id: '',
            first_name: '',
            last_name: '',
            email: '',
            friend_count: '',
            userPostList: [],
            isLoading: true,
            alertMessage:''
        }
    }

    componentDidMount(){
       this.loadFriend();
    }

    async loadFriend (){

        let token = await AsyncStorage.getItem('@session_token');

        return fetch("http://localhost:3333/api/1.0.0/user/" + this.props.route.params.friendId, {
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
                case 404:
                    throw 'User not found'
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
                profile: responseJson,
                first_name: responseJson.first_name,
                last_name: responseJson.last_name,
                user_id: responseJson.user_id,
                email: responseJson.email,
                friend_count: responseJson.friend_count,
                isLoading: false,
            })
        }) 
    }

    addFriend = async() => {

        let token = await AsyncStorage.getItem('@session_token');

        return fetch("http://localhost:3333/api/1.0.0/user/" + this.props.route.params.friendId + "/friends", {
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
            </View>

            <View style = {stylesIn.postFeed}>
                <Text> User id: {this.state.user_id}</Text>
                <Text>First Name: {this.state.first_name}</Text>
                <Text>Last Name: {this.state.last_name}</Text>
                <Text>Email: {this.state.email}</Text>
                <Text>Friend count: {this.state.friend_count}</Text>
            </View>

            <View styles = {stylesIn.mainMenu}>
            <Button 
            title = "Add friend"
            onPress= {this.addFriend}
            ></Button>
            </View>
        </View>
        )
        }
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

 export default NonFriendScreen ;

