import React, {Component} from 'react';
import { View,Text, StyleSheet, Button, TextInput, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeLogo from './modules/homeLogo';

 class SinglePost extends Component {

    constructor(props){
        super(props);

        this.state = {
            user_id: '',
            first_name: '',
            last_name: '',
            email: '',
            friend_count: '',
            post_text: '',
            userPostList: [],
        }
    }

    componentDidMount(){
      // this.loadFriend();
       this.userPosts();
    }

    // async loadFriend (){

    //     let token = await AsyncStorage.getItem('@session_token');

    //     return fetch("http://localhost:3333/api/1.0.0/user/" + this.props.route.params.friendId, {
    //         method: 'get',
    //         headers: {
    //             "X-Authorization": token,
    //             'Content-Type': 'application/json'
    //         },
    //     })
    //     .then((response) => {
    //         if(response.status === 200){
    //             return response.json()
    //         }else if(response.status === 400){
    //             throw 'User id not found';
    //         }else{
    //             throw 'Something went wrong';
    //         }
    //     })
    //     .then(responseJson => {
    //         this.setState({
    //             profile: responseJson,
    //             first_name: responseJson.first_name,
    //             last_name: responseJson.last_name,
    //             user_id: responseJson.user_id,
    //             email: responseJson.email,
    //             friend_count: responseJson.friend_count,
    //         })
    //     }) 
    // }

    userPosts = async() => {
        let token = await AsyncStorage.getItem('@session_token')
        let userId = await AsyncStorage.getItem('user_id')

        return fetch("http://localhost:3333/api/1.0.0/user/"+ userId + "/post/" +this.props.route.params.post_id , {
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
            }
            else{
                throw 'Something went wrong';
            }
        })
        .then(responseJson => {
            this.setState({
                userPostList: responseJson,
                first_name: responseJson.author.first_name,
                post_text: responseJson.text,

            })
        }) 
    }


    render(){
 
        return(
        
        <View style = {stylesIn.flexContainer}>
            <Text>Single post</Text>
            {/* <View style = {stylesIn.homeLogo}>
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
            </View> */}

            <View styles = {stylesIn.mainMenu}>
                <View>
                    <Text> {this.state.first_name} </Text>  
                    <Text> {this.state.post_text}</Text>  
                    {/* <Text> Post id: {post_id} </Text>  
                    <TextInput
                    placeholder = {text}
                    editable = {this.state.editable}
                    onChangeText={(new_text_post) => this.new_text_post = new_text_post}
                    ></TextInput>   
                    <Text> Likes: {numLikes} {'\n'}  </Text>  */}
                </View>
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

 export default SinglePost ;


