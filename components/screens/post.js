import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useEffect } from 'react';
import ValidationComponent from 'react-native-form-validator';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
} from 'react-native';
import Logo from '../modules/logo';
import styles from '../modules/stylesheet';
import IsLoading from '../modules/isLoading';
import UserWall from '../modules/userWall';

class PostScreen extends ValidationComponent {
  constructor(props) {
    super(props);

    this.postId = '',

    this.state = {
      user_id: '',
      addPost: '',
      textPost: '',
      userPostList: [],
      editable: false,
      text: '',
      isLoading: true,
      alertMessage: '',
      token: '',
      new_text_post: '',
      userWallKey: 0,
    };
  }

  async componentDidMount() {
    this.state.user_id = await AsyncStorage.getItem('user_id');
    this.state.token = await AsyncStorage.getItem('@session_token');

    this.focusListener = this.props.navigation.addListener('focus', async () => {
      this.userPosts();
    });
  }

  userPosts = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    const userId = await AsyncStorage.getItem('user_id');

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post`, {
      method: 'get',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
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
      .then((responseJson) => {
        this.setState({
          isLoading: false,
        });
      })
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

  // add new post
  addPost = async () => {
    this.validate({
      addPost: { required: true },
    });

    if (this.isFormValid() == true) {
      const token = await AsyncStorage.getItem('@session_token');
      const userId = await AsyncStorage.getItem('user_id');

      const post = { text: this.state.addPost };

      return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post`, {
        method: 'post',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      })
        .then((response) => {
          switch (response.status) {
            case 201:
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
        .then((responseJson) => {
          console.log('Posted post ', responseJson);
          this.setState({
            userWallKey: Math.random(),
          });
        })
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

  render() {
    if (this.state.isLoading == true) {
      return (
        <IsLoading />
      );
    }
    return (

      <View style={stylesIn.flexContainer}>

        <View style={stylesIn.subContainer1}>
          <View style={stylesIn.homeLogo}>
            <Logo />
          </View>

          <View style={stylesIn.sharePost}>
            <Text style={styles.postHeaderText}>Share a post:</Text>
            <TextInput
              style={stylesIn.postInput}
              placeholder="Add text here"
              numberOfLines="5"
              onChangeText={(addPost) => this.setState({ addPost })}
              value={this.state.addPost}
            />
            {this.isFieldInError('addPost') && this.getErrorsInField('addPost').map((errorMessage) => <Text key={errorMessage} style={styles.loginErrorText}>Write something before you post</Text>)}

            <TouchableOpacity
              style={[styles.addPostBtn, styles.btnToEnd, stylesIn.addPostBtn]}
              onPress={() => this.addPost()}
            >
              <Text style={stylesIn.addPostBtnText}>+ Add Post</Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={stylesIn.subContainer2}>
          <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
          <View style={stylesIn.mainPostFeed}>
            <UserWall
              key={this.state.userWallKey}
              navigation={this.props.navigation}
            />
          </View>
        </View>
      </View>

    );
  }
}

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
