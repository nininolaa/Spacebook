//import elements and components to be able to use it inside the class
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidationComponent from 'react-native-form-validator';
import {
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
  ScrollView,
} from 'react-native';
import styles from './stylesheet';
import ProfileImage from './profileImage';

//create a UserWall component which will render user's post feed
class UserWall extends ValidationComponent {
  //create a constructor
  constructor(props) {
    //passing props into the constructor to enable using this.props inside a constructor
    super(props);

    //initialise the state for each data to be able to change it overtime
    this.state = {
      user_id: '',
      new_text_post: '',
      userPostList: [],
      editable: false,
      isLoading: true,
      alertMessage: '',
    };
  }

  //using componentDidmount to get the user id and
  //to call userPost function immediately after being mounted
  async componentDidMount() {
    this.state.user_id = await AsyncStorage.getItem('user_id');
    this.userPosts();
  }

  //---for post management, view a single post has not been used as the design for this already allow
  // a user to edit and delete post from the list of post

  //create a function to retrieve a list of posts of a given user
  userPosts = async () => {
    //get the session token to use for authorisation when calling api
    const token = await AsyncStorage.getItem('@session_token');
    //get the user id to pass in to the api call 
    const userId = await AsyncStorage.getItem('user_id');

    //using fetch to call the api and send the get request 
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post`, {
      method: 'get',
      //passing the content type and the session token to be authorised
      headers: {
        'X-Authorization': token,
      },
    })
      //checking the response status in the return promise
      .then((response) => {
        //return the values from the response if the calling is successful and
        //if the response status error occured, store the error reasons into the 
        //array objects
        switch (response.status) {
          case 200:
            return response.json();
            break;
          case 401:
            throw { errorCase: 'Unauthorised' };
            break;
          case 403:
            throw { errorCase: 'UnauthorisedPost' };
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
          case 'UnauthorisedPost':
            this.setState({
              alertMessage: 'You can only view the post of yourself or your friends',
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

      //get the session token and user id as it is needed when sending a request to the api
      const token = await AsyncStorage.getItem('@session_token');
      const userId = await AsyncStorage.getItem('user_id');

      //using fetch function to call the api and send the patch request
      return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post/${post_id}`, {
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
          //update user post feed each time the update function is resolved
          this.userPosts();
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

    //get the session token and user id as it is needed when sending a request to the api
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('user_id');

    //using fetch function to call the api and send the delete request
    //by passed in the user id and a post id that want to be deleted
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post/${post_id}`, {
      //passing the session token to be authorised
      method: 'delete',
      headers: {
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
    return (

      //create a flex container to make the content responsive to all screen sizes
      //by dividing each section to an appropriate flex sizes
      <View style={stylesIn.flexContainer}>

        {/* add a header text before rendering the post list */}
        <Text style={styles.postHeaderText}>Your Wall:</Text>
        {/* passing the alertMessage state to alert the error message at the top of the screen  */}
        <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>

        {/* create a container for the post list */}
        <ScrollView styles={styles.postBox}>

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
                      {' '}
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
                <Text style={styles.postInfoText}>
                  {' '}
                  Likes:
                  {item.numLikes}
                  {' '}
                  {'\n'}
                  {' '}
                </Text>
                
                {/* create a container for displaying the edit and delete post buttons */}
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
                  <Text style={styles.errorMessageSmall}>{this.state.alertMessage}</Text>
                  {this.isFieldInError('new_text_post') && this.getErrorsInField('new_text_post').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>Please add some text to update this post</Text>)}
                </View>
              </View>

            )}
            //set the post id to be the unique key for each item
            keyExtractor={(item) => item.post_id.toString()}
          />
        </ScrollView>
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
    flex: 1.1,
    paddingHorizontal: 20,
  },

  findUserPost: {
    flex: 0.8,
    paddingHorizontal: 20,
  },

  editBtnContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  mainPostFeed: {
    flex: 5,
    paddingHorizontal: 20,
  },

  editText: {
    color: '#ffffff',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },

  postInput: {
    borderWidth: 3,
    borderColor: '#ffc9a9',
    borderRadius: 3,
    padding: 40,
    fontSize: 15,
  },

  sharePostBtn: {
    backgroundColor: '#f9943b',
  },

});

export default UserWall;
