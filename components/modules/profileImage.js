import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet';

class ProfileImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profileImage: '',
      alertMessage: '',
    };
  }

  componentDidMount() {
    if (this.props.userId) this.getImage();
  }

  async getImage() {
    const token = await AsyncStorage.getItem('@session_token');

    fetch(`http://localhost:3333/api/1.0.0/user/${this.props.userId}/photo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': token,
      },
    })

      .then((response) => {
        switch (response.status) {
          case 200:
            return response.blob();
            break;
          case 401:
            throw { errorCase: 'Unauthorised' };
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
      .then((resBlob) => {
        this.setState({
          profileImage: URL.createObjectURL(resBlob),
        });
      })
      .catch((error) => {
        console.log('error', error);
        switch (error.errorCase) {
          case 'Unauthorised':
            this.setState({
              alertMessage: 'Unauthorised, Please login',
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
  }

  render() {
    if (this.props.isEditable == false) {
      return (
        <View>
          <Image
            source={{
              uri: this.state.profileImage,
            }}
            style={{
              width: this.props.width,
              height: this.props.height,
            }}
          />
        </View>
      );
    }

    return (
      <View style={stylesIn.container}>
        <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
        <Image
          source={{
            uri: this.state.profileImage,
          }}
          style={{
            width: this.props.width,
            height: this.props.height,
          }}
        />

        <TouchableOpacity
          style={[styles.navigateBtn, stylesIn.btnWidth]}
          onPress={() => { this.props.navigation.navigate('UploadPicture'); }}
        >
          <Text style={styles.navigateBtnText}>Upload profile picture</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

export default ProfileImage;

const stylesIn = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },

  btnWidth: {
    width: 150,
    marginTop: 5,
  },
});
