import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import { Alert } from 'react-native';
import { View,Text, StyleSheet, Button, TextInput, FlatList, ScrollView} from 'react-native';
import HomeLogo from './modules/homeLogo';

class PostScreen extends Component {

    constructor(props){
        super(props);

        this.new_text_post = '',
        this.postId = ''

        this.state = {
            addPost: '',
            textPost: '',
            userPostList: [],
            editable: false,
            text: '',
        }
    }

    componentDidMount(){
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
                userPostList: responseJson,
            })
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
            console.log("Info updated");
          })
          .catch((error) => {
            console.log(error);
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
            console.log("Post deleted ");
            this.userPosts();
          })
        .catch((error) => {
        console.log(error);
        })
    }

    //edit button press
    editPost() {
        this.setState({editable: true}) ;
    }
    
    singlePost() {
        this.props.navigation.navigate("SinglePost", {post_id: this.postId})
    }
    

    render(){
        return(
        
        <ScrollView style = {stylesIn.flexContainer}>

            <View style = {stylesIn.homeLogo}>
            <HomeLogo></HomeLogo>
            </View>

            <View style = {stylesIn.friendSearch}>
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

            <View style = {stylesIn.postFeed}>
                <Text> Find a post</Text>
                <TextInput
                placeholder="Enter your post id here"
                onChangeText={(postId) => this.postId = postId }
                ></TextInput>
                <Button
                title="Find a post"
                onPress={() => this.singlePost()}
                ></Button>
            </View>

            <View styles = {stylesIn.mainMenu}>
            <Text>Show user's posts here:{'\n'}  </Text>

            <FlatList styles = {stylesIn.mainMenu}
                data={this.state.userPostList}

                renderItem={({item}) => (
                    <View>
                        <Text> User name: {item.author.first_name} {item.author.last_name}</Text>    
                        <Text> Post id: {item.post_id} </Text>  
                        <TextInput
                        placeholder = {item.text}
                        editable = {this.state.editable}
                        onChangeText={(new_text_post) => this.new_text_post = new_text_post}
                        ></TextInput>   
                        <Text> Likes: {item.numLikes} {'\n'}  </Text> 
                        <Button
                        title = "Edit post"
                        color = 'orange'
                        onPress = {()=> this.editPost(item.post_id)}
                        ></Button>
                        <Button
                        title = "Update post"
                        color = 'lightgreen'
                        onPress = {()=> this.updatePost(item.post_id, item.text)}
                        ></Button>
                        <Button 
                        title = "Delete post" 
                        color = "#880808"
                        onPress = {() => this.deletePost(item.post_id)}
                       > </Button>   
                    </View>
                )}
                keyExtractor={(item) => item.post_id.toString()}
            />
            </View>
        </ScrollView>
        );   
    }
}


 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
        //marginHorizontal: 20,
    },

    homeLogo: {
        flex: 30,
        backgroundColor: 'blue'
    },

    friendSearch: {
        flex: 30,
       // backgroundColor: 'black',
    },

    postFeed: {
        flex: 30,
      //  backgroundColor: 'black'
    },

    mainMenu: {
        flex: 10,
        backgroundColor: 'blue'
    }
 
 })

 export default PostScreen;


