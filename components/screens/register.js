import React, {Component} from 'react';
import { View, TextInput,Button,Text,StyleSheet} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import ValidationComponent from 'react-native-form-validator';
import Logo from '../modules/logo';
import styles from "../modules/stylesheet";


 class Register extends ValidationComponent {

    constructor(props){
        super(props);

        this.state = {
            first_name: '',
            last_name: '',
            email: '' ,
            password: '',
            password_confirm: '',
            showAlert: false,
            alertMessage: '',
        }
    }

    SignInButtonPressed(nav){
        this.props.navigation.navigate('Login')
    }

    RegisterButtonPressed = () => {

        this.validate({
            first_name: {required:true , maxlength: 50 },
            last_name: {required:true, maxlength: 50},
            email: { required: true , email:true},
            password: {required: true, minlength: 6},
            password_confirm: {required: true, equalPassword: this.state.password},
        })

        if (this.isFormValid() == true){
        
            return fetch("http://localhost:3333/api/1.0.0/user", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            })
            .then((response) => {

                switch(response.status){

                    case 201: 
                        return response.json()
                        break
                    case 400:
                        throw {errorMsg: 'Duplicate'}
                        break
                    case 500:
                        throw {errorMsg: 'ServerError'}
                        break
                    default:
                        throw {errorMsg: 'WentWrong'}
                        break
                }
            })
            .then((responseJson) => {
                console.log("User created with ID: ", responseJson);
                this.props.navigation.navigate("Login");
            })
            .catch((error) => {
                console.log(error)
                switch (error.errorMsg){
                    case 'Duplicate':    
                        console.log('sd')
                        this.setState({
                            alertMessage: 'This user  is already exist, please try to register with a new email address'
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

    handleFirstNameInput = (first_name) => {
        this.setState({first_name: first_name})
    }

    handleLastNameInput = (last_name) => {
        this.setState({last_name: last_name})
    }

    handleEmailInput = (email) => {
        this.setState({email: email})
    }

    handlePasswordInput = (pass) => {
        this.setState({password: pass})
    }

    handleConfirmPasswordInput = (pass) => {
        this.setState({password_confirm: pass})
    }


    render(){
        return(
            
        <View style = {styles.flexContainer}>
            <AwesomeAlert
                show={this.state.showAlert}
                message={this.state.alertMessage}
                closeOnTouchOutside={true}
            />
            <View style = {styles.homeLogo}>
            <Logo></Logo>
            </View>

            <View style = {stylesIn.loginRow}>
                <Text style={styles.loginHeading}>Create an account</Text>
                <TextInput 
                    ref = "first_name"
                    style = {styles.loginInput} 
                    placeholder="first name..." 
                    onChangeText={this.handleFirstNameInput} 
                    value = {this.state.first_name} /> 
                    {this.isFieldInError('first_name') && this.getErrorsInField('first_name').map(errorMessage => 
                    <Text key={errorMessage} style={styles.loginErrorText}>Your first name is required</Text>
                    )} 

                <TextInput 
                    ref = "last_name"
                    style = {styles.loginInput} 
                    placeholder="last name..." 
                    onChangeText={this.handleLastNameInput} 
                    value = {this.state.last_name} />
                    {this.isFieldInError('last_name') && this.getErrorsInField('last_name').map(errorMessage => 
                    <Text key={errorMessage} style={styles.loginErrorText}>Your last name is required</Text>
                    )}

                <TextInput 
                    ref = "new_email"
                    style = {styles.loginInput} 
                    placeholder="email..." 
                    onChangeText={this.handleEmailInput} 
                    value = {this.state.email} />
                    {this.isFieldInError('new_email') && this.getErrorsInField('new_email').map(errorMessage => 
                    <Text key={errorMessage} style={styles.loginErrorText}>{errorMessage}</Text>
                    )}

                <TextInput 
                    ref = "password"
                    style = {styles.loginInput} 
                    placeholder="password..." 
                    onChangeText={this.handlePasswordInput} 
                    value = {this.state.password} 
                    secureTextEntry={true} />
                    {this.isFieldInError('password') && this.getErrorsInField('password').map(errorMessage => 
                    <Text key={errorMessage} style={styles.loginErrorText}>A password must contain at least 8 characters</Text>
                    )}

                <TextInput 
                    ref = "password_confirm"
                    style = {styles.loginInput} 
                    placeholder="confirm password..." 
                    onChangeText={this.handleConfirmPasswordInput} 
                    value = {this.state.password_confirm} 
                    secureTextEntry={true}/>
                    {this.isFieldInError('password_confirm') && this.getErrorsInField('password_confirm').map(errorMessage => 
                    <Text key={errorMessage} style={styles.loginErrorText}>Password does not match</Text>
                    )}
            </View>

            
            
            <View style =  {styles.loginButtonRow}>
            <Text style = {styles.errorMessage}>{this.state.alertMessage}</Text>
            <Button
                title='Register' 
                color='#ffaf7a'
                onPress={() => {this.RegisterButtonPressed()}}></Button>
            </View>

            <View style = {styles.endTextRow}>
            <Text>Already have an account? <Text onPress={() => { this.SignInButtonPressed()}} style = {styles.linkText}>Click here</Text> to sign in</Text> 
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
        flex: 90,
        marginTop:'15%',
        justifyContent: 'space-evenly', 
        alignContent:'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor:'#ffaf7a',
        borderRadius: 20,
    },



 
 })

 export default Register;


