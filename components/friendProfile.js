import React, {Component} from 'react';
import { View,Text, StyleSheet, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeLogo from './modules/homeLogo';
import {likePost, unlikePost} from '../libs/postFunctions'
import styles from "./modules/stylesheet";
import IsLoading from "./modules/isLoading";

 class FriendProfile extends Component {

    constructor(props){
        super(props);

        this.token = '';

        this.state = {
            user_id: '',
            first_name: '',
            last_name: '',
            email: '',
            friend_count: '',
            userPostList: [],
            isLoading: true,
        }
    }

    async componentDidMount(){
        this.token = await AsyncStorage.getItem('@session_token');
        this.loadFriend();
    }

    loadFriend (){

        return fetch("http://localhost:3333/api/1.0.0/user/" + this.props.route.params.friendId, {
            method: 'get',
            headers: {
                "X-Authorization": this.token,
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
            this.userPosts();
        }) 
    }

    userPosts = () => {

        return fetch("http://localhost:3333/api/1.0.0/user/"+ this.props.route.params.friendId + "/post", {
            method: 'get',
            headers: {
                "X-Authorization": this.token,
                'Content-Type': 'application/json'
            },  
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'User id not found';
            }else if(response.status === 403){
                this.props.navigation.navigate("NonFriendScreen", {friendId: this.props.route.params.friendId})
            }
            else{
                throw 'Something went wrong';
            }
        })
        .then(responseJson => {
            this.setState({
                userPostList: responseJson,
                isLoading: false,
            })
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
            <FlatList styles = {stylesIn.mainMenu}
                data={this.state.userPostList}

                renderItem={({item}) => (
                    <View>
                        <Text> Friend name: {item.author.first_name} {item.author.last_name}</Text>    
                        <Text> Post id: {item.post_id} </Text>  
                        <TextInput
                        placeholder = {item.text}
                        editable = {this.state.editable}
                        onChangeText={(new_text_post) => this.new_text_post = new_text_post}
                        ></TextInput>   
                        <Text> Likes: {item.numLikes} {'\n'}  </Text> 
                        <TouchableOpacity
                        onPress = {
                            () => likePost(this.token,item.author.user_id, item.post_id) 
                            .then(() => {
                                this.userPosts();  
                            }) 
                            .catch(() => {
                                console.log('Error')
                            })
                            }
                        style = {[styles.actionBtn,styles.actionBtnGreen]}
                        ><Text style = {styles.actionBtnLight}>Like</Text></TouchableOpacity>
                        <TouchableOpacity
                        onPress = {
                            () => unlikePost(this.token,item.author.user_id, item.post_id) 
                            .then(() => {
                                this.userPosts();  
                            }) 
                            .catch(() => {
                                console.log('Error')
                            })
                        }
                        style = {[styles.actionBtn,styles.actionBtnBlue]}
                        ><Text style = {styles.actionBtnLight}>Unlike</Text></TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => item.post_id.toString()}
            />
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

 export default FriendProfile ;


