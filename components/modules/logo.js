// import elements and components to be able to use it inside the class
import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet';

// create a logo component which will render the spacebook logo to all screens
class Logo extends Component {
  // create a constructor
  constructor(props) {
    // passing props into the constructor to enable using this.props inside a constructor
    super(props);
  }

  // calling render function and return the data that will be display
  render() {
    // check if the passed in properties size is large
    if (this.props.size == 'large') {
      // display the large logo image
      return (

        <View style={stylesIn.loginHeader}>
          <Image source={require('../../assets/img/logo.png')} style={stylesIn.logo} />
          <Image source={require('../../assets/img/Heading.png')} style={stylesIn.headingImgIndex} />
        </View>

      );
    }
    // if no props passed in, render a normal logo size
    return (

      <View style={styles.homeLogo}>
        <Image
          source={require('../../assets/img/banner.png')}
          style={[stylesIn.logoImg]}
        />
      </View>

    );
  }
}

// using stylesheet to design the render
const stylesIn = StyleSheet.create({
  loginHeader: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },

  logo: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: 100,
    height: 100,
  },

  headingImgIndex: {
    top: '50%',
    width: 300,
    height: 150,
  },

  homeLogo: {
    flex: 1,
  },

  logoImg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    resizeMode: 'contain',
  },
});

export default Logo;
