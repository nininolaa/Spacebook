import React, {Component} from 'react';
import { View,Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from './modules/logo';
import LoadProfileFunction from './loadProfileFunction';

 class ProfileScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            email: '',
            first_name: '',
            last_name: '',
            friend_count: '',
            user_id: '',
        }
    }
    //check to see if user if logged in, if not redirect the user to login

    componentDidMount() {
        this.loadProfile();
    }

    async loadProfile() {
        
        const userId = await AsyncStorage.getItem('user_id');
        const token = await AsyncStorage.getItem('@session_token');

        return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
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
                throw 'Invalid email or password';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(profile => {
            this.setState(profile)
        }) 
    }


    render(){
        return(
    
        <View style = {stylesIn.flexContainer}>

            <View style = {stylesIn.homeLogo}>
            <Logo></Logo>
            </View>

            <View style = {stylesIn.profilePicture}>
                <Text>Profile Screen</Text>
            </View>

            <View style = {stylesIn.userInfo}>

                <Text>{this.state.first_name}</Text>
                <Text>{this.state.last_name}</Text>
                <Text>{this.state.email}</Text>
                <Text>{this.state.friend_count}</Text>
            </View>

            <View styles = {stylesIn.userPost}>
                
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

    profilePicture: {
        flex: 5,
    },

    userInfo: {
        flex: 30,
    },

    userPost: {
        flex: 10,
    }
 
 })

 export default ProfileScreen;


