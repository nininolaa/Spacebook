//import elements and components to be able to use it inside the class
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../modules/logo';
import IsLoading from '../modules/isLoading';
import styles from '../modules/stylesheet';
import ProfileImage from '../modules/profileImage';
import UserWall from '../modules/userWall';

//create a ProfileScreen component which will render user information and feed
class ProfileScreen extends Component {
  //create a constructor
  constructor(props) {
    //passing props into the constructor to enable using this.props inside a constructors
    super(props);

    //initialise the state for each data to be able to change it overtime
    this.state = {
      user_id: '',
      first_name: '',
      last_name: '',
      friend_count: '',
      email: '',
      isLoading: true,
      userProfile: [],
      userPostList: [],
      alertMessage: '',
      imageKey: 0,
    };
  }

  //using componentDidmount to get the user id and
  //to call loadProfile function immediately after being mounted
  async componentDidMount() {
    this.state.user_id = await AsyncStorage.getItem('user_id');
    this.loadProfile();
    this.setState({
      imageKey: Math.random(),
    });
    
    //call loadProfile function when the focused screen changes
    this.focusListener = this.props.navigation.addListener('focus', async () => {
      this.loadProfile();
      //set the imageKey state to random numbers to make the component triggers when assign this state 
      //as a key in the component in render function
      this.setState({
        imageKey: Math.random(),
      });
    });
  }

  //clean up the focusListener function in componentDidMount before being destroyed
  componentWillUnmount() {
    this.focusListener();
  }

  //create a function to call the api for getting user information
  loadProfile = async () => {
    //get the user id as it is needed for api call 
    const user_id = await AsyncStorage.getItem('user_id');

    //get the session token to use for authorisation when calling api
    const token = await AsyncStorage.getItem('@session_token');

    //using fetch function to call the api and send the get request
    return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}`, {
      method: 'get',
      //passing the session token to be authorised
      headers: {
        'X-Authorization': token,
      },
    })
      //checking the response status after calling api
      .then((response) => {
        //return the values from the response if the calling is successful and
        //if the response status error occured, store the error reasons into the 
        //object array
        switch (response.status) {
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
      .then((response) => {
        this.setState({
          userProfile: response,
          user_id: response.user_id,
          first_name: response.first_name,
          last_name: response.last_name,
          friend_count: response.friend_count,
          email: response.email,
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
    //check if the function is still loading
    //if it does, render the loading icon
    if (this.state.isLoading == true) {
      return (
        <IsLoading />
      );
    }
    //render the main screen when the functions are ready
    return (
      //create a flex container to make the content responsive to all screen sizes
      //by dividing each section to an appropriate flex sizes
      <View style={stylesIn.flexContainer}>

        {/* create a sub-container to split between a normal view and a flatlist to
        ensure that it will not overlay each other when the flatlist data is empty */}
        <View style={stylesIn.firstSubContainer}>
          {/* create a flex box for rendering spacebook logo */}
          <View style={stylesIn.homeLogo}>
            <Logo />
          </View>

           {/* create a container to render user's profile image */}
          <View style={stylesIn.profilePicture}>
            {/* passing the profileImage component and given the attributes to the component
            in order to render the right profile image and right size */}
            <ProfileImage
              // set the key to be the user id so the component will trigger each time the user id is change
              // and also set the image to be editable as this is a user's own image
              key={this.state.imageKey}
              userId={this.state.user_id}
              isEditable
              width={100}
              height={100}
              navigation={this.props.navigation}
              style={stylesIn.imageAlign}
            />
          </View>
          
          {/* create a container to render user's information */}
          <View style={stylesIn.userInfo}>
            <Text style={styles.profileText}>
              {' '}
              ID:
              {this.state.user_id}
              {' '}
              |
              {this.state.first_name}
              {' '}
              {this.state.last_name}
              {' '}
            </Text>
            <Text style={styles.profileMiniText}>
              {' '}
              {this.state.email}
            </Text>
            <Text style={styles.profileMiniText}>
              {' '}
              Total friend:
              {this.state.friend_count}
              {' '}
              {'\n'}
              {' '}
            </Text>

            {/* navigate a user to setting screen when the edit information button is clicked */}
            <TouchableOpacity
              onPress={() => { this.props.navigation.navigate('Setting'); }}
              style={styles.navigateBtn}
            >
              <Text style={styles.navigateBtnText}>Edit information</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* create a container to display flatlist component */}
        <View style={stylesIn.secondSubContainer}>
          <View style={stylesIn.userPost}>
             {/* passing the alertMessage state to display the error message */}
            <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
            {/* call the userwall component to render the user wall */}
            <UserWall
              key={this.state.imageKey}
              navigation={this.props.navigation}
            />
          </View>
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

  firstSubContainer: {
    flex: 1,
  },

  secondSubContainer: {
    flex: 1,
  },

  homeLogo: {
    flex: 1,
  },

  profilePicture: {
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  userInfo: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },

  userPost: {
    flex: 8,
  },

  imageAlign: {
    marginLeft: 30,
    paddingLeft: 30,
  },

});

export default ProfileScreen;
