import React, { Component } from 'react';
import {
  View, Text, StyleSheet, FlatList, 
  TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar } from 'react-native-paper';

import styles from '../modules/stylesheet';
import ProfileImage from '../modules/profileImage';
import Logo from '../modules/logo';
import IsLoading from '../modules/isLoading';

class SearchResult extends Component {
  constructor(props) {
    super(props);

    this.token = '',

    this.state = {
      searchList: [],
      isLoading: true,
      alertMessage: '',
      offset: 0,
      limit: 5,
      searchQuery: this.props.route.params.query,
    };
  }

  componentDidMount() {
    this.searchQuery();
  }

  async searchQuery() {
    const token = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/search?q=${ this.state.searchQuery }&limit=${ this.state.limit }&offset=${ this.state.offset}`, {
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
          case 400:
            throw { errorCase: 'BadRequest' };
            break;
          case 401:
            throw { errorCase: 'Unauthorised' };
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
        console.log(responseJson);
        this.setState({
          searchList: responseJson,
          isLoading: false,
        });
      })
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

  onSearchPress() {
    this.searchQuery();
  }

  nextPage() {
    this.setState({
      offset: this.state.offset + this.state.limit,
    });
    this.searchQuery();
  }

  previousPage() {
    if (this.state.offset <= 0) {
      this.setState({
        offset: 0,
      });
    } else {
      this.setState({
        offset: this.state.offset - this.state.limit,
      });
    }
    this.searchQuery();
  }

  render() {
    if (this.state.isLoading == true) {
      return (
        <IsLoading />
      );
    }

    return (

      <View style={stylesIn.flexContainer}>

            <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>

            <View style={stylesIn.homeLogo}>
            <Logo />
          </View>

            <View style={stylesIn.friendSearch}>
            <Searchbar
                placeholder="Find friends"
                onChangeText={(query) => { this.setState({ searchQuery: query }); }}
                onIconPress={() => { this.onSearchPress(); }}
              />
          </View>

            <View style={stylesIn.friendLists}>
            <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
            <Text style={styles.postHeaderText}>Search Result</Text>

            <FlatList
                // calling the array
                data={this.state.searchList}

                // specify the item that we want to show on the list
                renderItem={({ item }) => (
                    <View style={[styles.inPostContainer, styles.postBox]}>
                    <View style={styles.inPostImage}>
                        <ProfileImage
                            userId={item.user_id}
                            isEditable={false}
                            width={50}
                            height={50}
                            navigation={this.props.navigation}
                          />
                      </View>

                    <View style={styles.inPostHeader}>
                        <Text onPress={() => { this.props.navigation.navigate('FriendProfile', { friendId: item.user_id }); }} style={styles.postNameText}>
                            {' '}
                            {item.user_givenname}
                            {' '}
                            {item.user_familyname}
                            {' '}
                            {'\n'}
                            {' '}
                          </Text>
                      </View>
                  </View>
                  )}
                keyExtractor={(item) => item.user_id.toString()}
              />
          </View>
            <View style={stylesIn.btnContainer}>
            <View style={stylesIn.leftBtn}>
                <TouchableOpacity
                    onPress={() => { this.previousPage(); }}
                    style={[stylesIn.backBtn, styles.actionBtnOrange]}
                  >
                    <Text style={styles.actionBtnLight}>Back</Text>
                  </TouchableOpacity>
              </View>
            <View style={stylesIn.rightBtn}>
                <TouchableOpacity
                    onPress={() => { this.nextPage(); }}
                    style={[stylesIn.backBtn, styles.actionBtnOrange]}
                  >
                    <Text style={styles.actionBtnLight}>Next</Text>
                  </TouchableOpacity>
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

  friendSearch: {
    flex: 0.5,
  },

  friendLists: {
    flex: 5,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  leftBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  rightBtn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  backBtn: {
    margin: 5,
    padding: 10,
    width: '70%',

  },

});

export default SearchResult;
