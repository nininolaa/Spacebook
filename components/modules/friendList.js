import React, {Component} from 'react';
import { View,Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "./stylesheet";
import ProfileImage from './profileImage';


class FriendList extends Component {

    constructor(props){
        super(props);

        this.state = {
            userFriendList: [],
            userId: this.props.userId,
            first_name: '',
        }
    }

    componentDidMount(){ 

        this.seeAllFriend();
        
        this.focusListener = this.props.navigation.addListener('focus', async () => {
            this.seeAllFriend();
        })
    }

    seeAllFriend = async() => {
        
        let user_id = await AsyncStorage.getItem('user_id');
        let token = await AsyncStorage.getItem('@session_token');
        if(this.state.userId == ''){
            this.setState({
                userId: user_id
            })
        }
        return fetch("http://localhost:3333/api/1.0.0/user/"+  this.state.userId + "/friends", {
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



    render(){
        return(
        
        <View style = {stylesIn.flexContainer}>  

            <Text style={styles.postHeaderText}>Friends:</Text>
            
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
                            onPress = {() => {this.props.navigation.navigate("FriendProfile", {friendId: item.user_id})}} 
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

})

export default FriendList ;


