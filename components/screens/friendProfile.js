//import elements and components to be able to use it inside the class
import React from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidationComponent from 'react-native-form-validator';
import { likePost, unlikePost } from '../../libs/postFunctions';
import Logo from '../modules/logo';
import styles from '../modules/stylesheet';
import IsLoading from '../modules/isLoading';
import ProfileImage from '../modules/profileImage';
import FriendHeading from '../modules/friendHeading';

//create a FriendProfile component which will render the profile of a friend
class FriendProfile extends ValidationComponent {
  //create a constructor
  constructor(props) {
    //passing props into the constructor to enable using this.props inside a constructors
    super(props);

    //initialise the state for each data to be able to change it overtime
    this.state = {
      token: '',
      user_id: '',
      new_text_post: '',
      userPostList: [],
      addPost: '',
      isLoading: true,
      alertMessage: '',
      alertMessage1: '',
      //store the passed in props of the friend id to a state
      friendId: this.props.route.params.friendId,
    };
  }

  //using componentDidmount to get the user id, a token and
  //to call userPost function immediately after being mounted
  async componentDidMount() {
    this.state.user_id = await AsyncStorage.getItem('user_id');
    this.state.token = await AsyncStorage.getItem('@session_token');
    this.userPosts();
  }

  //create a function for a user to add a post on friend's wall
  addPost = async () => {

    //validation check that the text to be post should not be empty
    this.validate({
      addPost: { required: true },
    });

    //only call the api if the validation check is passed 
    if (this.isFormValid() == true) {

      //get the session token  as it is needed for authorisation
      const token = await AsyncStorage.getItem('@session_token');

      //store the text to the object array 
      const post = { text: this.state.addPost };

      //using fetch function to call the api and send the post request
      return fetch(`http://localhost:3333/api/1.0.0/user/${this.props.route.params.friendId}/post`, {
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
        //when the promise is resolved, update user post feed 
        .then(() => {
          this.userPosts();
        })
        //when the promise is rejected, check which error reason from the response was and
        //set the correct error message to each error in order to render the right error message
        //also set the isLoading state to be false as the promise has been rejected
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
  };

  //---for post management, view a single post has not been used as the design for this already allow
  // a user to edit and delete post from the list of post

  //create a function to retrieve a list of posts of a given user
  //using fetch to call the api and send the get request 
  userPosts = () => fetch(`http://localhost:3333/api/1.0.0/user/${this.state.friendId}/post`, {
    method: 'get',
    //passing the session token to be authorised
    headers: {
      'X-Authorization': this.state.token,
    },
  })
    //checking the response status in the return promise
    .then((response) => {
      //return the values from the response if the calling is successful and
      //if the response status error occured, store the error reasons into the 
      //object array
      switch (response.status) {
        case 200:
          return response.json();
          break;
        case 401:
          throw { errorCase: 'Unauthorised' };
          break;
        case 403:
          this.props.navigation.navigate('NonFriend', { friendId: this.state.friendId });
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
    //when the promise is resolved, store the response Json array to the userlist state
    //and set the isLoading state to be false as the promise has been resolved
    .then((responseJson) => {
      this.setState({
        userPostList: responseJson,
        isLoading: false,
      });
    })
    //when the promise is rejected, check which error reason from the response was and
    //set the correct error message to each error in order to render the right error message
    //also set the isLoading state to be false as the promise has been rejected
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

  //create a function to update text in a post
  updatePost = async (post_id, text) => {

    //validation check for the text to update should not be empty
    this.validate({
      new_text_post: { required: true },
    });

    //only call the api if the validation check is passed 
    if (this.isFormValid() == true) {
      //create an empty object array to store the new text that will be send for update
      const new_info = {};

      //only store the new text to the object array when its not the same as the current text
      if (this.state.new_text_post != text && this.state.new_text_post != '') {
        new_info.text = this.state.new_text_post;
      }

      //get the session token as it is needed for authorisation
      const token = await AsyncStorage.getItem('@session_token');

      //using fetch function to call the api and send the patch request
      return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.friendId}/post/${post_id}`, {
        method: 'PATCH',
        //passing the content type to tell the server that we are passing json
        //and the session token to be authorised
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
        //converted a new text to a string and pass into the body
        body: JSON.stringify(new_info),
      })
        //checking the response status in the return promise
        .then((response) => {
          //if the response status error occured, store the error reasons into the 
          //object array
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
              throw { errorCase: 'ForbiddenUpdatePost' };
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
        //when the promise is resolved, set the editable back to false as it editing is done
        //and set the isLoading state to be false as the promise has been resolved
        .then(() => {
          this.setState({
            editable: false,
            isLoading: false,
          });
        })
        //when the promise is rejected, check which error reason from the response was and
        //set the correct error message to each error in order to render the right error message
        //also set the isLoading state to be false as the promise has been rejected
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
            case 'ForbiddenUpdatePost':
              this.setState({
                alertMessage: 'Forbidden - you can only update your own posts',
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

  //create a function to delete a user's post
  deletePost = async (post_id) => {

    //get the session token as it is needed for authorisation
    const token = await AsyncStorage.getItem('@session_token');

    //using fetch function to call the api and send the delete request
    //by passed in friend's id(as this post is based in friend's profile) and a post id that want to be deleted
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.friendId}/post/${post_id}`, {
      method: 'delete',
      headers: {
        //passing the session token to be authorised
        'X-Authorization': token,
      },
    })
      //checking the response status in the return promise
      .then((response) => {
        //if the response status error occured, store the error reasons into the 
        //array objects
        switch (response.status) {
          case 200:
            break;
          case 401:
            throw { errorCase: 'Unauthorised' };
            break;
          case 403:
            throw { errorCase: 'ForbiddenDeletePost' };
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
      //when promise is resolved, update user post feed 
      .then(() => {
        this.userPosts();
      })
      //when the promise is rejected, check which error reason from the response was and
      //set the correct error message to each error in order to render the right error message
      //also set the isLoading state to be false as the promise has been rejected
      .catch((error) => {
        switch (error.errorCase) {
          case 'Unauthorised':
            this.setState({
              alertMessage: 'Unauthorised, Please login',
              isLoading: false,
            });
            break;
          case 'ForbiddenDeletePost':
            this.setState({
              alertMessage: 'Forbidden - you can only delete your own posts',
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
  };

  //if the edit button pressed, set the text to be editable
  editPost() {
    this.setState({ editable: true });
  }

  //return the value of editable when this function is called
  isEditMode() {
    return this.state.editable;
  }

  //return the value of user_id when this function is called
  isUserPost() {
    return this.state.user_id;
  }

  //calling render function and return the data that will be display 
  render() {
    //display the loading icon if the functions are still loading
    if (this.state.isLoading == true) {
      return (
        <IsLoading />
      );
    }
    //display the screen when the components are ready
    return (

      //create a flex container to make the content responsive to all screen sizes
      //by dividing each section to an appropriate flex sizes
      <View style={stylesIn.flexContainer}>

        {/* create a sub-container to split between a normal view and a flatlist to
        ensure that it will not overlay each other when the flatlist data is empty */}
        <View style={stylesIn.subMainContainer}>
          {/* create a container to display normal view components */}
          <View style={stylesIn.firstSubContainer}>
            {/* create a flex box for rendering spacebook logo */}
            <View style={stylesIn.homeLogo}>
              <Logo />
            </View>

            {/* create a flex box to display user's detail by calling FriendHeading component which will
            render the user detail */}
            <View style={stylesIn.friendDetails}>
              <FriendHeading
                friend_id={this.props.route.params.friendId}
                navigation={this.props.navigation}
              />
            </View>

            {/* create a flex box to display the navigation buttons  */}
            <View style={stylesIn.friendBtnContainer}>
              
              {/* a flex box that provides a button to let the user navigate back to their friend screen */}
              <View style={stylesIn.backToTab}>
                <TouchableOpacity
                  style={[stylesIn.seeFriendBtn, stylesIn.friendBtnGrey]}
                  onPress={() => this.props.navigation.navigate('Friends')}
                >
                  <Text style={stylesIn.seeFriendBtnText}>Back to Home</Text>
                </TouchableOpacity>
              </View>

              {/* a flex box that provides a button to let the user see the friend list of a friend */}
              <View style={stylesIn.seeFriendBtnContainer}>
                <TouchableOpacity
                  style={[stylesIn.seeFriendBtn, stylesIn.friendBtnOrange]}
                  onPress={() => this.props.navigation.navigate('FriendsOfFriend', { userId: this.props.route.params.friendId })}
                >
                  <Text style={stylesIn.seeFriendBtnText}>See all friends</Text>
                </TouchableOpacity>
              </View>

            </View>

            {/* create a flex box to let the user post on their friend's wall */}
            <View style={stylesIn.addPost}>

              <Text style={stylesIn.friendProfileHeaderText}>Share a post:</Text>
              {/* set the text that the user enter to the text input component into a state 
              in order to send the text to the api */}
              <TextInput
                style={stylesIn.postInput}
                placeholder="Add text here"
                numberOfLines="5"
                onChangeText={(addPost) => this.setState({ addPost })}
                value={this.state.addPost}
              />
              {/* display an error message when the validation for addingis incorrect */}
              {this.isFieldInError('addPost') && this.getErrorsInField('addPost').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>Write something before you post</Text>)}
              
              {/* display a button for adding a post */}
              <TouchableOpacity
                style={[styles.addPostBtn, styles.btnToEnd]}
                onPress={() => this.addPost()}
              >
                <Text style={[styles.loginButtonText]}>+ Add Post</Text>
              </TouchableOpacity>

            </View>
          </View>
          
          {/* create a container to display flatlist components */}
          <View style={stylesIn.secondSubContainer}>

            {/* create a container for the post list */}
            <View style={stylesIn.friendPosts}>
              {/* passing the alertMessage state to alert the error message  */}
              <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
              {/* add a header text before rendering the post list */}
              <Text style={stylesIn.friendProfileHeaderText}>Feed:</Text>
              
              {/* using flatlist component to show the list of post as flatlist makes the list scrollable */}
              <FlatList
                //store the list into the data before rendering each item
                data={this.state.userPostList}

                renderItem={({ item }) => (
                  //create a container for each single post
                  <View style={styles.postBox}>
                    {/* create a sub-container that contain a profile image and post information */}
                    <View style={styles.inPostContainer}>
                      {/* create a container to render profile image */}
                      <View style={styles.inPostImage}>
                        {/* passing the profileImage component and given the attributes to the component
                        in order to render the right profile image and right size */}
                        <ProfileImage
                          userId={item.author.user_id}
                          isEditable={false}
                          width={50}
                          height={50}
                          navigation={this.props.navigation}
                        />
                      </View>
                      {/* create a container to render post information*/}
                      <View style={styles.inPostHeader}>
                        {/* display post's author name, post id and post time */}
                        <Text
                          style={styles.postNameText}
                        >
                          {item.author.first_name}
                          {' '}
                          {item.author.last_name}
                        </Text>
                        <Text style={styles.postInfoText}>
                          Post id:
                          {item.post_id}
                          {' '}
                          |
                          {item.timestamp}
                        </Text>
                      </View>
                    </View>

                    {/* display the post text by using textInput component as this text should be 
                    editable when the user want to update the text */}
                    <TextInput
                      style={styles.postMainText}
                      placeholder={item.text}
                      editable={this.state.editable}
                      onChangeText={(new_text_post) => this.setState({ new_text_post })}
                    />
                    {/* display the number of likes of the post */}
                    <Text>
                      {' '}
                      Likes:
                      {item.numLikes}
                      {' '}
                      {'\n'}
                      {' '}
                    </Text>
                    
                    {/* create a container for displaying the edit and delete post buttons */}
                    {/* check if the current post is owned by the user or not by checking the author user id
                    as the edit and delete button will only be shown when the post is owned by the user */}
                    <View style={[stylesIn.editBtnContainer, this.isUserPost() == item.author.user_id ? styles.showEdit : styles.hideEdit]}>

                      {/* create a sub container which will render the edit button and when the edit button is pressed, 
                      the update button will toggle to let the user update new text */}
                      <View style={[styles.btnContainer1]}>
                        <TouchableOpacity
                          onPress={() => this.editPost(item.post_id)}
                          style={[styles.actionBtn, styles.actionBtnGreen, !this.isEditMode() ? styles.showEdit : styles.hideEdit]}
                        >
                          <Text style={[styles.actionBtnLight]}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.updatePost(item.post_id, item.text)}
                          style={[styles.actionBtn, styles.actionBtnBlue, this.isEditMode() ? styles.showEdit : styles.hideEdit]}
                        >
                          <Text style={[styles.actionBtnLight]}>Update Post</Text>
                        </TouchableOpacity>
                      </View>

                      {/* create a sub-container to render the delete post button to allow the user to delete
                      a specific post */}
                      <View style={[styles.btnContainer2]}>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.actionBtnRed]}
                          onPress={() => this.deletePost(item.post_id)}
                        >
                          <Text style={styles.actionBtnLight}>Delete post</Text>
                        </TouchableOpacity>
                      </View>
                      {/* display an error message when the validation is incorrect */}
                      {this.isFieldInError('new_text_post') && this.getErrorsInField('new_text_post').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>Please add some text to update this post</Text>)}
                    </View>
                    
                    {/* create a container for displaying th like and unlike buttons */}
                    {/* check if the current post is owned by a friend or not by checking the author user id
                    as the like and unlike button will only be shown when the post is owned by a friendr */}
                    <View style={[stylesIn.editBtnContainer, this.isUserPost() != item.author.user_id ? styles.showEdit : styles.hideEdit]}>

                      {/* create a sub container which will render the like button */}
                      <View style={styles.btnContainer1}>
                        {/* passing the alertMessage1 state to alert the error message for like and unlike */}
                        <Text style={styles.errorMessage}>{this.state.alertMessage1}</Text>
                        {/* calling the like function from the library and passed in the token, user id and 
                        post id to the parameter in order to like the post */}
                        <TouchableOpacity
                          onPress={
                                    () => likePost(this.state.token, item.author.user_id, item.post_id)
                                       //when promise is resolved, update user post feed 
                                      .then(() => {
                                        this.userPosts();
                                      })
                                      //when the promise is rejected, set the alertMessage1 state to the error message that retrieved 
                                      //from the like functions
                                      .catch((error) => {
                                        this.setState({
                                          alertMessage1: error.alertMessage1,
                                        });
                                      })
                                  }
                          style={[styles.actionBtn, styles.actionBtnBlue]}
                        >
                          <Text style={styles.actionBtnLight}>Like</Text>
                        </TouchableOpacity>

                      </View>
                      
                      {/* create a sub container which will render the unlike button */}
                      <View style={styles.btnContainer2}>
                        {/* calling the unlike function from the library and passed in the token, user id and 
                        post id to the parameter in order to unlike the post */}
                        <TouchableOpacity
                          onPress={
                                    () => unlikePost(this.state.token, item.author.user_id, item.post_id)
                                      //when promise is resolved, update user post feed 
                                      .then(() => {
                                        this.userPosts();
                                      })
                                      //when the promise is rejected, set the alertMessage1 state to the error message that retrieved 
                                      //from the unlike functions
                                      .catch((error) => {
                                        this.setState({
                                          alertMessage1: error.alertMessage1,
                                        });
                                      })
                                  }
                          style={[styles.actionBtn, styles.actionBtnGrey]}
                        >
                          <Text style={styles.actionBtnLight}>Unlike</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  </View>
                )}
                //set the post id to be the unique key for each item
                keyExtractor={(item) => item.post_id.toString()}
              />

            </View>
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

  subMainContainer: {
    flex: 1,
  },

  firstSubContainer: {
    flex: 2,
  },

  secondSubContainer: {
    flex: 1.5,
  },

  homeLogo: {
    flex: 1.5,
  },

  friendDetails: {
    flex: 1.5,
    flexDirection: 'row',
  },

  friendBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
  },

  backToTab: {
    flex: 1,
    justifyContent: 'space-around',
  },

  seeFriendBtnContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },

  editBtnContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  seeFriendBtn: {
    borderWidth: 2,
    borderRadius: 5,
    width: '80%',
    height: '50%',
    alignItems: 'center',
  },

  seeFriendBtnText: {
    fontSize: 15,
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
  },

  friendBtnOrange: {
    backgroundColor: '#f9943b',
    borderColor: '#f9943b',
  },

  friendBtnGrey: {
    backgroundColor: '#808080',
    borderColor: '#808080',
  },

  friendProfileHeaderText: {
    padding: 5,
    fontSize: 18,
  },

  addPost: {
    flex: 3,
    paddingHorizontal: 10,
  },

  friendPosts: {
    flex: 3,
  },

  postInput: {
    borderWidth: 3,
    borderColor: '#ffc9a9',
    borderRadius: 3,
    padding: 30,
    fontSize: 15,
  },

});

export default FriendProfile;
