// import elements and components to be able to use it inside the class
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './stylesheet';
import ProfileImage from './profileImage';
import IsLoading from './isLoading';

// In this component, I changed from class component to a function component. As it got a warning whenn toggling between tabs.
// It trying to update the setState on the component that is no longer exist which causes no-op error because something that is
// Asychronous was being callback after a component was being unloaded. So I try to utilise the useEffect which does allow to track
// if the component was loaded or not to try to fix that error but I still got that error warning.

// create a function to render a friend list of a given user
function FriendList(props) {
  // initialise the state for each data to be able to change it overtime
  const [alertMessage, setAlert] = useState();
  const [isLoading, setLoading] = useState();
  const [userFriendList, setList] = useState();

  // using useEffect to perform side effects
  useEffect(() => {
    let isSubscribed = true;

    // get the session token to use for authorisation when calling api
    AsyncStorage.getItem('@session_token')
      .then((token) => {
        // using fetch function to call the api and send the get request
        fetch(`http://localhost:3333/api/1.0.0/user/${props.userId}/friends`, {
          method: 'get',
          headers: {
            // passing the session token to be authorised
            'X-Authorization': token,
          },
        })
          // checking the response status after calling api
          .then((response) => {
            // return the values from the response if the calling is successful and
            // if the response status error occured, store the error reasons into the
            // object array
            switch (response.status) {
              case 200:
                return response.json();
                break;
              case 401:
                throw { errorCase: 'Unauthorised' };
                break;
              case 403:
                throw { errorCase: 'ViewFriend' };
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
          // when the promise is resolved, set friendList state to be the value from the response Json array
          // and set the isLoading state to be false as the promise has been resolved
          .then((responseJson) => {
            if (isSubscribed) {
              setList(responseJson);
              setLoading(false);
            }
          })
          // when the promise is rejected, check which error reason from the response was and
          // set the correct error message to each error in order to render the right error message
          // also set the isLoading state to be false as the promise has been rejected
          .catch((error) => {
            console.log(error);
            if (isSubscribed) {
              switch (error.errorCase) {
                case 'Unauthorised':
                  setAlert('Unauthorised, Please login');
                  setLoading(false);
                  break;
                case 'ViewFriend':
                  setAlert('Can only view the friends of yourself or your friends');
                  setLoading(false);
                  break;
                case 'UserNotFound':
                  setAlert('Not found');
                  setLoading(false);
                  break;
                case 'ServerError':
                  setAlert('Cannot connect to the server, please try again');
                  setLoading(false);
                  break;
                case 'WentWrong':
                  setAlert('Something went wrong, please try again');
                  setLoading(false);
                  break;
              }
            }
          });
      });
    return () => {
      isSubscribed = false;
    };
  }, [props.userId]);

  // check if the function is still loading
  // if it does, render the loading icon
  if (isLoading == true) {
    return (
      <IsLoading />
    );
  }

  // render the main screen when the functions are ready
  return (

    // create a flex container to make the content responsive to all screen sizes
    // by dividing each section to an appropriate flex sizes
    <View style={stylesIn.flexContainer}>

      <Text style={styles.postHeaderText}>Friends:</Text>

      {/* passing the alertMessage state to display the error message */}
      <Text style={styles.errorMessage}>{alertMessage}</Text>

      {/* using flatlist component to show the friend list as flatlist makes the list scrollable */}
      <FlatList
        // store the list into the data before rendering each item
        data={userFriendList}

        renderItem={({ item }) => (
          // create a container for each single post
          <View style={[styles.inPostContainer, styles.postBox]}>
            {/* create a container to render profile image */}
            <View style={styles.inPostImage}>
              {/* passing the profileImage component and given the attributes to the component
              in order to render the right profile image and right size */}
              <ProfileImage
                userId={item.user_id}
                isEditable={false}
                width={50}
                height={50}
                navigation={props.navigation}
              />
            </View>
            {/* create a container to render the user information */}
            <View style={styles.inPostHeader}>
              {/* make the name of each user clickable, and allow a user to visit their profile when click on their name  */}
              <Text
                onPress={() => { props.navigation.navigate('FriendProfile', { friendId: item.user_id }); }}
                style={styles.postNameText}
              >
                {' '}
                {item.user_givenname}
                {' '}
                {item.user_familyname}
                {' '}
                {'\n'}
              </Text>
            </View>
          </View>
        )}
        // set the user id to be the unique key for each item
        keyExtractor={(item) => item.user_id.toString()}
      />
    </View>
  );
}

// using stylesheet to design the render
const stylesIn = StyleSheet.create({

  flexContainer: {
    flex: 1,
    backgroundColor: '#fdf6e4',
  },

});

export default FriendList;
