import React, {Component} from 'react';
import { View, TextInput,Button,TouchableOpacity,Text, StyleSheet,Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from './modules/logo';
import styles from "./modules/stylesheet";

 class SettingScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            token: null
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('@session_token')
        .then (session => {
          console.log(session)
          if (session) {
            this.setState({token: !null});
          }
        });
      }


    logout = async () => {

        if (null !== this.state.token){
            
        let token = await AsyncStorage.getItem('@session_token');

        await AsyncStorage.removeItem('@session_token');

        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
       
        .then((response) => {
            if(response.status === 200){ 
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

    else {
        console.log('You are not logged in?')
    }

    }

    render(){
        return(
    
        <View style = {stylesIn.flexContainer}>

            <View style = {stylesIn.homeLogo}>
                <Image source={require('../assets/img/logo.png')} ></Image> 
                <Image source={require('../assets/img/Heading.png')}></Image>
            </View>

            <View style = {stylesIn.friendSearch}>

            </View>

            <View style = {stylesIn.postFeed}>
                <Text>Setting Screen</Text>

                <TouchableOpacity
                onPress={() => {this.logout()}}>
                 <Text> Sign Out</Text>
                </TouchableOpacity>

            </View>

            <View styles = {stylesIn.mainMenu}>

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
        backgroundColor: 'blue',
    },

    logoImg: {
        width: 100,
        height: 100
    },

    friendSearch: {
        flex: 5,
        backgroundColor: 'green',
    },

    postFeed: {
        flex: 30,
        backgroundColor: 'orange',
    },

    mainMenu: {
        flex: 10,
        backgroundColor: 'blue',
    }
 
 })

 export default SettingScreen;


