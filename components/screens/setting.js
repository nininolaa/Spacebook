import React, {Component} from 'react';
import { View, TextInput,TouchableOpacity,Text, StyleSheet,ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidationComponent from 'react-native-form-validator';

import styles from "../modules/stylesheet";
import IsLoading from "../modules/isLoading";
import Logo from '../modules/logo';
import ProfileImage from '../modules/profileImage';


 class SettingScreen extends ValidationComponent {

    constructor(props){
        super(props);
        
        this.state = {
            user_id: '',
            first_name: '',
            last_name: '',
            email: '' ,
            password: '',
            editable: false,
            isLoading: true,
            alertMessage: '',
            
            new_first_name: '',
            new_last_name: '',
            new_email: '' ,
            new_password: '',
            new_password_confirm: '',
        }
    }

    async componentDidMount () {
        this.state.user_id = await AsyncStorage.getItem('user_id');
        this.focusListener = this.props.navigation.addListener('focus', async () => {
            this.loadProfile();
        })
    }

    //get user info 
    async loadProfile() {

        let token = await AsyncStorage.getItem('@session_token');
        let user_id = await AsyncStorage.getItem('user_id');
        
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
            method: 'get',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },
        })
        .then((response) => {
            switch(response.status){
                case 200: 
                    return response.json()
                    break
                case 401:
                    throw {errorCase: "Unauthorised"}
                    break
                case 404:
                    throw {errorCase: "UserNotFound"}
                    break
                case 500:
                    throw {errorCase: "ServerError"}
                    break
                default:
                    throw {errorCase: "WentWrong"}
                    break
            }
        })
        .then(response => {
            this.setState({
                user_id: response.user_id,
                first_name: response.first_name,
                last_name: response.last_name,
                email: response.email,
                isLoading: false 
            })
        }) 
        .catch((error) => {
            console.log(error);
            switch (error.errorCase){

                case 'Unauthorised':    
                    this.setState({
                        alertMessage: 'Unauthorised, Please login',
                        isLoading: false,
                    })
                    break
                case 'UserNotFound':    
                    this.setState({
                        alertMessage: 'Not found',
                        isLoading: false,
                    })
                    break
                case "ServerError":
                    this.setState({
                        alertMessage: 'Cannot connect to the server, please try again',
                        isLoading: false,
                    })
                    break
                case "WentWrong":
                    this.setState({
                        alertMessage: 'Something went wrong, please try again',
                        isLoading: false,
                    })
                    break
            }
        })
    }

    //update user info
    async updateInfo(){

        this.validate({
            first_name: {maxlength: 20 ,hasLowerCase: true },
            last_name: { maxlength: 20},
            new_email: { email: true},
            new_password: { minlength: 6, equalPassword: this.state.new_password_confirm },
            new_password_confirm: { minlength: 6, equalPassword: this.state.new_password },
        })

        let token = await AsyncStorage.getItem('@session_token');
        let user_id = await AsyncStorage.getItem('user_id');

        if (this.isFormValid() == true){

        let new_info = {};

        if (this.state.new_first_name != this.state.first_name && this.state.new_first_name != '' ){
            new_info['first_name'] = this.state.new_first_name;
        }

        if (this.state.new_last_name != this.state.last_name && this.state.new_last_name != '' ){
            new_info['last_name'] = this.state.new_last_name;
        } 

        if (this.state.new_email != this.state.email && this.state.new_email != ''){
        new_info['email'] = this.state.new_email;
        }

        if (this.state.new_password != this.state.password && this.state.new_password != ''){
            new_info['password'] = this.state.new_password ;
        }

        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
            method: 'PATCH',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(new_info)    
        })
        .then((response) => {
            switch(response.status){
                case 200: 
                    //console.log('info updated')
                    break
                case 400:
                    throw {errorCase: "BadRequest"}
                    break
                case 401:
                    throw {errorCase: "Unauthorised"}
                    break
                case 403:
                    throw {errorCase: "Forbidden"}
                    break
                case 404:
                    throw {errorCase: "UserNotFound"}
                    break
                case 500:
                    throw {errorCase: "ServerError"}
                    break
                default:
                    throw {errorCase: "WentWrong"}
                    break
            }
        })
        .then((response) => {
            this.setState({
                editable: false,
                isLoading: false
            });
            console.log("Info updated");
          })
          .catch((error) => {
            console.log(error);
            switch (error.errorCase){

                case 'BadRequest':    
                    this.setState({
                        alertMessage: 'Bad Request',
                        isLoading: false,
                    })
                    break
    
                case 'Unauthorised':    
                    this.setState({
                        alertMessage: 'Unauthorised, Please login',
                        isLoading: false,
                    })
                    break
                case 'Forbidden':    
                    this.setState({
                        alertMessage: 'Forbidden',
                        isLoading: false,
                    })
                    break
                case 'UserNotFound':    
                    this.setState({
                        alertMessage: 'Not found',
                        isLoading: false,
                    })
                    break
                case "ServerError":
                    this.setState({
                        alertMessage: 'Cannot connect to the server, please try again',
                        isLoading: false,
                    })
                    break
                case "WentWrong":
                    this.setState({
                        alertMessage: 'Something went wrong, please try again',
                        isLoading: false,
                    })
                    break
            }
          })
        }
    }

    //Sign out function 
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
            switch(response.status){
                case 200:
                    return this.props.navigation.navigate("Login");
                case 401:
                    return this.props.navigation.navigate("Login");
                    break
                case 500:
                    throw {errorCase: "ServerError"}
                    break
                default:
                    throw {errorCase: "WentWrong"}
                    break
            }
        })
        .catch((error) => {
            console.log(error.message);
            switch (error.errorCase){
                case "ServerError":
                    this.setState({
                        alertMessage: 'Cannot connect to the server, please try again',
                        isLoading: false,
                    })
                    break
                case "WentWrong":
                    this.setState({
                        alertMessage: 'Something went wrong, please try again',
                        isLoading: false,
                    })
                    break
            }
        })
    }

    //edit button press
    editPost() {
        this.setState({editable: true}) ;
    }

    isEditMode() {
        return this.state.editable;
    }

    render(){

        if(this.state.isLoading == true){
            return(
                <IsLoading></IsLoading>
              );
        }

        else{
        return(
        <ScrollView style = {stylesIn.flexContainer}>

           
            <View style = {stylesIn.homeLogo}>
                <Logo></Logo>
            </View>
            
            <View style = {stylesIn.userProfile}>
                <View style = {stylesIn.userImage}>
                    <ProfileImage
                    userId = {this.state.user_id }
                    isEditable = {true}
                    width = {100}
                    height = {100}
                    navigation={this.props.navigation}
                    ></ProfileImage>
                </View>

                <View style = {stylesIn.userDetails}>
                    <Text style = {styles.profileText}>ID:{this.state.user_id} </Text>
                    <Text style = {styles.profileText}>{this.state.first_name} {this.state.last_name} </Text>
                </View>
            </View>

            <View style = {stylesIn.userUpdateDetails}>
                <Text style={styles.postHeaderText}>Edit Profile </Text>

                <Text style = {stylesIn.userDetailsText}>First Name: </Text> 
                <TextInput
                    style = {[stylesIn.userDetailsText, styles.updateInput]}
                    placeholder={this.state.first_name}
                    onChangeText={(new_first_name) => this.setState({new_first_name: new_first_name})}
                    editable={this.state.editable}
                    /> 
                    {this.isFieldInError('first_name') && this.getErrorsInField('first_name').map(errorMessage => 
                    <Text key={errorMessage} style={styles.loginErrorText}>{errorMessage} </Text>
                    )} 

                <Text style = {stylesIn.userDetailsText}>Last Name: </Text>
                <TextInput 
                    style = {[stylesIn.userDetailsText, styles.updateInput]}
                    placeholder={this.state.last_name}
                    onChangeText={(new_last_name) =>  this.setState({new_last_name: new_last_name})}
                    editable={this.state.editable}
                    />
                    {this.isFieldInError('new_last_name') && this.getErrorsInField('new_last_name').map(errorMessage => 
                    <Text key={errorMessage} style={styles.loginErrorText}>Your last name should not be more than 50 characters</Text>
                    )} 

                <Text style = {stylesIn.userDetailsText}>Email:</Text> 
                <TextInput
                    style = {[stylesIn.userDetailsText, styles.updateInput]}
                    placeholder={this.state.email}
                    onChangeText={(new_email) => this.setState({new_email: new_email})}
                    editable={this.state.editable}
                    //value = {this.state.email}
                    />
                    {this.isFieldInError('new_email') && this.getErrorsInField('new_email').map(errorMessage => 
                    <Text key={errorMessage} style={styles.loginErrorText}>Please enter a valid email address</Text>
                    )}

                <Text style = {stylesIn.userDetailsText}>Password:</Text>
                <TextInput
                style = {[stylesIn.userDetailsText, styles.updateInput]}
                placeholder="Enter new password..."
                onChangeText={(new_password) => this.setState({new_password: new_password})}
                value={this.state.new_password}
                secureTextEntry={true}
                editable={this.state.editable}
                />
                {this.isFieldInError('new_password') && this.getErrorsInField('new_password').map(errorMessage => 
                <Text key={errorMessage} style={styles.loginErrorText}>{errorMessage}</Text>
                )}

                <TextInput
                style = {[stylesIn.userDetailsText, styles.updateInput]}
                placeholder="Confirm your new password..."
                onChangeText={(new_password_confirm) => this.setState({new_password_confirm: new_password_confirm})}
                value={this.state.new_password_confirm}
                secureTextEntry={true}
                editable={this.state.editable}
                />
                {this.isFieldInError('new_password_confirm') && this.getErrorsInField('new_password_confirm').map(errorMessage => 
                <Text key={errorMessage} style={styles.loginErrorText}>{errorMessage}</Text>
                )}

                <TouchableOpacity
                onPress = {()=> this.editPost()}
                style = {[stylesIn.editBtn, stylesIn.editBtnColor, !this.isEditMode() ? styles.showEdit : styles.hideEdit]}
                ><Text style = {[stylesIn.editBtnText]}>Edit information</Text></TouchableOpacity>
                <TouchableOpacity
                onPress = {()=> this.updateInfo()}
                style = {[stylesIn.editBtn , stylesIn.updateBtnColor, this.isEditMode() ? styles.showEdit : styles.hideEdit]}
                ><Text style = {[stylesIn.editBtnText]}>Update information</Text></TouchableOpacity>     
                
                <Text style = {styles.errorMessage}> {this.state.alertMessage} </Text>
                <TouchableOpacity
                onPress={() => {this.logout()}}
                style = {[styles.loginButton, stylesIn.logoutBtn]}
                >
                <Text>Sign Out</Text>
                </TouchableOpacity>
                
               
            </View>

        </ScrollView>
        )}
    }
 }

const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
        backgroundColor: "#fdf6e4",
        paddingHorizontal: 10,
    },

    homeLogo: {
        flex: 1, 
        justifyContent: 'flex-start', 
    },

    userProfile: {
        flex: 1,
        flexDirection: 'row',

    },

    userImage:{
        flex:1,
        marginLeft:10,
    },

    userDetails:{
        flex: 1.8,
        marginLeft: 10,
        justifyContent:'center',
        alignItems: 'center',
    },

    userUpdateDetails: {
        flex: 2,         
    },

    logoutBtn:{
        marginTop: 50,
        marginLeft:'30%',
        height: 30
    },

    userDetailsText:{
        fontSize: 15,
        placeholderTextColor: '#000000'
    },

    editBtn:{
        justifyContent:'center',  
        alignContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 5,
        width: '30%',
        padding: 5,
    },

    editBtnColor:{
        backgroundColor: '#9c5304',
        borderColor: '#9c5304',
    },

    updateBtnColor:{
        backgroundColor: '#63c5da',
        borderColor: '#63c5da',
    },

    editBtnText:{
        textAlign:'center',
        color: 'white',
        fontSize:15,
    }
})

 export default SettingScreen;


