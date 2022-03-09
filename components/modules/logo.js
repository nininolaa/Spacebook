import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet';

class Logo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
    };
  }

  async componentDidMount() {
    this.state.token = await AsyncStorage.getItem('@session_token');
  }

  render() {
    if (this.props.size == 'large') {
      return (

        <View style={stylesIn.loginHeader}>
          <Image source={require('../../assets/img/logo.png')} style={stylesIn.logo} />
          <Image source={require('../../assets/img/Heading.png')} style={stylesIn.headingImgIndex} />
        </View>

      );
    }

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
