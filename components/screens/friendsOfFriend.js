import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FriendList from '../modules/friendList';
import Logo from '../modules/logo';

class FriendsOfFriend extends Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount() {
  //   this.setState({
  //     userId: this.props.route.params.userId,
  //   });
  //   console.log(this.props.route.params.userId);
  // }

  render() {
    return (

      <View style={stylesIn.flexContainer}>
        <View style={stylesIn.homeLogo}>
          <Logo />
        </View>

        <View style={stylesIn.mainMenu}>

          <FriendList
            key={`friendsOffriend${this.props.route.params.userId}`}
            userId={this.props.route.params.userId}
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
