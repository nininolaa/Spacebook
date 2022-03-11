//import elements and components to be able to use it inside the class
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../modules/logo';
import styles from '../modules/stylesheet';
import FriendHeading from '../modules/friendHeading';

//create a NonFriend component to display a screen for a person that is not friend with the user
class NonFriend extends Component {
  //create a constructor
  constructor(props) {
    //passing props into the constructor to enable using this.props inside a constructors
    super(props);

    //initialise the state for each data to be able to change it overtime
    this.state = {
      alertMessage: '',
    };
  }

  //create a function for a user to add a friend
  addFriend = async () => {

    //get the session token  as it is needed for authorisation
    const token = await AsyncStorage.getItem('@session_token');

    //using fetch function to call the api and send the post request
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.props.route.params.friendId}/friends`, {
      method: 'POST',
      //passing the session token to be authorised
      headers: {
        'X-Authorization': token,
      },
    })
      //checking the response status in the return promise
      .then((response) => {
      //if the response status error occured, store the error reasons into the 
      //errorCase key in object array
        switch (response.status) {
          case 201:
            break;
          case 401:
            throw { errorCase: 'Unauthorised' };
            break;
          case 403:
            throw { errorCase: 'AlreadyAdded' };
            break;
          case 404:
            throw { errorCase: 'UserNotFound' };
            break;
          case 500:
            throw { errorCase: 'ServerError' };
            break;
          default:
            throw { errorCase: 'WentWrong' };
            break;
        }
      })
      .then(() => {
        console.log('Request sent')
      })
      //when the promise is rejected, check which error reason from the response was and
      //set the correct error message to each error in order to render the right error message
      .catch((error) => {
        console.log(error);
        switch (error.errorCase) {
          case 'Unauthorised':
            this.setState({
              alertMessage: 'Unauthorised, Please login',
            });
            break;
          case 'AlreadyAdded':
            this.setState({
              alertMessage: 'User is already added as a friend',
            });
            break;
          case 'UserNotFound':
            this.setState({
              alertMessage: 'Not found',
            });
            break;
          case 'ServerError':
            this.setState({
              alertMessage: 'Cannot connect to the server, please try again',
            });
            break;
          case 'WentWrong':
            this.setState({
              alertMessage: 'Something went wrong, please try again',
            });
            break;
        }
      });
  };

  //calling render function and return the data that will be display 
  render() {
    return (

      //create a flex container to make the content responsive to all screen sizes
      //by dividing each section to an appropriate flex sizes
      <View style={stylesIn.flexContainer}>

        {/* create a flex box to render spacebook logo */}
        <View style={stylesIn.homeLogo}>
          <Logo />
        </View>

        {/* create a flex box to display user's detail by calling FriendHeading component which will
        render the user detail */}
        <View style={stylesIn.friendProfile}>
          <FriendHeading
            friend_id={this.props.route.params.friendId}
            navigation={this.props.navigation}
          />
        </View>

        {/* create a container for displaying the message to a user that feed cannot be view until becomee friends */}
        <View style={stylesIn.notFriendMeessage}>
          <Text style={stylesIn.notFriendMeessageText}> You can't view their feed until you become friends</Text>
        </View>

        {/* create a container to store a add friend button */}
        <View styles={stylesIn.addFriend}>
          <TouchableOpacity
            onPress={this.addFriend}
            style={[stylesIn.actionBtn, styles.actionBtnOrange]}
          >
            <Text style={styles.actionBtnLight}>Add Friend</Text>
          </TouchableOpacity>
        </View>

        {/* a flex box that provides a button to let the user navigate back to their friend screen */}
        <View style={stylesIn.backToTab}>
          <TouchableOpacity
            onPress={() => { (this.props.navigation.navigate('Friends')); }}
            style={[stylesIn.actionBtn, styles.actionBtnGrey]}
          >
            <Text style={styles.actionBtnLight}>Back to your friend list</Text>
          </TouchableOpacity>
          {/* passing the alertMessage state to alert the error message  */}
          <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
        </View>
      </View>
    );
  }
}

//using stylesheet to design the render
const stylesIn = StyleSheet.create({

  flexContainer: {
    flex: 1,
    backgroundColor: '#fdf6e4',
  },

  homeLogo: {
    flex: 2,
  },

  friendProfile: {
    flex: 3,
  },

  notFriendMeessage: {
    flex: 1,
    justifyContent: 'center',
  },

  addFriend: {
    flex: 1.5,
  },

  backToTab: {
    flex: 1.5,
  },

  notFriendMeessageText: {
    fontSize: 18,
    color: '#DD571C',
    textAlign: 'center',
  },

  actionBtn: {
    height: 40,
    margin: 10,
    width: '60%',
    marginLeft: 90,
    border: 5,
    borderRadius: 5,
  },

});

export default NonFriend;
