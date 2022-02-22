import React, {Component} from 'react';
import { View,Text, StyleSheet, Button, TextInput, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeLogo from './modules/homeLogo';

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
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'User id not found';
            }else{
                throw 'Something went wrong';
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
            })
        }) 
    }

    addFriend = async() => {

        let token = await AsyncStorage.getItem('@session_token');

         return fetch("http://localhost:3333/api/1.0.0/user/" + this.friendId + "/friends", {
             method: 'POST',
             headers: {
                 "X-Authorization": token,
                 'Content-Type': 'application/json'
             },  
         })
        .then((response) => {
            console.log("Request sent");
        })
        .catch((error) => {
            console.log(error);
        })
     } 

    render(){
 
        return(
        
        <View style = {stylesIn.flexContainer}>

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


