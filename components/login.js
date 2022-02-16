import React, {Component} from 'react';
import { View, TextInput,Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from './modules/logo';
import styles from "./modules/stylesheet";

 class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            email: '' ,
            password: ''
        }
    }


    SignInButtonPressed = async () => {

        return fetch("http://localhost:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
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
        .then(async (responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token);
                await AsyncStorage.setItem('user_id', responseJson.id);
                this.props.navigation.navigate("Home");
        })
        .catch((error) => {
            console.log(error);
        })
    }
    

    RegisterButtonPressed(nav){
        nav.navigate('Register');
    }

    handleEmailInput = (email) => {
        this.setState({email: email})
    }

    handlePasswordInput = (pass) => {
        this.setState({password: pass})
    }

    render(){
        return(
    
        <View style = {styles.flexContainer}>

            <View style = {styles.homeLogo}>
            <Logo></Logo>
            </View>

            <View style = {stylesIn.loginRow}>     
            <Text style = {styles.loginHeading}>Sign In</Text>
            <TextInput style = {styles.loginInput} placeholder="email..." onChangeText={this.handleEmailInput} value = {this.state.email} />
            <TextInput style = {styles.loginInput} placeholder="password..." onChangeText={this.handlePasswordInput} value = {this.state.password} />
            </View>

            <View style =  {styles.loginButtonRow}>
            
            <TouchableOpacity
                style = {styles.loginButton}
                onPress={() => {this.SignInButtonPressed()}}>
            <Text style = {styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
            </View>

            <View style = {styles.endTextRow}>
            <Text>Haven't Register? <Text onPress={() => { this.RegisterButtonPressed(this.props.navigation)}} style = {styles.linkText}>Click here</Text> to create an account</Text> 
            </View>

        </View>
  
        )
    }
 }

 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
    },

    loginRow: {
        flex: 50,
        marginTop:'10%',
        justifyContent: 'space-evenly', 
        alignContent:'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor:'#ffaf7a',
        borderRadius: 20,
     
    },



 
 })

 export default Login;


