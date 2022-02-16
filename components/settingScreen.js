import React, {Component} from 'react';
import { View, TextInput,Button,TouchableOpacity,Text, StyleSheet,Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from './modules/logo';
import styles from "./modules/stylesheet";

 class SettingScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            first_name: '',
            last_name: '',
            email: '' ,
            password: '',
            new_first_name: ''
        }

    }

    componentDidMount() {
        this.loadProfile();
    }

    loadProfile = async() => {
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


    logout = async () => {
            
        let token = await AsyncStorage.getItem('@session_token');
    
        await AsyncStorage.removeItem('@session_token');
        await AsyncStorage.removeItem('user_id');

        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })  
        .then((response) => {
            if(response.status === 200){ 
                console.log('checked')
                this.props.navigation.navigate("Home");
            }else if(response.status === 401){
                this.props.navigation.navigate("Home");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error.message);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })

    }

    editText = () => {
        this.setState({
            first_name: ''
        })
    }


    render(){
        return(
    
        <View style = {stylesIn.flexContainer}>

            <View style = {stylesIn.homeLogo}>
                <Image source={require('../assets/img/logo.png')} ></Image> 
                <Image source={require('../assets/img/Heading.png')}></Image>
            </View>

            <View style = {stylesIn.userProfile}>

            </View>

            <View style = {stylesIn.userDetails}>
                <Text>{this.state.first_name}</Text> <Button title="edit firstName"></Button>
                <TextInput value = {this.state.first_name} />
                <Text>{this.state.last_name}</Text>
                <Text>{this.state.email}</Text>
                <Text>{this.state.friend_count}</Text>
            </View>

            <View style = {stylesIn.signOut}>
                <TouchableOpacity
                onPress={() => {this.logout()}}>
                 <Text>Sign Out</Text>
                </TouchableOpacity>
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

    logoImg: {
        width: 100,
        height: 100
    },

    userProfile: {
        flex: 20,
    },

    userDetails: {
        flex: 30,
    },

    signOut: {
        flex: 10,
    }

})

 export default SettingScreen;


