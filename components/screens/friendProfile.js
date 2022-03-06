import React, {Component} from 'react';
import { View,Text, StyleSheet, TextInput, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {likePost, unlikePost} from '../../libs/postFunctions';
import ValidationComponent from 'react-native-form-validator';
import HomeLogo from '../modules/homeLogo';
import styles from "../modules/stylesheet";
import IsLoading from "../modules/isLoading";
import ProfileImage from '../modules/profileImage';
import FriendHeading from '../modules/friendHeading';


class FriendProfile extends ValidationComponent {

    constructor(props){
        super(props);

        this.state = {
            token: '',
            user_id: '',
            first_name: '',
            last_name: '',
            email: '',
            new_text_post: '',
            friend_count: '',
            userPostList: [],
            addPost: '',
            isLoading: true,
            alertMessage: '',
            friendId: this.props.route.params.friendId 
        }
    }

    async componentDidMount(){
        this.state.user_id = await AsyncStorage.getItem('user_id')
        this.state.token = await AsyncStorage.getItem('@session_token');
        this.userPosts();
      
    }


    addPost = async() => {

        this.validate({
            addPost: {required: true},
        })

        if (this.isFormValid() == true){

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
    }

    userPosts = () => {

        return fetch("http://localhost:3333/api/1.0.0/user/"+ this.state.friendId + "/post", {
            method: 'get',
            headers: {
                "X-Authorization": this.state.token,
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
                    this.props.navigation.navigate("NonFriendScreen", {friendId: this.state.friendId})
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

    //update a post 
    updatePost = async(post_id, text) => {
        
        this.validate({
            new_text_post: {required: true},
        })

        if (this.isFormValid() == true){

            let new_info = {};

            if (this.state.new_text_post != text && this.state.new_text_post != '' ){
                new_info['text'] = this.state.new_text_post;
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
        })
        .catch((error) => {
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
    
    editPost() {
        this.setState({editable: true}) ;
    }
    isEditMode() {
        return this.state.editable;
    }
    isUserPost(){
        return this.state.user_id
    }

    reLoadProfile(new_id){
        this.setState({
            friendId: new_id
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
                        <Text style = {stylesIn.seeFriendBtnText}>See all friends</Text>
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
                    {this.isFieldInError('addPost') && this.getErrorsInField('addPost').map(errorMessage => 
                    <Text key={errorMessage} style={styles.loginErrorText}>Write something before you post</Text>
                    )}

                    <TouchableOpacity 
                    style = {[styles.addPostBtn, styles.btnToEnd]}
                    onPress = {() => this.addPost()}
                    ><Text style = {[styles.loginButtonText]}>+ Add Post</Text></TouchableOpacity>
                    
                </View>
            </View>

            <View style = {stylesIn.secondSubContainer}>
                <View style = {stylesIn.friendPosts}>
                <Text style = {stylesIn.friendProfileHeaderText}>Feed:</Text>
                
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
                                    style = {styles.postNameText}
                                    onPress = {() => {
                                        this.setState({friendId: item.author.user_id})
                                        // this.userPosts();
                                        this.componentDidMount();
                                    }
                                    }
                                    // onPress = {this.reLoadProfile(item.author.user_id)}
                                    >{item.author.first_name} {item.author.last_name}</Text>    
                                    <Text style = {styles.postInfoText}>Post id: {item.post_id} | {item.timestamp} </Text>
                                </View> 
                            </View> 
                        
                                <TextInput
                                    style = {styles.postMainText}
                                    placeholder ={item.text}
                                    editable = {this.state.editable}
                                    onChangeText={(new_text_post) => this.setState({new_text_post: new_text_post})}
                                ></TextInput> 
                                <Text> Likes: {item.numLikes} {'\n'}  </Text> 
                        
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
                                    {this.isFieldInError('new_text_post') && this.getErrorsInField('new_text_post').map(errorMessage => 
                                    <Text key={errorMessage} style={styles.loginErrorText}>Please add some text to update this post</Text>
                                    )}
                                </View> 

                                <View style = {[stylesIn.editBtnContainer, this.isUserPost() !=  item.author.user_id ? styles.showEdit : styles.hideEdit ]}>

                                    
                                    <View style = {styles.btnContainer1}>
                                        <TouchableOpacity
                                            onPress = {
                                                () => likePost(this.state.token, item.author.user_id , item.post_id) 
                                                .then(() => {
                                                    this.userPosts();  
                                                }) 
                                                .catch(() => {
                                                })
                                            }
                                            style = {[styles.actionBtn, styles.actionBtnBlue]}
                                        ><Text style = {styles.actionBtnLight}>Like</Text></TouchableOpacity>
                                        
                                    </View>

                                    <View style = {styles.btnContainer2}>
                                        <TouchableOpacity
                                            onPress = {
                                            () => unlikePost(this.state.token, item.author.user_id , item.post_id, this.state.alertMessage) 
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

                            </View> 
                        </View>
                    )}
                    keyExtractor={(item) => item.post_id.toString()}
                />
                </View>
            </View>
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

    subMainContainer:{
        flex: 1,
    },

    firstSubContainer:{
        flex:2,
    },

    secondSubContainer:{
        flex: 1.5,
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
        // padding:10,
    },

    seeFriendBtnContainer:{
        flex: 1, 
        justifyContent: 'space-around',  
        // padding:10,
    },

    editBtnContainer:{
        flex: 1,
        flexDirection: 'row',
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


