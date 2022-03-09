import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeLogo from '../modules/homeLogo';
import styles from '../modules/stylesheet';
import FriendHeading from '../modules/friendHeading';

class NonFriendScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: '',
      first_name: '',
      last_name: '',
      email: '',
      friend_count: '',
      userPostList: [],
      isLoading: true,
      alertMessage: '',
    };
  }

  addFriend = async () => {
    const token = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/user/${this.props.route.params.friendId}/friends`, {
      method: 'POST',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        switch (response.status) {
          case 201:
            throw 'OK';
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
      .then((response) => {
        this.setState({ isLoading: false });
        console.log('Request sent');
      })
      .catch((error) => {
        console.log(error);
        switch (error.errorCase) {
          case 'Unauthorised':
            this.setState({
              alertMessage: 'Unauthorised, Please login',
              isLoading: false,
            });
            break;
          case 'AlreadyAdded':
            this.setState({
              alertMessage: 'User is already added as a friend',
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

  render() {
    return (

      <View style={stylesIn.flexContainer}>

        <View style={stylesIn.homeLogo}>
          <HomeLogo />
        </View>

        <View style={stylesIn.friendProfile}>
          <FriendHeading
            friend_id={this.props.route.params.friendId}
            navigation={this.props.navigation}
          />
        </View>

        <View style={stylesIn.notFriendMeessage}>
          <Text style={stylesIn.notFriendMeessageText}> You can't view their feed until you become friends</Text>
        </View>

        <View styles={stylesIn.addFriend}>
          <TouchableOpacity
            onPress={this.addFriend}
            style={[stylesIn.actionBtn, styles.actionBtnOrange]}
          >
            <Text style={styles.actionBtnLight}>Add Friend</Text>
          </TouchableOpacity>
        </View>

        <View style={stylesIn.backToTab}>
          <TouchableOpacity
            onPress={() => { (this.props.navigation.navigate('Friends')); }}
            style={[stylesIn.actionBtn, styles.actionBtnGrey]}
          >
            <Text style={styles.actionBtnLight}>Back to your friend list</Text>
          </TouchableOpacity>
          <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
        </View>
      </View>
    );
  }
}

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

export default NonFriendScreen;
