import React, {Component} from 'react';
import { View, TextInput,Button,Alert,Text,StyleSheet} from 'react-native'
import Logo from './modules/logo';
import styles from "./modules/stylesheet";


 class Register extends Component {

    constructor(props){
        super(props);

        this.state = {
            first_name: '',
            last_name: '',
            email: '' ,
            password: ''
        }
    }

    SignInButtonPressed(nav){
        this.props.navigation.navigate('Login')
    }

    RegisterButtonPressed = () => {
        
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
                    throw 'Bad request'
                    break
                case 500:
                    throw 'Server Error'
                    break
                default:
                    throw 'Something went wrong'
                    break
            }
        })
        .then((responseJson) => {
               console.log("User created with ID: ", responseJson);
               this.props.navigation.navigate("Login");
        })
        .catch((error) => {
            console.log(error);
        })
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

    render(){
        return(
        <View style = {styles.flexContainer}>

            <View style = {styles.homeLogo}>
            <Logo></Logo>
            </View>

            <View style = {stylesIn.loginRow}>
            <Text style={styles.loginHeading}>Create an account</Text>
            <TextInput style = {styles.loginInput} placeholder="firstname..." onChangeText={this.handleFirstNameInput} value = {this.state.first_name} />
            <TextInput style = {styles.loginInput} placeholder="lastname..." onChangeText={this.handleLastNameInput} value = {this.state.last_name} />
            <TextInput style = {styles.loginInput} placeholder="email..." onChangeText={this.handleEmailInput} value = {this.state.email} />
            <TextInput style = {styles.loginInput} placeholder="password..." onChangeText={this.handlePasswordInput} value = {this.state.password} />
            </View>
            
            <View style =  {styles.loginButtonRow}>
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


