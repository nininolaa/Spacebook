// import elements and components to be able to use it inside the class
import React from 'react';
import {
  View, TextInput, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import ValidationComponent from 'react-native-form-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../modules/logo';
import styles from '../modules/stylesheet';

// create a Login component to let the user login to their account
class Login extends ValidationComponent {
  // create a constructor
  constructor(props) {
    // passing props into the constructor to enable using this.props inside a constructors
    super(props);

    // initialise the state for each data to be able to change it overtime
    this.state = {
      email: '',
      password: '',
      alertMessage: '',
    };
  }

  // create a sign in function to call the api for access to login
  SignInButtonPressed = async () => {
    // validation check for email and password
    this.validate({
      email: { required: true },
      password: { required: true },
    });

    // only call the api if the validation check is passed
    if (this.isFormValid() == true) {
      // using fetch function to call the api and send the post request
      return fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'post',
        // passing the content type to tell the server that we are passing json
        headers: {
          'Content-Type': 'application/json',
        },
        // convert the email and password in the state to a string and pass into the body
        body: JSON.stringify(this.state),
      })
        // checking the response status in the return promise
        .then((response) => {
          // return the values from the response if the calling is successful and
          // if the response status error occured, store the error reasons into the
          // object array
          switch (response.status) {
            case 200:
              return response.json();
              break;
            case 400:
              throw { errorCase: 'InvalidInfo' };
              break;
            case 500:
              throw { errorCase: 'ServerError' };
              break;
            default:
              throw { errorCase: 'WentWrong' };
              break;
          }
        })
        // when the promise is resolved, set the value response token and
        // the value of the user id to the keys and navigate the user to the index screen
        // which index screen will let the user enter the main screen if the user is logged in
        .then(async (responseJson) => {
          await AsyncStorage.setItem('@session_token', responseJson.token);
          await AsyncStorage.setItem('user_id', responseJson.id);
          this.props.navigation.navigate('Home');
        })
        // when the promise is rejected, check which error reason from the response was and
        // set the correct error message to each error in order to render the right error message
        .catch((error) => {
          console.log(error);
          switch (error.errorCase) {
            case 'InvalidInfo':
              this.setState({
                alertMessage: 'Invalid email or password',
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
  };

  // set the user's input email into the email in state
  handleEmailInput = (email) => {
    this.setState({ email });
  };

  // set the user's input password into the password state
  handlePasswordInput = (pass) => {
    this.setState({ password: pass });
  };

  // calling render function and return the data that will be display
  render() {
    return (

      // create a flex container to make the content responsive to all screen sizes
      // by dividing each section to an appropriate flex sizes
      <View style={styles.flexContainer}>

        {/* create a flex box to render spacebook logo */}
        <View style={styles.homeLogo}>
          {/* assign logo size to large as it logo for non-login screens are larger */}
          <Logo
            size="large"
          />
        </View>

        {/* create a flex box to provide text input boxes for a user to login */}
        <View style={stylesIn.loginRow}>
          <Text style={styles.loginHeading}>Sign In</Text>
          {/* create a text input for entering the email address */}
          <TextInput
            style={styles.loginInput}
            placeholder="email..."
            onChangeText={this.handleEmailInput}
            value={this.state.email}
          />
          {/* display the error message from email validation */}
          {this.isFieldInError('email') && this.getErrorsInField('email').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>An email is required</Text>)}

          {/* create a text input for entering password */}
          <TextInput
            style={styles.loginInput}
            placeholder="password..."
            onChangeText={this.handlePasswordInput}
            value={this.state.password}
            secureTextEntry
          />
          {/* display the error message from password validation */}
          {this.isFieldInError('password') && this.getErrorsInField('password').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>A password is required</Text>)}
        </View>

        {/* create a container for login button */}
        <View style={styles.loginButtonRow}>

          {/* call the sign in function when the login button is pressed */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => { this.SignInButtonPressed(); }}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
          {/* passing the alertMessage to display the error message */}
          <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
        </View>

        {/* create a container to allow a user to go to the register screen */}
        <View style={styles.endTextRow}>
          {/* navigate a user to register screen when the text is clicked */}
          <Text>
            Haven't Register?
            <Text onPress={() => { this.props.navigation.navigate('Register'); }} style={styles.linkText}>Click here</Text>
            {' '}
            to create an account
          </Text>
        </View>

      </View>

    );
  }
}

// using stylesheet to design the render
const stylesIn = StyleSheet.create({

  flexContainer: {
    flex: 1,
  },

  loginRow: {
    flex: 50,
    marginTop: '10%',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#ffaf7a',
    borderRadius: 20,

  },

});

export default Login;
