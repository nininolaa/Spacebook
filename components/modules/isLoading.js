//import elements to be able to use it inside the class
import React, { Component } from 'react';
import {
  View, StyleSheet, ActivityIndicator, Text,
} from 'react-native';

//create isLoading component which will render a loading icon when the screen is still loading
class IsLoading extends Component {
  //create a constructor
  constructor(props) {
    //passing props into the constructor to enable using this.props inside a constructor
    super(props);
  }

  //calling render function and return the data that will be display 
  render() {
    return (
      // create a container for loading icon
      <View style={stylesIn.loadingBox}>
        {/* using an element for loading icon and style it to the appropriate size and colour */}
        <ActivityIndicator
          size="large"
          color="orange"
        />
        {/* add text to let users know that the screen is still loading */}
        <Text>Loading..</Text>
      </View>
    );
  }
}

//using stylesheet to design the render
const stylesIn = StyleSheet.create({
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default IsLoading;
