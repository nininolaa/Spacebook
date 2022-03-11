// import elements and components to be able to use it inside the class
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './stylesheet';

// create a profileImage component which will be able to render a profile image
// of any user depends on the passed in user id
class ProfileImage extends Component {
  // create a constructor
  constructor(props) {
    // passing props into the constructor to enable using this.props inside a constructor
    super(props);
    // initialise the state for each data to be able to change it overtime
    this.state = {
      profileImage: '',
      alertMessage: '',
    };
  }

  // using componentDidmount to invoked the getImage function immediately after being mounted
  // when the user id is passeed in
  componentDidMount() {
    if (this.props.userId) this.getImage();
  }

  // create a getImage function to call the api for getting the image of a given user
  async getImage() {
    // get the session token to use for authorisation when calling api
    const token = await AsyncStorage.getItem('@session_token');

    // calling the api and passing the user id
    fetch(`http://localhost:3333/api/1.0.0/user/${this.props.userId}/photo`, {
      // passing get method in order to get the user profile image
      method: 'GET',
      // passing the content type and the session token to be authorised
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': token,
      },
    })

      // checking the response status after calling api
      .then((response) => {
        // return the values from the response if the calling is successful and
        // if the response status error occured, store the error reasons into the
        // array objects
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
      // convert the response blob ti base64 string and
      // store it in the profileImage state which will be the
      // image uri source
      .then((resBlob) => {
        this.setState({
          profileImage: URL.createObjectURL(resBlob),
        });
      })
      // when the promise is rejected, check which error reason from the response was and
      // set the correct error message to each error in order to render the right error message
      .catch((error) => {
        console.log('error', error);
        switch (error.errorCase) {
          case 'Unauthorised':
            this.setState({
              alertMessage: 'Unauthorised, Please login',
            });
            break;

          case 'UserNotFound':
            this.setState({
              alertMessage: 'Not found',
            });
            break;
          case 'ServerError':
            this.setState({
              alertMessage: 'Cannot connect to the server, please try again',
            });
            break;
          case 'WentWrong':
            this.setState({
              alertMessage: 'Something went wrong, please try again',
            });
            break;
        }
      });
  }

  // calling render function and return the data that will be display
  render() {
    // if the passed in prop for isEditable is false,
    // display only the user's profile image
    if (this.props.isEditable == false) {
      return (
        // create a container for profile image
        <View>
          {/* passing the alertMessage state to alert the error message */}

          {/* passed in the image source and the required width and height for the image to be display */}
          <Image
            source={{
              uri: this.state.profileImage,
            }}
            style={{
              width: this.props.width,
              height: this.props.height,
            }}
          />
          <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
        </View>
      );
    }
    // if isEditable is true, display the user's profile image
    // and a button for uploading the profile image
    return (
      // create a container for profile image
      <View style={stylesIn.container}>
        {/* passing the alertMessage state to alert the error message */}
        <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
        {/* passed in the image source and the required width and height for the image to be display */}
        <Image
          source={{
            uri: this.state.profileImage,
          }}
          style={{
            width: this.props.width,
            height: this.props.height,
          }}
        />

        {/* display a button that navigate a user to the screen for uploading a profile image */}
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

// using stylesheet to design the render
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
export default ProfileImage;
