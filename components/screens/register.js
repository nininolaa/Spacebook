//import elements and components to be able to use it inside the class
import React from 'react';
import {
  View, TextInput, Button, Text, StyleSheet,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import ValidationComponent from 'react-native-form-validator';
import Logo from '../modules/logo';
import styles from '../modules/stylesheet';

//create a Register component which will allow a user to create an account
class Register extends ValidationComponent {
  //create a constructor
  constructor(props) {
    //passing props into the constructor to enable using this.props inside a constructors
    super(props);

    //initialise the state for each data to be able to change it overtime
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: '',
      showAlert: false,
      alertMessage: '',
    };
  }

  //create a register function to call the api for create an account
  RegisterButtonPressed = () => {
    //validation check for first name, last name , email and password
    this.validate({
      first_name: { required: true, maxlength: 50 },
      last_name: { required: true, maxlength: 50 },
      email: { required: true, email: true },
      password: { required: true, minlength: 6 },
      password_confirm: { required: true, equalPassword: this.state.password },
    });

    //only call the api if the validation check is passed 
    if (this.isFormValid() == true) {
      //using fetch function to call the api and send the post request
      return fetch('http://localhost:3333/api/1.0.0/user', {
        method: 'post',
        //passing the content type to tell the server that we are passing json
        headers: {
          'Content-Type': 'application/json',
        },
        //convert the firstname, lastname, email and password 
        //in the state to a string and pass into the body
        body: JSON.stringify(this.state),
      })
        //checking the response status in the return promise
        .then((response) => {
          //return the values from the response if the calling is successful and
          //if the response status error occured, store the error reasons into the 
          //object array
          switch (response.status) {
            case 201:
              return response.json();
              break;
            case 400:
              throw { errorMsg: 'Duplicate' };
              break;
            case 500:
              throw { errorMsg: 'ServerError' };
              break;
            default:
              throw { errorMsg: 'WentWrong' };
              break;
          }
        })
        //when the promise is resolved, navigate a user to a login screen 
        .then(() => {
          this.props.navigation.navigate('Login');
        })
        //when the promise is rejected, check which error reason from the response was and
        //set the correct error message to each error in order to render the right error message
        .catch((error) => {
          console.log(error);
          switch (error.errorMsg) {
            case 'Duplicate':
              this.setState({
                alertMessage: 'This user  is already exist, please try to register with a new email address',
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

  //set the user's input firstname into the first_name in state
  handleFirstNameInput = (first_name) => {
    this.setState({ first_name: first_name });
  };

  //set the user's input lastname into the last_name in state
  handleLastNameInput = (last_name) => {
    this.setState({ last_name: last_name });
  };

  //set the user's input email into the email in state
  handleEmailInput = (email) => {
    this.setState({ email: email });
  };

  //set the user's input password into the password state
  handlePasswordInput = (pass) => {
    this.setState({ password: pass });
  };

  //set the user's input confirm password into the password_confirm state
  handleConfirmPasswordInput = (pass) => {
    this.setState({ password_confirm: pass });
  };

  //calling render function and return the data that will be display
  render() {
    return (

      //create a flex container to make the content responsive to all screen sizes
      //by dividing each section to an appropriate flex sizes
      <View style={styles.flexContainer}>

        {/* create a flex box to render spacebook logo */}
        <View style={styles.homeLogo}>
          {/* assign logo size to large as it logo for non-login screens are larger */}
          <Logo
            size="large"
          />
        </View>

        {/* create a flex box to provide text input boxes for a user to create an account */}
        <View style={stylesIn.loginRow}>
          <Text style={styles.loginHeading}>Create an account</Text>
          {/* create a text input for entering user's first name */}
          <TextInput
            ref="first_name"
            style={styles.loginInput}
            placeholder="first name..."
            onChangeText={this.handleFirstNameInput}
            value={this.state.first_name}
          />
          {/* display the error message from firstname validation */}
          {this.isFieldInError('first_name') && this.getErrorsInField('first_name').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>Your first name is required</Text>)}

          {/* create a text input for entering user's lastname */}
          <TextInput
            ref="last_name"
            style={styles.loginInput}
            placeholder="last name..."
            onChangeText={this.handleLastNameInput}
            value={this.state.last_name}
          />
          {/* display the error message from lastname validation */}
          {this.isFieldInError('last_name') && this.getErrorsInField('last_name').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>Your last name is required</Text>)}

          {/* create a text input for entering user's email */}
          <TextInput
            ref="new_email"
            style={styles.loginInput}
            placeholder="email..."
            onChangeText={this.handleEmailInput}
            value={this.state.email}
          />
          {/* display the error message from email validation */}
          {this.isFieldInError('new_email') && this.getErrorsInField('new_email').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>{errorMessage}</Text>)}

          {/* create a text input for entering password */}
          <TextInput
            ref="password"
            style={styles.loginInput}
            placeholder="password..."
            onChangeText={this.handlePasswordInput}
            value={this.state.password}
            secureTextEntry
          />
          {/* display the error message from password validation */}
          {this.isFieldInError('password') && this.getErrorsInField('password').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>A password must contain at least 8 characters</Text>)}

          {/* create a text input for password confirmation */}
          <TextInput
            ref="password_confirm"
            style={styles.loginInput}
            placeholder="confirm password..."
            onChangeText={this.handleConfirmPasswordInput}
            value={this.state.password_confirm}
            secureTextEntry
          />
          {/* display the error message from password confirmation validation */}
          {this.isFieldInError('password_confirm') && this.getErrorsInField('password_confirm').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>Password does not match</Text>)}
        </View>

        {/* create a container for register button */}
        <View style={styles.loginButtonRow}>
          {/* passing the alertMessage to display the error message */}
          <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
          
          <Button
            title="Register"
            color="#ffaf7a"
            onPress={() => { this.RegisterButtonPressed(); }}
          />
        </View>
        {/* create a container to allow a user to go to the login screen */}
        <View style={styles.endTextRow}>
           {/* navigate a user to register screen when the text is clicked */}
          <Text>
            Already have an account?
            <Text onPress={() => {this.props.navigation.navigate('Login')}} style={styles.linkText}>Click here</Text>
            {' '}
            to sign in
          </Text>
        </View>

      </View>
    );
  }
}

//using stylesheet to design the render
const stylesIn = StyleSheet.create({

  flexContainer: {
    flex: 1,
  },

  loginRow: {
    flex: 90,
    marginTop: '15%',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#ffaf7a',
    borderRadius: 20,
  },

});

export default Register;
