// import elements and components to be able to use it inside the class
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../modules/logo';
import IsLoading from '../modules/isLoading';
import styles from '../modules/stylesheet';
import ProfileImage from '../modules/profileImage';

// create a FriendRequest component to render user's friend request list
class FriendRequest extends Component {
  // create a constructor
  constructor(props) {
    // passing props into the constructor to enable using this.props inside a constructors
    super(props);

    // initialise the state for each data to be able to change it overtime
    this.state = {
      friendId: '',
      friendRequestList: [],
      isLoading: true,
      alertMessage: '',
    };
  }

  // using componentDidmount  to call userPost function
  // immediately after being mounted
  componentDidMount() {
    this.friendRequests();
  }

  // create a function to get a friend request list of a user
  friendRequests = async () => {
    // get the session token  as it is needed for authorisation
    const token = await AsyncStorage.getItem('@session_token');

    // using fetch to call the api and send the get request
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      method: 'get',
      // passing the session token to be authorised
      headers: {
        'X-Authorization': token,
      },
    })
      // checking the response status in the return promise
      .then((response) => {
        // return the values from the response if the calling is successful and
        // if the response status error occured, store the error reasons into the object array
        switch (response.status) {
          case 200:
            return response.json();
            break;
          case 401:
            throw { errorCase: 'Unauthorised' };
            break;
          case 500:
            throw { errorCase: 'ServerError' };
            break;
          default:
            throw { errorCase: 'WentWrong' };
            break;
        }
      })
      // when the promise is resolved, store the response Json array to the friendRequestList state
      // and set the isLoading state to be false as the promise has been resolved
      .then((responseJson) => {
        this.setState({
          friendRequestList: responseJson,
          isLoading: false,
        });
      })
      // when the promise is rejected, check which error reason from the response was and
      // set the correct error message to each error in order to render the right error message
      // also set the isLoading state to be false as the promise has been rejected
      .catch((error) => {
        console.log(error);
        switch (error.errorCase) {
          case 'Unauthorised':
            this.setState({
              alertMessage: 'Unauthorised, Please login',
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

  // create a function to accept a friend request
  acceptFriend = async (user_id) => {
    // get the session token as it is needed for authorisation
    const token = await AsyncStorage.getItem('@session_token');

    // using fetch to call the api and send the get request
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${user_id}`, {
      method: 'post',
      headers: {
        // passing the session token to be authorised
        'X-Authorization': token,
      },
    })
      // return the values from the response if the calling is successful and
      // if the response status error occured, store the error reasons into the object array
      .then((response) => {
        switch (response.status) {
          case 200:
            break;
          case 401:
            throw { errorCase: 'Unauthorised' };
            break;
          case 404:
            throw { errorCase: 'Not Found' };
            break;
          case 500:
            throw { errorCase: 'ServerError' };
            break;
          default:
            throw { errorCase: 'WentWrong' };
            break;
        }
      })
    // when the promise is resolved, set the isLoading state to be false
    // and update the friend request list
      .then(() => {
        this.setState({
          isLoading: false,
        });
        this.friendRequests();
      })
      // when the promise is rejected, check which error reason from the response was and
      // set the correct error message to each error in order to render the right error message
      // also set the isLoading state to be false as the promise has been rejected
      .catch((error) => {
        console.log(error);
        switch (error.errorCase) {
          case 'Unauthorised':
            this.setState({
              alertMessage: 'Unauthorised, Please login',
              isLoading: false,
            });
            break;
          case 'Not Found':
            this.setState({
              alertMessage: 'Error, Not Found',
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

  // create a function to reject a friend request
  removeFriend = async (user_id) => {
    // get the session token  as it is needed for authorisation
    const token = await AsyncStorage.getItem('@session_token');
    // using fetch to call the api and send the delete request
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${user_id}`, {
      method: 'delete',
      // passing the session token to be authorised
      headers: {
        'X-Authorization': token,
      },
    })
      // return the values from the response if the calling is successful and
      // if the response status error occured, store the error reasons into the object array
      .then((response) => {
        switch (response.status) {
          case 200:
            break;
          case 401:
            throw { errorCase: 'Unauthorised' };
            break;
          case 404:
            throw { errorCase: 'Not Found' };
            break;
          case 500:
            throw { errorCase: 'ServerError' };
            break;
          default:
            throw { errorCase: 'WentWrong' };
            break;
        }
      })
      // when the promise is resolved, set the isLoading state to be false
      // and update the friend request list
      .then(() => {
        this.setState({
          isLoading: false,
        });
        this.friendRequests();
      })
      // when the promise is rejected, check which error reason from the response was and
      // set the correct error message to each error in order to render the right error message
      // also set the isLoading state to be false as the promise has been rejected
      .catch((error) => {
        console.log(error);
        switch (error.errorCase) {
          case 'Unauthorised':
            this.setState({
              alertMessage: 'Unauthorised, Please login',
              isLoading: false,
            });
            break;
          case 'Not Found':
            this.setState({
              alertMessage: 'Error, Not Found',
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

  // calling render function and return the data that will be display
  render() {
    // display the loading icon if the functions are still loading
    if (this.state.isLoading == true) {
      return (
        <IsLoading />
      );
    }
    // display the screen when the components are ready
    return (

      // create a flex container to make the content responsive to all screen sizes
      // by dividing each section to an appropriate flex sizes
      <View style={stylesIn.flexContainer}>
        {/* create a flex box for rendering spacebook logo */}
        <View style={stylesIn.homeLogo}>
          <Logo />
        </View>

        <View style={stylesIn.mainContext}>
          {/* passing the alertMessage state to alert the error message */}
          <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
          <Text style={styles.postHeaderText}>Your friend requests:</Text>

          {/* using flatlist component to show the list of friend request as flatlist makes the list scrollable */}
          <FlatList
            // store the list into the data before rendering each item
            data={this.state.friendRequestList}

            renderItem={({ item }) => (
              // create a container for each friend request
              <View style={styles.postBox}>
                {/* create a sub-container that contain a profile image and post information */}
                <View style={styles.inPostContainer}>
                  {/* create a container to render profile image */}
                  <View style={styles.inPostImage}>
                    {/* passing the profileImage component and given the attributes to the component
                    in order to render the right profile image and right size */}
                    <ProfileImage
                      userId={item.user_id}
                      isEditable={false}
                      width={50}
                      height={50}
                      navigation={this.props.navigation}
                    />
                  </View>
                  {/* create a container to render friend's information */}
                  <View style={styles.inPostHeader}>
                    {/* display a user name and make the name clickable to let the user be able to see
                    the profile of the person who want to be friend with first before accept or reject */}
                    <Text
                      style={styles.postNameText}
                      onPress={() => { this.props.navigation.navigate('FriendProfile', { friendId: item.user_id }); }}
                    >
                      {item.first_name}
                      {' '}
                      {item.last_name}
                      {' '}

                    </Text>
                  </View>
                </View>

                {/* create a container for displaying accept and reject button */}
                <View style={stylesIn.btnContainer}>
                  {/* create a button container for accept button */}
                  <View style={styles.btnContainer1}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnGreen]}
                      onPress={() => this.acceptFriend(item.user_id)}
                    >
                      <Text style={[styles.actionBtnLight]}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                  {/* create a button container for reject button */}
                  <View style={styles.btnContainer2}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnRed]}
                      onPress={() => this.removeFriend(item.user_id)}
                    >
                      <Text style={styles.actionBtnLight}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            // set the user id to be the unique key for each item
            keyExtractor={(item) => item.user_id.toString()}
          />
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
    paddingHorizontal: 20,
  },

  homeLogo: {
    flex: 1,
  },

  mainContext: {
    flex: 3,
  },

  btnContainer: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'row',
  },

});

export default FriendRequest;
