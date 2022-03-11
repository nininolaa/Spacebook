// import elements and components to be able to use it inside the class
import React from 'react';
import {
  View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidationComponent from 'react-native-form-validator';

import styles from '../modules/stylesheet';
import IsLoading from '../modules/isLoading';
import Logo from '../modules/logo';
import ProfileImage from '../modules/profileImage';

// create a SettingScreen component to allow a user to update their information
class SettingScreen extends ValidationComponent {
  // create a constructor
  constructor(props) {
    // passing props into the constructor to enable using this.props inside a constructors
    super(props);

    // initialise the state for each data to be able to change it overtime
    this.state = {
      user_id: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      editable: false,
      isLoading: true,
      alertMessage: '',
      imageKey: 0,

      new_first_name: '',
      new_last_name: '',
      new_email: '',
      new_password: '',
      new_password_confirm: '',
    };
  }

  // using componentDidmount to get the user id and
  // to call loadProfile function immediately after being mounted
  async componentDidMount() {
    this.state.user_id = await AsyncStorage.getItem('user_id');
    this.loadProfile();
    this.setState({
      imageKey: Math.random(),
    });

    // call loadProfile function when the focused screen changes
    this.focusListener = this.props.navigation.addListener('focus', async () => {
      // set the imageKey state to random numbers to make the component triggers when assign
      // this state as a key in the component in render function
      this.setState({
        imageKey: Math.random(),
      });
      this.loadProfile();
    });
  }

  // clean up the focusListener function in componentDidMount before being destroyed
  componentWillUnmount() {
    this.focusListener();
  }

  // create a function to call the api for getting user information
  async loadProfile() {
    // get the session token to use for authorisation when calling api
    const token = await AsyncStorage.getItem('@session_token');
    // get the user id as it is needed for api call
    const userId = await AsyncStorage.getItem('user_id');

    // using fetch function to call the api and send the get request
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'get',
      // passing the session token to be authorised
      headers: {
        'X-Authorization': token,
      },
    })
    // checking the response status after calling api
      .then((response) => {
        // return the values from the response if the calling is successful and
        // if the response status error occured, store the error reasons into the
        // object array
        switch (response.status) {
          case 200:
            return response.json();
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
      // when the promise is resolved, set all the states to be the value from the response
      // Json array and set the isLoading state to be false as the promise has been resolved
      .then((response) => {
        this.setState({
          user_id: response.user_id,
          first_name: response.first_name,
          last_name: response.last_name,
          email: response.email,
          isLoading: false,
        });
      })
      // when the promise is rejected, check which error reason from the response was and
      // set the correct error message to each error in order to render the right error message
      // also set the isLoading state to be false as the promise has been rejected
      .catch((error) => {
        console.log(error);
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

  // create a function to update user's information
  updateInfo = async () => {
    // validation check for user's information
    this.validate({
      first_name: { maxlength: 20, hasLowerCase: true },
      last_name: { maxlength: 20 },
      new_email: { email: true },
      new_password: { minlength: 6, equalPassword: this.state.new_password_confirm },
      new_password_confirm: { minlength: 6, equalPassword: this.state.new_password },
    });

    // only call the api if the validation check is passed
    if (this.isFormValid() === true) {
      // create an empty object array to store the new information that will be send for an update
      const newInfo = {};

      // only store the new information to the object array
      // when its not the same as the current information
      if (this.state.new_first_name !== this.state.first_name && this.state.new_first_name !== '') {
        newInfo.first_name = this.state.new_first_name;
      }

      if (this.state.new_last_name !== this.state.last_name && this.state.new_last_name !== '') {
        newInfo.last_name = this.state.new_last_name;
      }

      if (this.state.new_email !== this.state.email && this.state.new_email !== '') {
        newInfo.email = this.state.new_email;
      }

      if (this.state.new_password !== this.state.password && this.state.new_password !== '') {
        newInfo.password = this.state.new_password;
      }

      // get the session token and user id as it is needed when sending a request to the api
      const token = await AsyncStorage.getItem('@session_token');
      const userId = await AsyncStorage.getItem('user_id');

      // using fetch function to call the api and send the patch request
      return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
        method: 'PATCH',
        // passing the content type to tell the server that we are passing json
        // and the session token to be authorised
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
        // converted a new text to a string and pass into the body
        body: JSON.stringify(newInfo),
      })
        // checking the response status in the return promise
        .then((response) => {
          // if the response status error occured, store the error reasons into the
          // object array
          switch (response.status) {
            case 200:
              break;
            case 400:
              throw { errorCase: 'BadRequest' };
              break;
            case 401:
              throw { errorCase: 'Unauthorised' };
              break;
            case 403:
              throw { errorCase: 'Forbidden' };
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
        // when the promise is resolved, set the editable back to false as it editing is done
        // and set the isLoading state to be false as the promise has been resolved
        .then(() => {
          this.setState({
            editable: false,
            isLoading: false,
          });
          // update user's profile each time an update is made
          this.loadProfile();
        })
        // when the promise is rejected, check which error reason from the response was and
        // set the correct error message to each error in order to render the right error message
        // also set the isLoading state to be false as the promise has been rejected
        .catch((error) => {
          console.log(error);
          switch (error.errorCase) {
            case 'BadRequest':
              this.setState({
                alertMessage: 'Bad Request',
                isLoading: false,
              });
              break;

            case 'Unauthorised':
              this.setState({
                alertMessage: 'Unauthorised, Please login',
                isLoading: false,
              });
              break;
            case 'Forbidden':
              this.setState({
                alertMessage: 'Forbidden',
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
  };

  // create a function to allow a user to logout
  logout = async () => {
    // get the session token to use for authorisation when calling api
    const token = await AsyncStorage.getItem('@session_token');

    // remove the session token and user id to be able to logout
    await AsyncStorage.removeItem('@session_token');
    await AsyncStorage.removeItem('user_id');

    // using fetch function to call the api and send the post request
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      // passing the session token to be authorised
      headers: {
        'X-Authorization': token,
      },
    })
      // check the response status in the return promise
      .then((response) => {
        // if the promise is resolved navigate a user back to login screen
        // if the response status error occured, store the error reasons into the
        // object array
        switch (response.status) {
          case 200:
            return this.props.navigation.navigate('Login');
          case 401:
            return this.props.navigation.navigate('Login');
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
      .catch((error) => {
        console.log(error.message);
        switch (error.errorCase) {
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

  // if the edit button pressed, set the text inputs to be editable
  editPost() {
    this.setState({ editable: true });
  }

  // return the value of editable when this function is called
  isEditMode() {
    return this.state.editable;
  }

  // calling render function and return the data that will be display
  render() {
    // check if the function is still loading
    // if it does, render the loading icon
    if (this.state.isLoading === true) {
      return (
        <IsLoading />
      );
    }
    // render the main screen when the functions are ready
    return (
      // create a flex container to make the content responsive to all screen sizes
      // by dividing each section to an appropriate flex sizes and using a ScrollView
      // to make the screen scrollable
      <ScrollView style={stylesIn.flexContainer}>
        {/* create a flex box for rendering spacebook logo */}
        <View style={stylesIn.homeLogo}>
          <Logo />
        </View>

        {/* create a container for user's imagee and information */}
        <View style={stylesIn.userProfile}>
          {/* create a container to render user's profile image */}
          <View style={stylesIn.userImage}>
            {/* passing the profileImage component and given the attributes to the component
            in order to render the right profile image and right size */}
            <ProfileImage
              key={this.state.imageKey}
              userId={this.state.user_id}
              isEditable
              width={100}
              height={100}
              navigation={this.props.navigation}
            />
          </View>

          {/* create a container to render user's information */}
          <View style={stylesIn.userDetails}>
            <Text style={styles.profileText}>
              ID:
              {this.state.user_id}
            </Text>
            <Text style={styles.profileText}>
              {this.state.first_name}
              {' '}
              {this.state.last_name}
              {' '}
            </Text>
          </View>
        </View>

        {/* create a container to render the text inputs for a user to edit and update */}
        <View style={stylesIn.userUpdateDetails}>

          <Text style={styles.postHeaderText}>Edit Profile </Text>

          {/* create a text input to allow a user to see their current firstname and edit it */}
          <Text style={stylesIn.userDetailsText}>First Name: </Text>
          <TextInput
            style={[stylesIn.userDetailsText, styles.updateInput]}
            placeholder={this.state.first_name}
            onChangeText={(new_first_name) => this.setState({ new_first_name })}
            editable={this.state.editable}
          />
          {/* display the error of the first name validation */}
          {this.isFieldInError('first_name') && this.getErrorsInField('first_name').map((errorMessage) => (
            <Text key={errorMessage} style={styles.loginErrorText}>
              {errorMessage}
              {' '}
            </Text>
          ))}

          {/* create a text input to allow a user to see their current lastname and edit it */}
          <Text style={stylesIn.userDetailsText}>Last Name: </Text>
          <TextInput
            style={[stylesIn.userDetailsText, styles.updateInput]}
            placeholder={this.state.last_name}
            onChangeText={(new_last_name) => this.setState({ new_last_name })}
            editable={this.state.editable}
          />
          {/* display the error of the last name validation */}
          {this.isFieldInError('new_last_name') && this.getErrorsInField('new_last_name').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>Your last name should not be more than 50 characters</Text>)}

          {/* create a text input to allow a user to see their current email and edit it */}
          <Text style={stylesIn.userDetailsText}>Email:</Text>
          <TextInput
            style={[stylesIn.userDetailsText, styles.updateInput]}
            placeholder={this.state.email}
            onChangeText={(new_email) => this.setState({ new_email })}
            editable={this.state.editable}
          />
          {/* display the error of the email validation */}
          {this.isFieldInError('new_email') && this.getErrorsInField('new_email').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>Please enter a valid email address</Text>)}

          {/* create a text input to allow a user to change their password */}
          <Text style={stylesIn.userDetailsText}>Password:</Text>
          <TextInput
            style={[stylesIn.userDetailsText, styles.updateInput]}
            placeholder="Enter new password..."
            onChangeText={(new_password) => this.setState({ new_password })}
            value={this.state.new_password}
            secureTextEntry
            editable={this.state.editable}
          />
          {/* display the error of the password validation */}
          {this.isFieldInError('new_password') && this.getErrorsInField('new_password').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>{errorMessage}</Text>)}

          {/* create a text input to allow a user to confirm their new password */}
          <TextInput
            style={[stylesIn.userDetailsText, styles.updateInput]}
            placeholder="Confirm your new password..."
            onChangeText={(new_password_confirm) => this.setState({ new_password_confirm })}
            value={this.state.new_password_confirm}
            secureTextEntry
            editable={this.state.editable}
          />
          {/* display the error of the password validation , the new password and confirm new password should be match */}
          {this.isFieldInError('new_password_confirm') && this.getErrorsInField('new_password_confirm').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>{errorMessage}</Text>)}

          {/* create a container for displaying the edit and update button */}
          {/* when the edit button is pressed, the update button will toggle to let the user update any information */}
          <TouchableOpacity
            onPress={() => this.editPost()}
            style={[stylesIn.editBtn, stylesIn.editBtnColor, !this.isEditMode() ? styles.showEdit : styles.hideEdit]}
          >
            <Text style={[stylesIn.editBtnText]}>Edit information</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.updateInfo()}
            style={[stylesIn.editBtn, stylesIn.updateBtnColor, this.isEditMode() ? styles.showEdit : styles.hideEdit]}
          >
            <Text style={[stylesIn.editBtnText]}>Update information</Text>
          </TouchableOpacity>

          {/* passing the alertMessage state to display the error message */}
          <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>

          {/* display a button to allow a user to log out */}
          <TouchableOpacity
            onPress={() => { this.logout(); }}
            style={[styles.loginButton, stylesIn.logoutBtn]}
          >
            <Text>Sign Out</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    );
  }
}

// using stylesheet to design the render
const stylesIn = StyleSheet.create({

  flexContainer: {
    flex: 1,
    backgroundColor: '#fdf6e4',
    paddingHorizontal: 10,
  },

  homeLogo: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  userProfile: {
    flex: 1,
    flexDirection: 'row',

  },

  userImage: {
    flex: 1,
    marginLeft: 10,
  },

  userDetails: {
    flex: 1.8,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  userUpdateDetails: {
    flex: 2,
  },

  logoutBtn: {
    marginTop: 50,
    marginLeft: '30%',
    height: 30,
  },

  userDetailsText: {
    fontSize: 15,
    placeholderTextColor: '#000000',
  },

  editBtn: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 5,
    width: '30%',
    padding: 5,
  },

  editBtnColor: {
    backgroundColor: '#9c5304',
    borderColor: '#9c5304',
  },

  updateBtnColor: {
    backgroundColor: '#63c5da',
    borderColor: '#63c5da',
  },

  editBtnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
  },
});

export default SettingScreen;
