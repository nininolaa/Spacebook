import React, {Component} from 'react';
import { View,Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeLogo from './modules/homeLogo';
import IsLoading from "./modules/isLoading";

 class ProfileScreen extends Component {

    constructor(props){
        super(props);

        this.state = {

            user_id: '',
            first_name: '',
            last_name: '',
            friend_count: '',
            email: '',
            isLoading: true,
            userProfile: []
        }
    }
    //check to see if user if logged in, if not redirect the user to login

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', async () => {
            this.loadProfile();
     })
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


    render(){

        if(this.state.isLoading == true){
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

                <View style = {stylesIn.profilePicture}>
                    
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
  
        )}
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


