import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FriendList from '../modules/friendList';
import Logo from '../modules/logo';

class FriendsOfFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      first_name: '',
      last_name: '',
      email: '',
      friend_count: '',
      post_text: '',
      userPostList: [],
      userId: 0,
    };
  }

  componentDidMount() {
    this.setState({
      userId: this.props.route.params.userId,
    });
    console.log(this.state.userId);
  }

  render() {
    return (

      <View style={stylesIn.flexContainer}>
        <View style={stylesIn.homeLogo}>
          <Logo />
        </View>

        <View style={stylesIn.mainMenu}>

          <FriendList
            userId={this.state.userId}
            navigation={this.props.navigation}
          />

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
    flex: 1,
  },

  mainMenu: {
    flex: 3,
  },

});

export default FriendsOfFriend;
