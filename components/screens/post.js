//import elements and components to be able to use it inside the class
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import ValidationComponent from 'react-native-form-validator';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
} from 'react-native';
import Logo from '../modules/logo';
import styles from '../modules/stylesheet';
import UserWall from '../modules/userWall';

//create a PostScreen component which will allow user to share a post in tab navigator
class PostScreen extends ValidationComponent {
  //create a constructor
  constructor(props) {
    //passing props into the constructor to enable using this.props inside a constructors
    super(props);

    //initialise the state for each data to be able to change it overtime
    this.state = {
      user_id: '',
      addPost: '',
      alertMessage: '',
      token: '',
      userWallKey: 0,
    };
  }

  //---for post management, view a single post has not been used as the design for this already allow
  // a user to edit and delete post from the list of post

  //using componentDidmount to get the user id and 
  //a token immediately after being mounted
  async componentDidMount() {
    this.state.user_id = await AsyncStorage.getItem('user_id');
    this.state.token = await AsyncStorage.getItem('@session_token');

    this.focusListener = this.props.navigation.addListener('focus', async () => {
      //set the imageKey state to random numbers to make the component triggers when assign this state 
      //as a key in the component in render function
      this.setState({
        imageKey: Math.random(),
      });
    });
  }

  //clean up the focusListener function in componentDidMount before being destroyed
  componentWillUnmount() {
    this.focusListener();
  }


  //create a function for a user to add a post
  addPost = async () => {

    //validation check that the text to be post should not be empty
    this.validate({
      addPost: { required: true },
    });

    //only call the api if the validation check is passed 
    if (this.isFormValid() == true) {

      //get the session token  as it is needed for authorisation
      const token = await AsyncStorage.getItem('@session_token');

      //get the user id as it is needed for api call 
      const userId = await AsyncStorage.getItem('user_id');

      //store the text to the object array 
      const post = { text: this.state.addPost };

      //using fetch function to call the api and send the post request
      return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post`, {
        method: 'post',
        //passing the content type to tell the server that we are passing json
        //and the session token to be authorised
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
        //convert a text to a string and pass into the body
        body: JSON.stringify(post),
      })
        //checking the response status in the return promise
        .then((response) => {
          //if the response status error occured, store the error reasons into the 
          //object array
          switch (response.status) {
            case 201:
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
        //when the promise is resolved, set the userWallKey in state to any random number 
        // to make the userWall component triggers each time a user add new post
        .then(() => {
          this.setState({
            userWallKey: Math.random(),
          });
        })
        //when the promise is rejected, check which error reason from the response was and
        //set the correct error message to each error in order to render the right error message
        .catch((error) => {
          console.log(error);
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
  };

  //calling render function and return the data that will be display 
  render() {

    //display the screen when the components are ready
    return (

      //create a flex container to make the content responsive to all screen sizes
      //by dividing each section to an appropriate flex sizes
      <View style={stylesIn.flexContainer}>

         {/* create a sub-container to split between a normal view and a flatlist to
        ensure that it will not overlay each other when the flatlist data is empty */}
        <View style={stylesIn.subContainer1}>
          {/* create a flex box for rendering spacebook logo */}
          <View style={stylesIn.homeLogo}>
            <Logo />
          </View>
           {/* create a flex box to let the user add a new post to their wall */}
          <View style={stylesIn.sharePost}>
            <Text style={styles.postHeaderText}>Share a post:</Text>
            {/* set the text that the user enter to the text input component into a state 
              in order to send the text to the api */}
            <TextInput
              style={stylesIn.postInput}
              placeholder="Add text here"
              numberOfLines="5"
              onChangeText={(addPost) => this.setState({ addPost })}
              value={this.state.addPost}
            />
            {/* display an error message when the validation for adding post is incorrect */}
            {this.isFieldInError('addPost') && this.getErrorsInField('addPost').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>Write something before you post</Text>)}

            {/* display a button for adding a post */}
            <TouchableOpacity
              style={[styles.addPostBtn, styles.btnToEnd, stylesIn.addPostBtn]}
              onPress={() => this.addPost()}
            >
              <Text style={stylesIn.addPostBtnText}>+ Add Post</Text>
            </TouchableOpacity>
          </View>

        </View>
        {/* create a container to display flatlist components */}
        <View style={stylesIn.subContainer2}>
          {/* passing the alertMessage state to alert the error message  */}
          <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
          {/* a container for the user's feed */}
          <View style={stylesIn.mainPostFeed}>
            {/* call the userwall component to render the user wall */}
            <UserWall
              //passed in the key in order to update the user's wall each time the update is made
              key={this.state.userWallKey}
              navigation={this.props.navigation}
            />
          </View>
        </View>
      </View>

    );
  }
}

//using stylesheet to design the render
const stylesIn = StyleSheet.create({

  flexContainer: {
    flex: 1,
    backgroundColor: '#fdf6e4',
  },

  homeLogo: {
    flex: 1,
  },

  sharePost: {
    flex: 3,
    paddingHorizontal: 20,
  },

  mainPostFeed: {
    flex: 5,
    paddingHorizontal: 20,
  },

  postInput: {
    borderWidth: 3,
    borderColor: '#ffc9a9',
    borderRadius: 3,
    padding: 40,
    fontSize: 15,
  },

  subContainer1: {
    flex: 1,
  },

  subContainer2: {
    flex: 1,
  },

  addPostBtn: {
    marginBottom: 10,
    height: 30,
  },

  addPostBtnText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#ffffff',
  },

});

export default PostScreen;
