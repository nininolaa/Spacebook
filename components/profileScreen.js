import React, {Component} from 'react';
import { View,Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput, Button, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeLogo from './modules/homeLogo';
import IsLoading from "./modules/isLoading";
import styles from "./modules/stylesheet";
import ProfileImage from './modules/profileImage';

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
        }
    }
    //check to see if user if logged in, if not redirect the user to login

    async componentDidMount() {

        this.user_id = await AsyncStorage.getItem('user_id');
        this.token = await AsyncStorage.getItem('@session_token');

        this.focusListener = this.props.navigation.addListener('focus', async () => {
            this.loadProfile();
            this.userPosts();
        })
    }

    loadProfile() {

        return fetch("http://localhost:3333/api/1.0.0/user/" + this.user_id, {
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
                throw 'Invalid email or password';
            }else{
                throw 'Something went wrong';
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
    }

    navigateSetting(){
        this.props.navigation.navigate("Setting")
    }

    userPosts() {

        return fetch("http://localhost:3333/api/1.0.0/user/"+ this.user_id + "/post", {
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
                userPostList: responseJson,
                isLoading: false
            })
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
                    onPress = {() => {this.navigateSetting()}}
                    style = {styles.navigateBtn}
                    ><Text style = {styles.navigateBtnText}>Edit information</Text>
                    </TouchableOpacity>

                </View>

                <View style = {stylesIn.userPost}>
                    <Text style={styles.postHeaderText}>Your Feed:</Text>
                    {/* <View styles = {stylesIn.postBox}> */}
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
                                <Text style = {styles.postInfoText}>Post id: {item.post_id} | {item.timestamp} </Text>
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
                {/* </View> */}
                </View>

            </ScrollView>
  
        )}
    }
 }

 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
        // flexDirection: 'column',
        backgroundColor: "#fdf6e4",
    },

    homeLogo: {
        flex: 1,
    },

    profilePicture: {
        // flex: 1,
        alignItems: 'center',
    },

    userInfo: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },

    userPost: {
        flex: 5,
        //backgroundColor: 'pink'
    },

    // postBox:{
    //     border: 20,
    //     borderColor: 'black',
    //     backgroundColor: '#feddc9',
    //     marginBottom: 10,
    //     padding: 5,
    // },

    // postNameText:{
    //     fontSize: 15,
    //     fontWeight: 'bold',
    //     color: "#391500"
    // },

    // postInfoText:{
    //     fontSize: 11,
    //     color: 'grey'
    // },

    // inPostContainer:{
    //     flex: 1,
    //     flexDirection: 'row',
    //     padding: 10,
    // },

    // inPostImage:{
    //     flex: 1,
    // },

    // inPostHeader:{
    //     flex: 4,
    // },

    // postMainText:{
    //     fontSize: 20,
    //     padding:5,
    // },

    postHeaderText:{
        border: 5,
        borderColor: 'black',
        fontSize: 25,
        paddingBottom: 10,
        fontWeight: 'bold',
    }

 
 })

 export default ProfileScreen;


