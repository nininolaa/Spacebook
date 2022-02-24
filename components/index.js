import React, {Component} from 'react';
import { View, Text, StyleSheet, Button ,Image, ImageBackground, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Logo from './modules/logo';
import styles from "./modules/stylesheet";
//import Feed from './feed';
import FriendScreen from './friendScreen';
import PostScreen from './postScreen';
import ProfileScreen from './profileScreen';
import SettingScreen from './settingScreen';

const Tab = createBottomTabNavigator() ;

 class Index extends Component {

    constructor(props){
        super(props);

        this.state={
          token: null,
        };
    }

    SignInButtonPressed(nav){
      this.props.navigation.navigate('Login');
    }

    RegisterButtonPressed(nav){
      this.props.navigation.navigate('Register');
    }

    //get token and check if the token exist
    async componentDidMount() {
      this.unsubscribe = this.props.navigation.addListener('focus', async () => {

        await AsyncStorage.getItem('@session_token')
          .then (session => {
            console.log(session);
            if (session == null) {   
             this.props.navigation.navigate('Feed');
            }
            else{
              this.setState({token: session})
            }
          });

      })
      
    }
    
    componentWillUnmount() {
      this.unsubscribe();
    }

    render(){
    
      if(null === this.state.token){

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
                    onPress={() => { this.SignInButtonPressed()}} >
                <Text style={stylesIn.loginButtonText}>Sign In</Text>
                </TouchableOpacity>
                </View>


                <View styles = {stylesIn.secondCol}>
                <TouchableOpacity 
                    style = {stylesIn.loginButton}
                    onPress={() => {this.RegisterButtonPressed()}}>
                <Text style={stylesIn.loginButtonText}>Register</Text>
                </TouchableOpacity>
                </View>

            </View>
            
        </View>

      )}

      else {
        return(
     
        <Tab.Navigator
            initialRouteName={'Profile'}
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName;
                let rn = route.name;
    
                switch(rn)  {
                  // case 'Feed':
                  //   iconName = focused ? 'home' : 'home-outline';
                  //   break;
    
                  case 'Friends':
                    iconName = focused ? 'people' : 'people';
                    break;
    
                  case 'Add Post':
                    iconName = focused ? 'add' : 'add-circle';
                    break;
                  
                  case 'Profile':
                    iconName = focused ? 'person' : 'md-person';
                    break;
                  
                    case 'Setting':
                    iconName = focused ? 'cog' : 'ios-cog';
                    break;
    
                }
                return <Ionicons name={iconName} size={size} color={color}/>
              }
            })}>
    
            {/* <Tab.Screen name="Feed" component={Feed}></Tab.Screen> */}
            <Tab.Screen name="Friends" component={FriendScreen}></Tab.Screen>
            <Tab.Screen name="Add Post" component={PostScreen}></Tab.Screen>
            <Tab.Screen name="Profile" component={ProfileScreen}></Tab.Screen>
            <Tab.Screen name="Setting" component={SettingScreen}></Tab.Screen>
          </Tab.Navigator>
       
        )
      }
          
    
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

