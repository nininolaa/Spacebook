//import elements and components to be able to use it inside the class
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './stylesheet';
import IsLoading from './isLoading';
import ProfileImage from './profileImage';

//create a friendHeading component which will render user's general information and image
//this component can be used as a header for both friend and non-friend screen
class FriendHeading extends Component {
  //create a constructor
  constructor(props) {
    //passing props into the constructor to enable using this.props inside a constructor
    super(props);

    //initialise the state for each data to be able to change it overtime
    this.state = {
      user_id: '',
      first_name: '',
      last_name: '',
      email: '',
      friend_count: '',
      isLoading: true,
      alertMessage: '',
    };
  }

  //using componentDidmount to invoked friend details component immediately after being mounted
  componentDidMount() {
    this.loadFriend();
  }

  //create a function to call the api for getting user information
  loadFriend = async () => {
    //get the session token to use for authorisation when calling api
    const token = await AsyncStorage.getItem('@session_token');

    //calling the api and passing the id of the friend that going to will be view
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.props.friend_id}`, {
      //passing get method in order to get user information
      method: 'get',
      //passing the session token to be authorised
      headers: {
        'X-Authorization': token,
      },
    })
      //checking the response status after calling api
      .then((response) => {
        switch (response.status) {
          //return the values from the response if the calling is successful and
          //if the response status error occured, store the error reasons into the 
          //array objects
          case 200:
            return response.json();
            break;
          case 401:
            throw { errorCase: 'Unauthorised' };
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
      //when the promise is resolved, set all the states to be the value from the response Json array
      //and set the isLoading state to be false as the promise has been resolved
      .then((responseJson) => {
        this.setState({
          profile: responseJson,
          first_name: responseJson.first_name,
          last_name: responseJson.last_name,
          user_id: responseJson.user_id,
          email: responseJson.email,
          friend_count: responseJson.friend_count,
          isLoading: false,
        });
      })
      //when the promise is rejected, check which error reason from the response was and
      //set the correct error message to each error in order to render the right error message
      //also set the isLoading state to be false as the promise has been rejected
      .catch((error) => {
        console.log(error);
        switch (error.errorCase) {
          case 'Unauthorised':
            this.setState({
              alertMessage: 'Unauthorised, Please login',
              isLoading: false,
            });
            break;
          case 'UserNotFound':
            this.setState({
              alertMessage: 'Not found',
              isLoading: false,
            });
            break;
          case 'ServerError':
            this.setState({
              alertMessage: 'Cannot connect to the server, please try again',
              isLoading: false,
            });
            break;
          case 'WentWrong':
            this.setState({
              alertMessage: 'Something went wrong, please try again',
              isLoading: false,
            });
            break;
        }
      });
  };
  //calling render function and return the data that will be display 
  render() {
    // check if the function is still loading
    // if it does, render the loading icon
    if (this.state.isLoading == true) {
      return (
        <IsLoading />
      );
    }
    // if not, render the main screen

    return (

      // create a flex container to make the content responsive to all screen sizes
      // by dividing each section to an appropriate flex sizes
      <View style={stylesIn.flexContainer}>

        {/* create a container to store a image and text container together */}
        <View style={stylesIn.subContainer}>

          {/* passing the alertMessage state to alert the error message at the top of the screen  */}
          <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>

          {/* create a container to render friend's image */}
          <View style={stylesIn.friendImage}>
            {/* passing the profileImage component and given the attributes to the component
            in order to render the right profile image and right size */}
            <ProfileImage
              userId={this.props.friend_id}
              isEditable={false}
              width={100}
              height={100}
              navigation={this.props.navigation}
            />
          </View>
          {/* create a container to render friend's information */}
          <View style={stylesIn.friendInfo}>
            {/* render friend's information from the revelant states */}
            <Text style={styles.profileText}>
              {' '}
              ID:
              {this.state.user_id}
              {' '}
              |
              {this.state.first_name}
              {' '}
              {this.state.last_name}
            </Text>
            <Text>
              Email:
              {this.state.email}
            </Text>
            <Text>
              Friend count:
              {this.state.friend_count}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

// using stylesheet to design the render
const stylesIn = StyleSheet.create({

  flexContainer: {
    flex: 1,
    backgroundColor: '#fdf6e4',
  },

  subContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  friendImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  friendInfo: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  friendBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 10,
  },

  seeFriendBtn: {
    borderWidth: 2,
    borderRadius: 5,
    width: '80%',
    height: '100%',
    alignItems: 'center',
  },
});

export default FriendHeading;
