//import elements and components to be able to use it inside the class
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Logo from '../modules/logo';
import styles from '../modules/stylesheet';

import Friend from './friend';
import PostScreen from './post';
import ProfileScreen from './profile';
import SettingScreen from './setting';

//declare the variable to store the tab navigator
const Tab = createBottomTabNavigator();

//create a Index component to render the welcome screen for un-login user and
//render a main app with tab bar for logged in user
class Index extends Component {
  //create a constructor
  constructor(props) {
    //passing props into the constructor to enable using this.props inside a constructors
    super(props);

    //initialise the state for each data to be able to change it overtime
    this.state = {
      token: null,
    };
  }

  //get and set the session token into the state when the focus screen changes
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      AsyncStorage.getItem('@session_token')
        .then((session) => {
          this.setState({
            token: session,
          });
        });
    });
  }

  //clean up the unsubscribe function in componentDidMount before being destroyed
  componentWillUnmount() {
    this.unsubscribe();
  }

  //calling render function and return the data that will be display 
  render() {
    //when the user is not yet loggeed in
    if (this.state.token === null) {
      //display a welcome page that allows a user to navigate to a login or register screen
      return (

        //create a flex container to make the content responsive to all screen sizes
        //by dividing each section to an appropriate flex sizes
        <View style={styles.flexContainer}>

          {/* create a flex box to render spacebook logo */}
          <View style={styles.homeLogo}>
            {/* assign logo size to large as it logo for non-login screens are larger */}
            <Logo
              size="large"
            />
          </View>

          {/* create a flex box to render a welcome messages to user */}
          <View style={stylesIn.secondRow}>
            <Text style={stylesIn.h1Welcome}> Welcome to Spacebook!</Text>
            <Text style={stylesIn.h3Welcome}>
              {' '}
              Share your activities with your friends.
              {'\n'}
              {' '}
              Ready to go?
              {' '}
            </Text>
          </View>

          {/* create a flex box to display a button for login and register navigation */}
          <View style={stylesIn.thirdRow}>

            <View styles={stylesIn.firstCol}>
              {/* create a login button and add an inline function to navigate the user to login screen */}
              <TouchableOpacity
                style={stylesIn.loginButton}
                onPress={() => {this.props.navigation.navigate('Login')}}
              >
                <Text style={stylesIn.loginButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>

            <View styles={stylesIn.secondCol}>
              {/* create a register button and add an inline function to navigate the user to register screen */}
              <TouchableOpacity
                style={stylesIn.loginButton}
                onPress={() => {this.props.navigation.navigate('Register')}}
              >
                <Text style={stylesIn.loginButtonText}>Register</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>

      );
    }

    //if the user is logged in (a session token is valid), display the main screen 
    //with the bottom tab navigator
    return (

      //using the tab navigator element to add the navigator at the bottom of the screen
      <Tab.Navigator
        //set the profile screen to be the default tab
        initialRouteName="Profile"
        screenOptions={({ route }) => ({
          //assigned icon for each tab by using icons from the imported Ion icons
          tabBarIcon: ({ focused, color, size }) => {

            let iconName;
            const routName = route.name;
            switch (routName) {
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
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {/* declare the components of the screens that will be in the tab navigator */}
        <Tab.Screen name="Friends" component={Friend} />
        <Tab.Screen name="Add Post" component={PostScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Setting" component={SettingScreen} />
      </Tab.Navigator>

    );
  }
}

//using stylesheet to design the render
const stylesIn = StyleSheet.create({

  secondRow: {
    flex: 40,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 5,
    marginTop: '10%',
    padding: 10,
    backgroundColor: '#fff2ea',
  },

  h1Welcome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#722e00',
  },

  h3Welcome: {
    fontFamily: 'sans-serif',
    textAlign: 'center',
    alignContent: 'space-between',
    color: '#923b00',
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
    backgroundColor: 'pink',
  },

  secondCol: {
    justifyContent: 'space-between',
    flex: 10,
  },

  loginButton: {
    padding: '10%',
    backgroundColor: '#f9943b',
    borderColor: '#black',
    borderWidth: 2,
    borderRadius: 5,
    alignItems: 'center',
  },

  loginButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffff',
  },

});

export default Index;
