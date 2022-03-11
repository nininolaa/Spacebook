//import elements and components to be able to use it inside the class
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

//create a FriendScreen component which will render main friend screen in tab navigator
class Friend extends Component {
  //create a constructor
  constructor(props) {
    //passing props into the constructor to enable using this.props inside a constructors
    super(props);

    //initialise the state for each data to be able to change it overtime
    this.state = {
      user_id: 0,
      searchQuery: '',
      friendListKey: 0,
    };
  }

  //using componentDidmount to get and set the user id and
  //the friendListKey immediately after being mounted
  async componentDidMount() {
    const userId = await AsyncStorage.getItem('user_id');
    this.setState({
      user_id: userId,
      //set the friendListKey state to make the component triggers when assign this state 
      //as a key in the component in render function
      friendListKey: 1,
    });
    
    //get and set the user id and assign the random friendListKey when the focused screen changes
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

  //clean up the focusListener function in componentDidMount before being destroyed
  componentWillUnmount() {
    this.focusListener();
  }

  //navigate to the search result screen and passed in the query that want to find for to the query key
  //and also set searchIn key to all to get a result of all users 
  onSearchPress() {
    this.props.navigation.navigate('SearchResult', { query: this.state.searchQuery , searchIn: 'all' });
  }

  //navigate to the search result screen and passed in the query that want to find for to the query key
  //and also set searchIn key to friends to get a result of a user's friends only
  onSearchPressFriend() {
    this.props.navigation.navigate('SearchResult', { query: this.state.searchQuery , searchIn: 'friends' });
  }

  //calling render function and return the data that will be display 
  render() {
    //display the friend screen when the component is loaded
    if (this.state.user_id) {
      return (

        //create a flex container to make the content responsive to all screen sizes
        //by dividing each section to an appropriate flex sizes
        <View style={stylesIn.flexContainer}>
          {/* create a flex box to render spacebook logo */}
          <View style={stylesIn.homeLogo}>
            <Logo />
          </View>

          {/* create a flex box for a search bar to search for any user */} 
          <View style={stylesIn.friendSearch}>
            {/* using searchbar component to render a search bar and store the text on the search bar
            to be the string to be search for */}
            <Searchbar
              placeholder="Find users"
              onChangeText={(query) => { this.setState({ searchQuery: query }); }}
              onIconPress={() => { this.onSearchPress(); }}
            />
          </View>

          {/* create a flex box for the button that will navigate to see the user's friend request  */}  
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
          
          {/* create a flex box to display the user's friend list by calling the FriendList component  */}  
          <View style={stylesIn.friendList}>
            {/* using searchbar component to render a search bar to search for user's friend
             and store the text on the search bar to be the string to be search for */}
            <Searchbar
              style = {stylesIn.searchBar}
              placeholder="Find your friends"
              onChangeText={(query) => { this.setState({ searchQuery: query }); }}
              onIconPress={() => { this.onSearchPressFriend(); }}
            />
            {/* passing the FriendList component and given the attributes to the component
            in order to render the friend list for a given user */}
            <FriendList
              //a unique key is needed in order to trigger the component 
              key={this.state.friendListKey}
              userId={this.state.user_id}
              navigation={this.props.navigation}
            />
          </View>

        </View>

      );
    }
    //display the loading icon when the screen is still loading
    return (
      <IsLoading />
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

  searchBar:{
    marginBottom : 15,
  }
});

export default Friend;
