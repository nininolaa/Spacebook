import React, {Component} from 'react';
import { View,Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Button, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {likePost, unlikePost} from '../libs/postFunctions'
import HomeLogo from './modules/homeLogo';
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
            addPost: '',
            isLoading: true,
        }
    }

    async componentDidMount(){
        this.token = await AsyncStorage.getItem('@session_token');
        //this.userPost();
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
        
        <ScrollView style = {stylesIn.flexContainer}>

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
        </ScrollView>
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
        flex: 60,
    }
 
 })

 export default FriendProfile ;


