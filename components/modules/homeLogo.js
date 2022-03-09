import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

class HomeLogo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (

      <View style={stylesIn.homeLogo}>
        <Image
          source={require('../../assets/img/banner.png')}
          style={[stylesIn.logoImg]}
        />
      </View>

    );
  }
}

const stylesIn = StyleSheet.create({
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

export default HomeLogo;
