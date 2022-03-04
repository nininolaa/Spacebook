import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import { View,Text, StyleSheet, Button, TextInput, FlatList, ScrollView, TouchableOpacity} from 'react-native';
import {likePost, unlikePost} from '../../libs/postFunctions'
import HomeLogo from '../modules/homeLogo';
import styles from "../modules/stylesheet";
import IsLoading from "../modules/isLoading";
import ProfileImage from '../modules/profileImage';
import FeedWall from '../modules/feedWall';

class PostScreen extends Component {

    constructor(props){
        super(props);

        this.new_text_post = '',
        this.postId = '',

        this.state = {
            user_id: '',
            addPost: '',
            textPost: '',
            userPostList: [],
            editable: false,
            text: '',
            isLoading: true,
            alertMessage: '',
            token: '',
        }
    }

    async componentDidMount(){

        this.state.user_id = await AsyncStorage.getItem('user_id')
        this.state.token = await AsyncStorage.getItem('@session_token')

        this.focusListener = this.props.navigation.addListener('focus', async () => {
            this.userPosts();
        })
    }

    //add new post
    addPost = async() => {

        let token = await AsyncStorage.getItem('@session_token')
        let userId = await AsyncStorage.getItem('user_id')

        let post = { text: this.state.addPost }

        return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/post", {
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

    //show all user posts
    userPosts = async() => {
        let token = await AsyncStorage.getItem('@session_token')
        let userId = await AsyncStorage.getItem('user_id')

        return fetch("http://localhost:3333/api/1.0.0/user/"+ userId + "/post", {
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
                        isLoading: false,
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

    //update a post 
    updatePost = async(post_id, text) => {
        
        let new_info = {};

        if (this.new_text_post != text && this.new_text_post != '' ){
            new_info['text'] = this.new_text_post;
        }
        
        let token = await AsyncStorage.getItem('@session_token')
        let userId = await AsyncStorage.getItem('user_id')

        return fetch("http://localhost:3333/api/1.0.0/user/"+ userId + "/post/" + post_id, {
            method: 'PATCH',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify(new_info)  
        })
        .then((response) => {
            switch(response.status){
                case 200: 
                    console.log('info updated')
                    break
                case 400:
                    throw {errorCase: "BadRequest"}
                    break
                case 401:
                    throw {errorCase: "Unauthorised"}
                    break
                case 403:
                    throw {errorCase: "ForbiddenUpdatePost"}
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
            console.log("Info updated");
            this.setState({
                editable: false,
                isLoading: false
            });
        })
        .catch((error) => {
        console.log(error);
        switch (error.errorCase){

            case 'BadRequest':    
                this.setState({
                    alertMessage: 'Bad Request',
                    isLoading: false,
                })
                break

            case 'Unauthorised':    
                this.setState({
                    alertMessage: 'Unauthorised, Please login',
                    isLoading: false,
                })
                break
            case 'ForbiddenUpdatePost':    
                this.setState({
                    alertMessage: 'Forbidden - you can only update your own posts',
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


    // Delete post function
    deletePost = async(post_id) => {
        
        let token = await AsyncStorage.getItem('@session_token')
        let userId = await AsyncStorage.getItem('user_id')

        return fetch("http://localhost:3333/api/1.0.0/user/"+ userId + "/post/" + post_id, {
            method: 'delete',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },  
        })
        .then((response) => {
            switch(response.status){
                case 200: 
                    throw 'OK'
                    break
                case 401:
                    throw {errorCase: "Unauthorised"}
                    break
                case 403:
                    throw {errorCase: "ForbiddenDeletePost"}
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
            console.log("Post deleted ");
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
            case 'ForbiddenDeletePost':    
                this.setState({
                    alertMessage: 'Forbidden - you can only delete your own posts',
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

    //edit button press
    editPost() {
        this.setState({editable: true}) ;
    }

    isEditMode() {
        return this.state.editable;
    }

    isUserPost(){
            return this.state.user_id
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
            <Text style = {styles.errorMessage}>{this.state.alertMessage}</Text>
            <View style={stylesIn.homeLogo}>
                <HomeLogo></HomeLogo>
            </View>

            <View style = {stylesIn.sharePost}>
                <Text style = {styles.postHeaderText}>Share a post:</Text>
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

            <View style = {stylesIn.mainPostFeed}>
                {/* <FeedWall
                    userId  = {this.state.user_id}
                    navigation={this.props.navigation}
                ></FeedWall> */}
                
                <Text style={styles.postHeaderText}>Your Posts:</Text>
                <View styles = {stylesIn.postBox}>
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
                                    <Text 
                                    onPress = {() => {this.props.navigation.navigate("SinglePost", {post_id: item.post_id, userId: this.user_id})}} 
                                    style = {styles.postNameText}>{item.author.first_name} {item.author.last_name}</Text>    
                                    <Text style = {styles.postInfoText}>Post id: {item.post_id} | {item.timestamp} </Text>
                                    
                                </View>     
                                
                            </View> 
                                <TextInput
                                style = {styles.postMainText}
                                placeholder ={item.text}
                                editable = {this.state.editable}
                                onChangeText={(new_text_post) => this.new_text_post = new_text_post}
                                ></TextInput>   
                                <Text style ={styles.postInfoText}>  Likes: {item.numLikes} {'\n'}  </Text> 
                                
                            <View style = {[stylesIn.editBtnContainer, this.isUserPost() ==  item.author.user_id ? styles.showEdit : styles.hideEdit ]}>

                                <View style = {[styles.btnContainer1]}>
                                    <TouchableOpacity
                                    onPress = {()=> this.editPost(item.post_id)}
                                    style = {[styles.actionBtn, styles.actionBtnGreen, !this.isEditMode() ? styles.showEdit : styles.hideEdit]}
                                    ><Text style = {[styles.actionBtnLight]}>Edit</Text></TouchableOpacity>
                                    <TouchableOpacity
                                    onPress = {()=> this.updatePost(item.post_id, item.text)}
                                    style = {[styles.actionBtn, styles.actionBtnBlue, this.isEditMode() ? styles.showEdit : styles.hideEdit]}
                                    ><Text style = {[styles.actionBtnLight]}>Update Post</Text></TouchableOpacity>
                                </View>

                                <View style = {[styles.btnContainer2]}>
                                    <TouchableOpacity 
                                    style = {[styles.actionBtn,styles.actionBtnRed]}
                                    onPress = {() => this.deletePost(item.post_id)}
                                    ><Text style = {styles.actionBtnLight}>Delete post</Text></TouchableOpacity>  
                                </View>
                            </View> 
                            {/* <View style = {stylesIn.editBtnContainer, this.isUserPost() !=  item.author.user_id ? styles.showEdit : styles.hideEdit }>

                                <View style = {styles.btnContainer1}>
                                    <TouchableOpacity
                                        onPress = {
                                            () => likePost(this.state.token, item.author.user_id , item.post_id) 
                                            .then(() => {
                                                this.userPosts();  
                                            }) 
                                            .catch(() => {
                                                console.log('Error')
                                            })
                                        }
                                        style = {[styles.actionBtn, styles.actionBtnBlue]}
                                    ><Text style = {styles.actionBtnLight}>Like</Text></TouchableOpacity>
                                </View>

                                <View style = {styles.btnContainer2}>
                                <TouchableOpacity
                                    onPress = {
                                    () => unlikePost(this.state.token, item.author.user_id , item.post_id) 
                                    .then(() => {
                                        this.userPosts();  
                                    }) 
                                    .catch(() => {
                                        console.log('Error')
                                    })
                                    }   
                                    style = {[styles.actionBtn,styles.actionBtnGrey]}
                                ><Text style = {styles.actionBtnLight}>Unlike</Text></TouchableOpacity> 
                                </View>
                            </View>  */}
                        </View>
                        
                    )}
                    keyExtractor={(item) => item.post_id.toString()}
                    /> 
                    </View>
            </View>
        </ScrollView>
        )};   
    }
}


 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: "#fdf6e4",
    },

    homeLogo: {
        flex: 1,
    },

    sharePost: {
        flex: 1.1,
        paddingHorizontal: 20,
    },

    findUserPost:{
        flex: 0.8,
        paddingHorizontal: 20,
    },

    editBtnContainer:{
        flex: 1,
        flexDirection: 'column',
    },

    mainPostFeed:{
        flex: 5,
        paddingHorizontal: 20,
    },

    editText: {
        color: '#ffffff' , 
        textTransform: 'uppercase', 
        fontWeight: 'bold'
    },

    postInput:{
        borderWidth: 3,
        borderColor: '#ffc9a9',
        borderRadius: 3,
        padding: 40,
        fontSize: 15,
    },

    sharePostBtn:{
        backgroundColor: "#f9943b",
    },

 })

 export default PostScreen;


