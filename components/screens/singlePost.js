import React, {Component} from 'react';
import { View,Text, StyleSheet, Button, TextInput, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeLogo from '../modules/homeLogo';

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

    userPosts = async() => {
        let token = await AsyncStorage.getItem('@session_token')
        let userId = await AsyncStorage.getItem('user_id')

        return fetch("http://localhost:3333/api/1.0.0/user/"+ this.props.route.params.userId + "/post/" +this.props.route.params.post_id , {
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
                case 403:
                    throw 'Can only view the post of yourself or your friends'
                case 404:
                    throw 'Not found'
                case 500:
                    throw 'Server Error'
                default:
                    throw 'Something went wrong'
                    break
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


