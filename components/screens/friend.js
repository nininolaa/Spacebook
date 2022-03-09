import React, { Component } from 'react';
import { Searchbar } from 'react-native-paper';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Logo from '../modules/logo';
import styles from '../modules/stylesheet';
import FriendList from '../modules/friendList';
import IsLoading from '../modules/isLoading';

class FriendScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friendId: '',
      friendRequestList: [],
      userFriendList: [],
      user_id: 0,
      alertMessage: '',
      searchQuery: '',
      friendListKey: 0,
    };
  }

  async componentDidMount() {
    const userId = await AsyncStorage.getItem('user_id');
    this.setState({
      user_id: userId,
      friendListKey: 1,
    });

    this.focusListener = this.props.navigation.addListener('focus', () => {
      AsyncStorage.getItem('user_id')
        .then((user_id) => {
          this.setState({
            user_id,
            friendListKey: Math.random(),
          });
        });
    });
  }

  componentWillUnmount() {
    this.focusListener();
  }

  onSearchPress() {
    this.props.navigation.navigate('SearchResult', { query: this.state.searchQuery, friends: this.state.userFriendList });
  }

  render() {
    if (this.state.user_id) {
      return (

        <View style={stylesIn.flexContainer}>

          <View style={stylesIn.homeLogo}>
            <Logo />
          </View>

          <View style={stylesIn.friendSearch}>
            <Searchbar
              placeholder="Find friends"
              onChangeText={(query) => { this.setState({ searchQuery: query }); }}
              onIconPress={() => { this.onSearchPress(); }}
            />
          </View>

          <View style={stylesIn.friendBtnContainer}>
            <View style={stylesIn.friendRequestBtn}>
              <TouchableOpacity
                style={[styles.friendsBtn, styles.actionBtnOrange]}
                onPress={() => { (this.props.navigation.navigate('FriendRequest')); }}
              >
                <Text style={[styles.actionBtnLight]}>See friend requests</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={stylesIn.friendList}>
            <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
            <FriendList
              key={this.state.friendListKey}
              userId={this.state.user_id}
              navigation={this.props.navigation}
            />
          </View>

        </View>

      );
    }

    return (
      <IsLoading />
    );
  }
}

const stylesIn = StyleSheet.create({

  flexContainer: {
    flex: 1,
    backgroundColor: '#fdf6e4',
  },

  homeLogo: {
    flex: 0.8,
  },

  friendSearch: {
    flex: 0.5,
    paddingHorizontal: 20,
  },

  friendBtnContainer: {
    flex: 0.5,
    flexDirection: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  allFriendBtn: {
    flex: 1,
    backgroundColor: 'pink',
  },
  friendRequestBtn: {
    flex: 1,
  },
  friendList: {
    flex: 2,
    paddingHorizontal: 20,
  },
});

export default FriendScreen;
