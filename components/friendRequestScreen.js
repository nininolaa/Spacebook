import React, {Component} from 'react';
import { View,Text, StyleSheet, Button, TextInput, FlatList, Alert, TouchableWithoutFeedback} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from './modules/logo';
import IsLoading from "./modules/isLoading";

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
            console.log("Friend accepted");
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
            this.friendRequests();
          })
        .then((response) => {
            this.setState({isLoading: false})
            console.log("Rejected friend request");
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
            <Logo></Logo>
            </View>

            <View style = {stylesIn.friendSearch}>
            </View>

            <View style = {stylesIn.postFeed}>
           
            <Text>See all friend requests</Text>
            
            <FlatList
                // calling the array 
                data={this.state.friendRequestList}

                //specify the item that we want to show on the list
                renderItem={({item}) => (
                    <View>
                      <Text>{item.first_name} {item.last_name} </Text>
                      <Button title="accept" color='lightgreen' onPress={() => this.acceptFriend(item.user_id)}></Button>
                      <Button title="reject" color='red' onPress={() => this.removeFriend(item.user_id)}></Button>
                      
                    </View>
                )}
                keyExtractor={(item) => item.user_id.toString()}
            />
            </View>

            <View styles = {stylesIn.mainMenu}>
                
            </View>
        </View>
        )
    }   }
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

 export default FriendScreen;


