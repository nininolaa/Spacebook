import React, {Component} from 'react';
import { View,Text, StyleSheet, Button, TextInput, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FriendList from '../modules/friendList';
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
            userId: this.props.route.params.userId
        }
    }

    render(){
 
        return(
        
        <View style = {stylesIn.flexContainer}>
            <View style = {stylesIn.homeLogo}>
                <HomeLogo></HomeLogo>
            </View>
         
            <View style = {stylesIn.mainMenu}>
       
                <FriendList
                    userId={this.state.userId}
                    navigation={this.props.navigation}
                ></FriendList>
         
            </View>
        </View>
        )
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


    mainMenu: {
        flex: 3,
    }
 
 })

 export default SinglePost ;


