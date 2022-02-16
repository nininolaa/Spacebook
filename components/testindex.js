import React, {Component} from 'react';
import { View, Text, StyleSheet, Button ,Image, ImageBackground, TouchableOpacity} from 'react-native';
import Logo from './modules/logo';
import styles from "./modules/stylesheet"

 class Index extends Component {

    constructor(props){
        super(props);
    }

    SignInButtonPressed(nav){
        nav.navigate('Login');
    }

    RegisterButtonPressed(nav){
        nav.navigate('Register');
    }

    render(){
        return(
        <View style = {styles.flexContainer}>

            <View style = {styles.homeLogo}>
                <Logo></Logo>
            </View>

            <View style = {stylesIn.secondRow}>
                <Text style={stylesIn.h1Welcome}> Welcome to Spacebook!</Text>
                <Text style={stylesIn.h3Welcome}> Share your activities with your friends. {'\n'} Ready to go? </Text> 
            </View>

            <View style = {stylesIn.thirdRow}>

                <View styles = {stylesIn.firstCol}>
                <TouchableOpacity 
                    style = {stylesIn.loginButton}
                    onPress={() => { this.SignInButtonPressed(this.props.navigation)}} >
                <Text style={stylesIn.loginButtonText}>Sign In</Text>
                </TouchableOpacity>
                </View>


                <View styles = {stylesIn.secondCol}>
                <TouchableOpacity 
                    style = {stylesIn.loginButton}
                    onPress={() => {this.RegisterButtonPressed(this.props.navigation)}}>
                <Text style={stylesIn.loginButtonText}>Register</Text>
                </TouchableOpacity>
                </View>

            </View>
            
        </View>

        )
    }

 }

 const stylesIn = StyleSheet.create({
 

    firstRow: {
        flex: 20,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center'
    },

    secondRow: {
        flex: 40,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignContent:'center',
        borderRadius: 5,
        marginTop: '10%',
        padding: 10,    
        backgroundColor: '#fff2ea'    
    },

    h1Welcome: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#722e00',
    },

    h3Welcome:{
        fontFamily: 'sans-serif',
        textAlign: 'center',
        alignContent: 'space-between',
        color: '#923b00'
    },


    thirdRow: {
        flex: 30,
        justifyContent: 'space-evenly',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        
    },

    firstCol: {
        flex: 10,
        justifyContent: 'space-between',
        backgroundColor: 'pink'
    },

    secondCol: {
        justifyContent: 'space-between',
        flex: 10,
    },

    loginButton: {
        padding:'10%',
        backgroundColor: '#f9943b',
        borderColor: '#black',
        borderWidth: 2,
        borderRadius: 5,
        alignItems:'center',
    },

    loginButtonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#ffffff'
    },

 })

 export default Index;

