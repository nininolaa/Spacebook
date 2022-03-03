import React, {Component} from 'react';
import { View,Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput, Button, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeLogo from '../modules/homeLogo';
import IsLoading from "../modules/isLoading";
import styles from "../modules/stylesheet";
import ProfileImage from '../modules/profileImage';

 class ProfileScreen extends Component {

    constructor(props){
        super(props);

        this.user_id = ''
        this.token = ''

        this.state = {
            user_id: '',
            first_name: '',
            last_name: '',
            friend_count: '',
            email: '',
            isLoading: true,
            userProfile: [],
            userPostList: [],
            alertMessage: '',
        }
    }

    async componentDidMount() {
        this.user_id = await AsyncStorage.getItem('user_id');
        
        this.focusListener = this.props.navigation.addListener('focus', async () => {
            this.loadProfile();
            this.userPosts();
        })
    }

    loadProfile = async() => {

        let user_id = await AsyncStorage.getItem('user_id');
        let token = await AsyncStorage.getItem('@session_token');

        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
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
        .then(response => {
            this.setState({
                userProfile: response,
                user_id: response.user_id,
                first_name: response.first_name,
                last_name: response.last_name,
                friend_count: response.friend_count,
                email: response.email,
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

    userPosts = async() => {

        let user_id = await AsyncStorage.getItem('user_id');
        let token = await AsyncStorage.getItem('@session_token');

        return fetch("http://localhost:3333/api/1.0.0/user/"+ user_id + "/post", {
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
                        isLoading: false
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


    render(){

        if(this.state.isLoading == true){
            return(
                <IsLoading></IsLoading>
              );
        }
        else{
            return(

            <ScrollView style = {stylesIn.flexContainer}>

                <Text>{this.state.alertMessage}</Text>

                <View style = {stylesIn.subMainContainer}>
                <View style = {stylesIn.firstSubContainer}>
                    <View style = {stylesIn.homeLogo}>
                    <HomeLogo></HomeLogo>
                    </View>

                    <View style = {stylesIn.profilePicture}>
                        <ProfileImage
                        userId = {this.user_id}
                        isEditable = {true}
                        width = {150}
                        height = {150}
                        navigation={this.props.navigation}
                        ></ProfileImage>
                    </View>

                    <View style = {stylesIn.userInfo}>
                        <Text style = {styles.profileText}> ID:{this.state.user_id}  |  {this.state.first_name} {this.state.last_name} </Text>
                        <Text style = {styles.profileMiniText}> {this.state.email}</Text>
                        <Text style = {styles.profileMiniText}> Total friend: {this.state.friend_count} {'\n'} </Text>

                        <TouchableOpacity
                        onPress = {() => {this.props.navigation.navigate("Setting")}}
                        style = {styles.navigateBtn}
                        ><Text style = {styles.navigateBtnText}>Edit information</Text>
                        </TouchableOpacity>

                    </View>
                </View>

                <View style = {stylesIn.secondSubContainer}>
                <View style = {stylesIn.userPost}>
                    <Text style={styles.postHeaderText}>Your Feed:</Text>

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
                                <View 
                                style = {styles.inPostHeader}>
                                <Text style = {styles.postNameText}>{item.author.first_name} {item.author.last_name}</Text>    
                                <Text style = {styles.postInfoText}
                                onPress = {() => {this.props.navigation.navigate("SinglePost", {post_id: item.post_id, userId: this.user_id})}}
                                >Post id: {item.post_id} | {item.timestamp} </Text>
                                </View> 
                            </View> 
                            <TextInput
                            style = {styles.postMainText}
                            value ={item.text}
                            editable = {this.state.editable}
                            onChangeText={(new_text_post) => this.new_text_post = new_text_post}
                            ></TextInput>   
                            <Text style ={styles.postInfoText}>  Likes: {item.numLikes} {'\n'}  </Text> 

                            
                            {/* <TouchableOpacity
                            onPress = {()=> this.editPost(item.post_id)}
                            style = {[styles.actionBtn, styles.actionBtnBlue, !this.isEditMode() ? stylesIn.showEdit : stylesIn.hideEdit]}
                            ><Text style = {[styles.actionBtnLight]}>Edit</Text></TouchableOpacity>
                            <TouchableOpacity
                            onPress = {()=> this.updatePost(item.post_id, item.text)}
                            style = {[styles.actionBtn , styles.actionBtnGreen, this.isEditMode() ? stylesIn.showEdit : stylesIn.hideEdit]}
                            ><Text style = {[styles.actionBtnLight]}>Update Post</Text></TouchableOpacity> */}
                            
                            {/* <Button 
                            title = "Delete post" 
                            color = "#880808"
                            onPress = {() => this.deletePost(item.post_id)}
                        > </Button>    */}
                        </View>
                    )}
                    keyExtractor={(item) => item.post_id.toString()}
                    />

                    </View>
                    </View>
                </View>
            </ScrollView>
  
        )}
    }
 }

const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: "#fdf6e4",
    },

    subMainContainer:{
        flex:1
    },

    firstSubContainer:{
        flex:1,
        //backgroundColor:'blue'
    },

    secondSubContainer:{
        flex: 1,
        //backgroundColor:'green'
    },

    homeLogo: {
        flex: 1,
    },

    profilePicture: {
        flex: 1,
        alignItems: 'center',
    },

    userInfo: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },

    userPost: {
        flex: 9,
    },

    postHeaderText:{
        border: 5,
        borderColor: 'black',
        fontSize: 25,
        paddingBottom: 10,
        fontWeight: 'bold',
    }

 })

 export default ProfileScreen;


