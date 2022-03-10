//import elements and components to be able to use it inside the class
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './stylesheet';
import ProfileImage from './profileImage';
import IsLoading from './isLoading';


function FriendList(props) {
  const [alertMessage, setAlert] = useState();
  const [isLoading, setLoading] = useState();
  const [userFriendList, setList] = useState();

  useEffect(() => {
    let isSubscribed = true;
    AsyncStorage.getItem('@session_token')
      .then((token) => {
        fetch(`http://localhost:3333/api/1.0.0/user/${props.userId}/friends`, {
          method: 'get',
          headers: {
            'X-Authorization': token,
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
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
          .then((responseJson) => {
            if (isSubscribed) {
              setList(responseJson);
              setLoading(false);
            }
          })
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

  if (isLoading == true) {
    return (
      <IsLoading />
    );
  }

  return (

    <View style={stylesIn.flexContainer}>

      <Text style={styles.postHeaderText}>Friends:</Text>
      <Text style={styles.errorMessage}>{alertMessage}</Text>
      <FlatList
        // calling the array
        data={userFriendList}

        // specify the item that we want to show on the list
        renderItem={({ item }) => (
          <View style={[styles.inPostContainer, styles.postBox]}>
            <View style={styles.inPostImage}>
              <ProfileImage
                userId={item.user_id}
                isEditable={false}
                width={50}
                height={50}
                navigation={props.navigation}
              />
            </View>
            <View style={styles.inPostHeader}>
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
        keyExtractor={(item) => item.user_id.toString()}
      />
    </View>
  );
}

const stylesIn = StyleSheet.create({

  flexContainer: {
    flex: 1,
    backgroundColor: '#fdf6e4',
  },

});

export default FriendList;
