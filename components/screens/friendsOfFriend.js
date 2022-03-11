// import elements and components to be able to use it inside the class
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import FriendList from '../modules/friendList';
import Logo from '../modules/logo';

// create a FriendsofFriend component to render a friend list of user's friend
class FriendsOfFriend extends Component {
  // create a constructor
  constructor(props) {
    // passing props into the constructor to enable using this.props inside a constructors
    super(props);
  }

  // calling render function and return the data that will be display
  render() {
    return (

      // create a flex container to make the content responsive to all screen sizes
      // by dividing each section to an appropriate flex sizes
      <View style={stylesIn.flexContainer}>
        {/* create a flex box for rendering spacebook logo */}
        <View style={stylesIn.homeLogo}>
          <Logo />
        </View>

        {/* create a flex box to display the user's friend list by calling the FriendList component  */}
        <View style={stylesIn.mainMenu}>

          {/* passing the FriendList component and given the attributes to the component
          in order to render the friend list for a given user */}
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

// using stylesheet to design the render
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
