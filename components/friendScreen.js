import React, {Component} from 'react';
import { View,Text, StyleSheet, Button, TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from './modules/logo';


 class FriendScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            friendId:'',
            friendRequestList: [],
            userFriendList: [],
        }
    }

    componentDidMount(){
        this.seeAllFriend();
    }

    addFriend = async() => {
       let token = await AsyncStorage.getItem('@session_token');
       let userId = await AsyncStorage.getItem('user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.friendId + "/friends", {
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
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'User id not found';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(responseJson => {
            this.setState({userFriendList: responseJson})
        }) 

    }

    removeFriend = async(user_id) => {

        let token = await AsyncStorage.getItem('@session_token');

        await AsyncStorage.removeItem(user_id);

        return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id, {
            method: 'DELETE',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },  
        })

        .then((response) =>{
            this.seeAllFriend();
        })
        .then((response) => {
            console.log("Friend deleted");
        })
        .catch((error) => {
            console.log(error);
        })
     }
    

    friendRequestsNavigate() {
        this.props.navigation.navigate("FriendRequest");
    }

    render(){
        return(
    
        <View style = {stylesIn.flexContainer}>

            <View style = {stylesIn.homeLogo}>
            <Logo></Logo>
            </View>

            <View style = {stylesIn.friendSearch}>
            
            </View>

            <View style = {stylesIn.postFeed}>
            <Text>Find friend:</Text>
            <TextInput 
            placeholder = "Enter your friend's ID"
            onChangeText={(friendId) => this.setState({friendId})}
            />
            <Button 
            title = "Find friend"
            onPress={() => {this.findFriend()}}
            ></Button>


            {/* Add friend function */}
            <Text>Add friend:</Text>
            <TextInput 
            placeholder = "Enter your friend's ID"
            onChangeText={(friendId) => this.setState({friendId})}
            />
            <Button 
            title = "Add friend"
            onPress={() => {this.addFriend()}}
            ></Button>

            <Text>See all friends:</Text>
            <FlatList
            
                // calling the array 
                data={this.state.userFriendList}
                
                //specify the item that we want to show on the list
                renderItem={({item}) => (
                    <View>
                        <Text> {item.user_id} {item.user_givenname} {item.user_familyname} {'\n'} {item.user_email} {'\n'}{'\n'}</Text>              
                    </View>
                )}
                keyExtractor={(item) => item.user_id.toString()}
            />


            <Button 
            title = "See friend requests"
            onPress={() => {this.friendRequestsNavigate()}}
            ></Button>

            </View>

            <View styles = {stylesIn.mainMenu}>
                
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

 export default FriendScreen;


