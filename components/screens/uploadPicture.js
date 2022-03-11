// import elements and components to be able to use it inside the class
import { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

// create UploadPicture component to allow user to take a picture
class UploadPicture extends Component {
  // create a constructor
  constructor(props) {
    // passing props into the constructor to enable using this.props inside a constructors
    super(props);

    // initialise the state for each data to be able to change it overtime
    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.front,
      alertMessage: '',
    };
  }

  // using componentDidmount to invoked the camera permission status immediately after being mounted
  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

  // create a function to send a picture to an api
  uploadImage = async (data) => {
    // get the user id as it is needed for api call
    const token = await AsyncStorage.getItem('@session_token');
    // get the session token to use for authorisation when calling api
    const userId = await AsyncStorage.getItem('user_id');

    // convert a base64 string to a blob before sending the image to an api
    const res = await fetch(data.base64);
    const blob = await res.blob();

    // using fetch function to call the api and send the a post request
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
      method: 'POST',
      // passing the content type to tell the server that we are passing png file
      // and the session token to be authorised
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': token,
      },
      body: blob,
    })
      // checking the response status in the return promise
      .then((response) => {
        // navigate a user back to their profile if the calling is successful and
        // if the response status error occured, store the error reasons into the
        // object array
        switch (response.status) {
          case 200:
            this.props.navigation.navigate('Profile');
            break;
          case 400:
            throw { errorCase: 'BadRequest' };
            break;
          case 401:
            throw { errorCase: 'Unauthorised' };
            break;
          case 404:
            throw { errorCase: 'NotFound' };
            break;
          case 500:
            throw { errorCase: 'ServerError' };
            break;
          default:
            throw { errorCase: 'WentWrong' };
            break;
        }
      })
      // when the promise is rejected, check which error reason from the response was and
      // set the correct error message to each error in order to render the right error message
      // also set the isLoading state to be false as the promise has been rejected
      .catch((err) => {
        console.log(err);
        switch (error.errorCase) {
          case 'BadRequest':
            this.setState({
              alertMessage: 'Bad request, please try again',
              isLoading: false,
            });
            break;
          case 'Unauthorised':
            this.setState({
              alertMessage: 'Unauthorised, please login',
              isLoading: false,
            });
            break;
          case 'NotFound':
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
  };

  // create a function to capture the picture from camera
  takePicture = async () => {
    // set the picture quality and convert the image into base64
    // which convert an image to be a readable string
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        // transfer the image data to the function for sending a picture to the api
        onPictureSaved: (data) => this.uploadImage(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  // calling render function and return the data that will be display
  render() {
    return (
      // create a container for camera to be display
      <View style={styles.container}>
        {/* using the camera element and set the deefault camera to front camera */}
        <Camera
          style={styles.camera}
          type={this.state.type}
          ref={(ref) => { this.camera = ref; }}
        >
          {/* create a container to store a flip camera and take picture buttons */}
          <View style={styles.buttonContainer}>
            {/* create a container for flip camera button and toggle the camera side each time the flip button is pressed */}
            <View style={styles.flipButtonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  const type = type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back;

                  this.setState({ type });
                }}
              >
                <Text style={styles.text}> Flip </Text>
              </TouchableOpacity>
            </View>

            {/* create a container to render a button for taking picture */}
            <View style={styles.captureButtonContainer}>
              <TouchableOpacity
                onPress={() => { this.takePicture(); }}
              >
                <Text style={styles.text}>Take Picture</Text>
              </TouchableOpacity>
              {/* passing the alertMessage state to display the error message */}
              <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
            </View>
          </View>
        </Camera>
      </View>
    );
  }
}

// using stylesheet to design the render
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },

  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'flex-end',
    alignItems: 'space-around',
  },

  flipButtonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  captureButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },

  button: {
    flex: 0.1,
  },

  text: {
    fontSize: 18,
    color: 'black',
    fontWeight: 3,
  },
});

export default UploadPicture;
