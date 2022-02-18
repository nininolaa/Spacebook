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

            new_first_name: '',
            new_last_name: '',
            new_email: '' ,
            new_password: '',

            editable: false,
        }
    }

    componentDidMount() {
        this.loadProfile();
    }

    //get user info 
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
                throw 'User id not found';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(profile => {
            this.setState(profile)
        }) 
    }

    //update user info
    updateInfo = async() => {

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

        console.log(new_info)
        let token = await AsyncStorage.getItem('@session_token');
        let userId = await AsyncStorage.getItem('user_id');

        return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
            method: 'PATCH',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(new_info)    
        })
        .then((response) => {
            console.log("Info updated");
          })
          .catch((error) => {
            console.log(error);
          })
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
            if(response.status === 200){ 
                console.log('checked')
                this.props.navigation.navigate("Login");
            }else if(response.status === 401){
                console.log("Goign home...");
                this.props.navigation.navigate("Login");
                console.log("Should be home by now...")
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error.message);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })

    }

    editTextInput(){
        this.setState({editable: true}) ;
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

                <TextInput
                style = {stylesIn.userDetailsText}
                placeholder={this.state.first_name}
                onChangeText={(new_first_name) => this.setState({new_first_name})}
                value={this.state.new_first_name} editable={this.state.editable}
                />
                <Button 
                color= 'orange'
                onPress={() => {this.editTextInput()}}
                title="Edit first name"></Button>

                
                <TextInput
                style = {stylesIn.userDetailsText}
                placeholder={this.state.last_name}
                onChangeText={(new_last_name) => this.setState({new_last_name})}
                value={this.state.new_last_name}
                />
                <Button 
                color= 'orange'
                onPress={() => {this.editTextInput()}}
                title="Edit last name"></Button>

                <TextInput
                style = {stylesIn.userDetailsText}
                placeholder={this.state.email}
                onChangeText={(new_email) => this.setState({new_email})}
                value={this.state.new_email}
                />
                <Button 
                color= 'orange'
                onPress={() => {this.editTextInput()}}
                title="Edit email address"></Button>

                {/* <TextInput
                style = {stylesIn.userDetailsText}
                placeholder="Enter new password..."
                onChangeText={(new_password) => this.setState({new_password})}
                value={this.state.new_password}
                /> */}
                <Button
                title="Update"
                onPress={() => this.updateInfo()}
                /> 
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
    },

    userDetailsText:{
        fontSize: 15,
        placeholderTextColor: '#000000'
    }

})

 export default SettingScreen;


