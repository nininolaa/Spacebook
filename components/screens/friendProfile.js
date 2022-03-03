import React, {Component} from 'react';
import { View,Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Button, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {likePost, unlikePost} from '../../libs/postFunctions'
import HomeLogo from '../modules/homeLogo';
import styles from "../modules/stylesheet";
import IsLoading from "../modules/isLoading";
import ProfileImage from '../modules/profileImage';
import FriendHeading from '../modules/friendHeading';


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
        
        this.userPosts();
    }

    loadFriend = async() => {
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
                first_name: responseJson.user_givenname,
                last_name: responseJson.last_name,
                user_id: responseJson.user_id,
                email: responseJson.email,
                friend_count: responseJson.friend_count,
                isLoading: false,
            })
            //this.userPosts();
        }) 
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
        .then((responseJson) => {
            console.log("Posted post ", responseJson);
            this.userPosts();
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


    render(){
        if(this.state.isLoading == true){
            return(
                <IsLoading></IsLoading>
              );
        }

        else{
        return(
        
        <ScrollView style = {stylesIn.flexContainer}>
            <View style = {stylesIn.subMainContainer}>
            <View style = {stylesIn.firstSubContainer}>
            <View style = {stylesIn.homeLogo}>
            <HomeLogo></HomeLogo>
            </View>

            <View style = {stylesIn.friendDetails}>
            <FriendHeading
                friend_id={this.props.route.params.friendId}
                navigation={this.props.navigation}
            ></FriendHeading>
            </View>

            <View style = {stylesIn.friendBtnContainer}>

                <View style = {stylesIn.backToTab}>
                    <TouchableOpacity
                    style = {[stylesIn.seeFriendBtn,stylesIn.friendBtnGrey]}
                    onPress = {() => this.props.navigation.navigate("Friends")}
                    >
                    <Text style = {stylesIn.seeFriendBtnText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>

                <View style = {stylesIn.seeFriendBtnContainer}>
                    <TouchableOpacity
                    style = {[stylesIn.seeFriendBtn,stylesIn.friendBtnOrange]}
                    onPress = {() => this.props.navigation.navigate("FriendsOfFriend",{userId: this.props.route.params.friendId  })}
                    >
                    <Text style = {stylesIn.seeFriendBtnText}>See all {this.state.first_name}'s friends</Text>
                    </TouchableOpacity>
                </View>
                
            </View>

            <View style = {stylesIn.addPost}>
           
                <Text style = {stylesIn.friendProfileHeaderText}>Share a post:</Text>
                <TextInput
                style = {stylesIn.postInput}
                placeholder="Add text here"
                numberOfLines= "5"
                onChangeText={(addPost) => this.setState({addPost})}
                value = {this.state.addPost}
                ></TextInput>

                <TouchableOpacity 
                style = {[styles.addPostBtn, styles.btnToEnd]}
                onPress = {() => this.addPost()}
                ><Text style = {[styles.loginButtonText]}>+ Add Post</Text></TouchableOpacity>
        
            </View>
            </View>

            <View style = {stylesIn.secondSubContainer}>
            <View style = {stylesIn.friendPosts}>
                <Text style = {stylesIn.friendProfileHeaderText}>{this.state.first_name}'s Wall:</Text>
                
                <FlatList 
                    data={this.state.userPostList}

                    renderItem={({item}) => (
                        <View style = {styles.postBox}>
                            <View style = {styles.inPostContainer}>
                                <View style = {styles.inPostImage}>
                                    <ProfileImage
                                        userId = {item.author.user_id}
                                        isEditable = {false}
                                        width = {50}
                                        height = {50}
                                        navigation={this.props.navigation}
                                    ></ProfileImage>
                                </View>
                                <View style = {styles.inPostHeader}>
                                    <Text style = {styles.postNameText}>{item.author.first_name} {item.author.last_name}</Text>    
                                    <Text style = {styles.postInfoText}
                                    onPress = {() => {this.props.navigation.navigate("SinglePost", {post_id: item.post_id, userId: this.props.route.params.friendId})}}
                                    >Post id: {item.post_id} | {item.timestamp} </Text>
                                </View> 
                                </View> 

                                <TextInput
                                    style = {styles.postMainText}
                                    placeholder ={item.text}
                                    editable = {this.state.editable}
                                    onChangeText={(new_text_post) => this.new_text_post = new_text_post}
                                ></TextInput>   
                                <Text style ={styles.postInfoText}>  Likes: {item.numLikes} {'\n'}  </Text> 
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
                                style = {[styles.addPostBtn,styles.actionBtnGreen]}
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
                                style = {[styles.addPostBtn,styles.actionBtnBlue]}
                                ><Text style = {styles.actionBtnLight}>Unlike</Text></TouchableOpacity>
                             
                        </View>
                    )}
                    keyExtractor={(item) => item.post_id.toString()}
                />
            </View>
            </View>
            </View>
        </ScrollView>
        )
        }
    }
 }

 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: "#fdf6e4",
    },

    subMainContainer:{
        flex: 1,
    },

    firstSubContainer:{
        flex:2,
    },

    secondSubContainer:{
        flex: 3,
    },

    homeLogo: {
        flex: 1.5,
    },

    friendDetails: {
        flex: 1.5,
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
        justifyContent: 'center',
        paddingLeft: 10,
    },

    backToTab:{
        flex: 1,
        justifyContent: 'space-around',
        padding:10,
    },

    seeFriendBtnContainer:{
        flex: 1,   
        padding:10,
    },

    seeFriendBtn:{
        borderWidth: 2,
        borderRadius: 5,
        width: '80%',
        height:'50%',
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
        flex: 3,
    },

    postInput:{
        borderWidth: 3,
        borderColor: '#ffc9a9',
        borderRadius: 3,
        padding: 30,
        fontSize: 15,
    },

})

export default FriendProfile ;


