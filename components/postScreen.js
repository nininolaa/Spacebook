import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import { View,Text, StyleSheet, Button, TextInput, FlatList, ScrollView, CardSection} from 'react-native';
import HomeLogo from './modules/homeLogo';

class PostScreen extends Component {

    constructor(props){
        super(props);

        deletePostId: '',

        this.state = {
            addPost: '',
           
            userPostList: [],
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
                    return response.json()
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
        })
        .catch((error) => {
            console.log(error);
        })
    }

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
            this.setState({userPostList: responseJson})
        }) 
    }

    deletePost = async() => {
        let token = await AsyncStorage.getItem('@session_token')
        let userId = await AsyncStorage.getItem('user_id')

        return fetch("http://localhost:3333/api/1.0.0/user/"+ userId + "/post/" + this.deletePostId, {
            method: 'delete',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },  
        })
        // .then((response) => {
        //     this.deletePost();
        //   })
        .then((response) => {
            console.log("Post deleted ");
          })
        .catch((error) => {
        console.log(error);
        })
    }
    

    render(){
        return(
        
        <ScrollView style = {stylesIn.flexContainer}>

            <View style = {stylesIn.homeLogo}>
            <HomeLogo></HomeLogo>
            </View>

            <View style = {stylesIn.friendSearch}>
                <TextInput
                placeholder="Post ID to delete"
                onChangeText={(deletePostId) => this.deletePostId = deletePostId}
                // value = {this.state.deletePostId}
                ></TextInput>
                <Button 
                title="Delete"
                color= 'red'
                onPress = {() => this.deletePost()}
                ></Button>
            </View>

            <View style = {stylesIn.postFeed}>
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

            <View styles = {stylesIn.mainMenu}>
            <Text>Show user's posts here:{'\n'}  </Text>

            <FlatList styles = {stylesIn.mainMenu}
                data={this.state.userPostList}

                renderItem={({item}) => (
                    <View>
                        <Text> User name: {item.author.first_name} {item.author.last_name}</Text>    
                        <Text> Post id: {item.post_id} </Text>  
                        <Text> {item.text} </Text>    
                        <Text> Likes: {item.numLikes} {'\n'}  </Text>    
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
        backgroundColor: 'pink',
    },

    postFeed: {
        flex: 30,
        backgroundColor: 'lightgreen'
    },

    mainMenu: {
        flex: 10,
        backgroundColor: 'blue'
    }
 
 })

 export default PostScreen;


