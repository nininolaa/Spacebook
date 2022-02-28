import React, {Component} from 'react';
import { View,Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Button, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {likePost, unlikePost} from '../libs/postFunctions'
import HomeLogo from './modules/homeLogo';
import styles from "./modules/stylesheet";
import IsLoading from "./modules/isLoading";
import ProfileImage from './modules/profileImage';


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
            addPost: '',
            isLoading: true,
        }
    }

    async componentDidMount(){

        this.token = await AsyncStorage.getItem('@session_token');
        
        this.loadFriend();
    }

    addPost = async() => {

        let token = await AsyncStorage.getItem('@session_token')

        let post = { text: this.state.addPost }

        return fetch("http://localhost:3333/api/1.0.0/user/" + this.props.route.params.friendId + "/post", {
            method: 'post',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })
        .then((response) => {
            switch(response.status){
                case 201: 
                    return response.json();
                    break
                case 400:
                    throw 'Failed validation'
                    break
                default:
                    throw 'Something went wrong'
                    break
            }
        })
        .then((responseJson) => {
            console.log("Posted post ", responseJson);
            this.userPosts();
        })
        .catch((error) => {
            console.log(error);
        })
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
            switch(response.status){
                case 200: 
                    return response.json()
                    break
                case 401:
                    throw 'Unauthorised'
                    break
                case 404:
                    throw 'User not found'
                case 500:
                    throw 'Server Error'
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
            switch(response.status){
                case 200:
                    return response.json()
                    break
                case 401:
                    throw 'Unauthorised'
                    break
                case 403:
                    this.props.navigation.navigate("NonFriendScreen", {friendId: this.props.route.params.friendId})
                    break
                case 404: 
                    throw 'Not found'
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
                userPostList: responseJson,
                isLoading: false,
            })
        }) 
    }
    
    editPost() {
        this.setState({editable: true}) ;
    }

    isEditMode() {
        return this.state.editable;
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

            <View style = {stylesIn.friendDetails}>
                <View style = {stylesIn.friendImage}>
                <ProfileImage
                    userId = {this.props.route.params.friendId}
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

            <View style = {stylesIn.friendBtnContainer}>
                <View style = {stylesIn.seeFriendBtn}>
                    <TouchableOpacity
                    style = {[styles.actionBtn,styles.actionBtnGreen]}
                    >
                    <Text style = {styles.actionBtnLight}>See all {this.state.first_name}'s friends</Text>
                    </TouchableOpacity>
                </View>

                <View style = {stylesIn.friendPostBtn}>
                    <TouchableOpacity>
                        <Text>Find a specific post of {this.state.first_name} </Text>
                        <TextInput
                            style = {stylesIn.findPostInput}
                            placeholder="Enter your post id here"
                            onChangeText={(postId) => this.postId = postId }
                        ></TextInput>
                    </TouchableOpacity>
                </View>
            </View>

            <View style = {stylesIn.addPost}>
           
                <Text>Post Screen</Text>
                <TextInput
                placeholder="Add text here"
                onChangeText={(addPost) => this.setState({addPost})}
                value = {this.state.addPost}
                ></TextInput>
                <Button 
                title="Add Post"
                onPress = {() => this.addPost()}
                ></Button>
        
            </View>
            <View style = {stylesIn.friendPosts}>
                <FlatList 
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
                            ><Text >Like</Text></TouchableOpacity>
                            
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
        backgroundColor: "#fdf6e4",
    },

    homeLogo: {
        flex: 1.5,
       // backgroundColor: 'pink'
    },

    friendDetails: {
        flex: 2,
        flexDirection: 'row',
       // backgroundColor: 'green'
    },

    friendImage:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'blue'
    },

    friendInfo:{
        flex: 1.5,    
        //backgroundColor: 'red',
        //alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

    friendBtnContainer:{
        flex: 1,
        flexDirection: 'row',
       // backgroundColor: 'blue'
    },

    seeFriendBtn:{
        flex: 1,
        backgroundColor:'grey'
    },

    friendPostBtn:{
        flex: 1,
        backgroundColor:'pink'
    },

    addPost:{
        flex: 2,
        //backgroundColor: 'pink'
    },

    friendPosts:{
        flex: 5,
        //backgroundColor: 'red'
    },
})

export default FriendProfile ;


