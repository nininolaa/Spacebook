import React, {Component} from 'react';
import { View, TextInput,Text, StyleSheet, TouchableOpacity} from 'react-native';
import ValidationComponent from 'react-native-form-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../modules/logo';
import styles from "../modules/stylesheet";

 class Login extends ValidationComponent {

    constructor(props){
        super(props);

        this.state = {
            email: '' ,
            password: '',
            alertMessage: '',
        }
    }

    SignInButtonPressed = async () => {

        this.validate({
            email: {required: true},
            password: {required: true},
        })

        if (this.isFormValid() == true){

        return fetch("http://localhost:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {

            switch(response.status){
                case 200:
                    return response.json()
                    break
                case 400: 
                    throw {errorCase: "InvalidInfo"}
                    break
                case 500:
                    throw {errorCase: "ServerError"}
                    break
                default:
                    throw {errorCase: "WentWrong"}
                    break
            }
        })
        .then(async (responseJson) => {
                await AsyncStorage.setItem('@session_token', responseJson.token);
                await AsyncStorage.setItem('user_id', responseJson.id);
                this.props.navigation.navigate("Home");
        })
        .catch((error) => {
            console.log(error)
            switch (error.errorCase){

                case 'InvalidInfo':    
                    this.setState({
                        alertMessage: 'Invalid email or password'
                    })
                    break
                case "ServerError":
                    this.setState({
                        alertMessage: 'Cannot connect to the server, please try again'
                    })
                    break
                case "WentWrong":
                    this.setState({
                        alertMessage: 'Something went wrong, please try again'
                    })
                    break
            }
        })
    }
    }
    

    RegisterButtonPressed(){
        this.props.navigation.navigate('Register');
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
            <TextInput
            style = {styles.loginInput} 
            placeholder="email..." 
            onChangeText={this.handleEmailInput} 
            value = {this.state.email}
            />
            {this.isFieldInError('email') && this.getErrorsInField('email').map(errorMessage => 
            <Text key={errorMessage} style={styles.loginErrorText}>An email is required</Text>
            )}
            
            <TextInput 
            style = {styles.loginInput} 
            placeholder="password..." 
            onChangeText={this.handlePasswordInput} 
            value = {this.state.password} 
            secureTextEntry={true}/>
            {this.isFieldInError('password') && this.getErrorsInField('password').map(errorMessage => 
            <Text key={errorMessage} style={styles.loginErrorText}>A password is required</Text>
            )}
            </View>

            <View style =  {styles.loginButtonRow}>
            <Text>{this.state.alertMessage}</Text>
            <TouchableOpacity
                style = {styles.loginButton}
                onPress={() => {this.SignInButtonPressed()}}>
            <Text style = {styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
            </View>

            <View style = {styles.endTextRow}>
            <Text>Haven't Register? <Text onPress={() => { this.RegisterButtonPressed()}} style = {styles.linkText}>Click here</Text> to create an account</Text> 
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


