import React, {Component} from 'react';
import { View, TextInput,Button,Alert,Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from './modules/logo';
import styles from "./modules/stylesheet";

 class ProfileScreen extends Component {

    constructor(props){
        super(props);
    }

  

    render(){
        return(
    
        <View style = {stylesIn.flexContainer}>

            <View style = {stylesIn.homeLogo}>
            <Logo></Logo>
            </View>

            <View style = {stylesIn.friendSearch}>

            </View>

            <View style = {stylesIn.postFeed}>
                <Text>Profile Screen</Text>
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

 export default ProfileScreen;


