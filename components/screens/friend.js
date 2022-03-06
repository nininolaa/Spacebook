import React, {Component} from 'react';
import { Searchbar } from 'react-native-paper';
import { View,Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeLogo from '../modules/homeLogo';
import IsLoading from '../modules/isLoading';
import styles from "../modules/stylesheet";
import FriendList from '../modules/friendList';

 class FriendScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            friendId: '',
            friendRequestList: [],
            userFriendList: [],
            isLoading: false,
            user_id: '',
            alertMessage: '',
            searchQuery: ''
        }
    }

    async componentDidMount(){
        
        let userId = await AsyncStorage.getItem('user_id');
        // this.setState({user_id: userId})

        this.focusListener = this.props.navigation.addListener('focus', async () => {
            this.setState({user_id: userId})
        })
    }
    

    onSearchPress(){
        this.props.navigation.navigate("SearchResult",{query:this.state.searchQuery, friends:this.state.userFriendList})
    }

    render(){
        
        if(this.state.isLoading == true) {
            return(
                <IsLoading></IsLoading>
              );
        }
        else{
        return(
        
        <View style = {stylesIn.flexContainer}>
             
            <View style = {stylesIn.homeLogo}>
                <HomeLogo></HomeLogo>
            </View>

            <View style = {stylesIn.friendSearch}>
                <Searchbar 
                placeholder="Find friends"
                onChangeText = {(query) => {this.setState({searchQuery: query})}}
                onIconPress={() => {this.onSearchPress()}}
                ></Searchbar>
            </View>

            <View style = {stylesIn.friendBtnContainer}>
                <View style = {stylesIn.friendRequestBtn}>
                    <TouchableOpacity 
                    style = {[styles.friendsBtn, styles.actionBtnOrange]}
                    onPress={() => {(this.props.navigation.navigate("FriendRequest"))}}
                    ><Text style = {[styles.actionBtnLight]}>See friend requests</Text>
                    </TouchableOpacity>
                </View>
            </View>
            

            <View style = {stylesIn.friendList}>
                <Text style = {styles.errorMessage}>{this.state.alertMessage}</Text>
                <FriendList
                    userId={this.state.user_id}
                    navigation={this.props.navigation}
                ></FriendList>
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

    homeLogo: {
        flex: 0.8,
    },

    friendSearch: {
        flex: 0.5,
        paddingHorizontal: 20,
    },

    friendBtnContainer:{
        flex: 0.5,
        flexDirection:'flex-end',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    allFriendBtn:{
        flex: 1,
        backgroundColor: 'pink'
    },
    friendRequestBtn:{
        flex: 1,
    },
    friendList:{
        flex: 2,
        paddingHorizontal: 20,
    },
 })

 export default FriendScreen;


