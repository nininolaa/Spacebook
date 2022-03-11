//import elements and components to be able to use it inside the class
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar } from 'react-native-paper';

import styles from '../modules/stylesheet';
import ProfileImage from '../modules/profileImage';
import Logo from '../modules/logo';
import IsLoading from '../modules/isLoading';

//create a searchResult component which will render the list of result that a user query for
class SearchResult extends Component {
  //create a constructor
  constructor(props) {
    //passing props into the constructor to enable using this.props inside a constructors
    super(props);

    //initialise the state for each data to be able to change it overtime
    this.state = {
      searchList: [],
      isLoading: true,
      alertMessage: '',
      //initialise the offset to 0 and limit to 5 to let the search result starts from beginning
      //and limit for 5 result in each page
      offset: 0,
      limit: 5,
      //store the passed in props of the query to search for 
      //and the search in type to the states
      searchQuery: this.props.route.params.query,
      searchIn: this.props.route.params.searchIn
    };
  }

  //using componentDidmount to call searchQuery function immediately after being mounted
  componentDidMount() {
    this.searchQuery();
  }

  //create a function to get a list of search
  async searchQuery() {
    //get the session token to use for authorisation when calling api
    const token = await AsyncStorage.getItem('@session_token');
    //using fetch function to call the api and send the get request 
    //also passed in all the parameters for query search in order to get the accurate search
    return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.searchQuery}&limit=${this.state.limit}&offset=${this.state.offset}&search_in=${this.state.searchIn}`, {
      method: 'get',
      //passing the session token to be authorised
      headers: {
        'X-Authorization': token,
      },
    })
      //checking the response status after calling api
      .then((response) => {
        //return the values from the response if the calling is successful and
        //if the response status error occured, store the error reasons into the 
        //array objects
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
      //when the promise is resolved, set the searchList result to be the value from the response Json array
      //and set the isLoading state to be false as the promise has been resolved
      .then((responseJson) => {
        this.setState({
          searchList: responseJson,
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

  //call the function to search for query when the search icon is pressed
  onSearchPress() {
    this.searchQuery();
  }

  //create a function to see the next page of the query result
  nextPage() {
    //each time the next button is clicked, the offset will be increase by 5 each time 
    //so the search will be the next 5 result each time
    this.setState({
      offset: this.state.offset + this.state.limit,
    });
    this.searchQuery();
  }

  //create a function to see the previous page of the query result
  previousPage() {
    //if it is the first page of result, no previous page will be display
    if (this.state.offset <= 0) {
      this.setState({
        offset: 0,
      });
    }
    //if it is not the first page, decrease limit by 5 each time so the result 
    //will be the previous 5 result each time
    else {
      this.setState({
        offset: this.state.offset - this.state.limit,
      });
    }
    this.searchQuery();
  }

  //calling render function and return the data that will be display 
  render() {
    //check if the function is still loading
    //if it does, render the loading icon
    if (this.state.isLoading == true) {
      return (
        <IsLoading />
      );
    }

    //render the main screen when the functions are ready
    return (

      //create a flex container to make the content responsive to all screen sizes
      //by dividing each section to an appropriate flex sizes
      <View style={stylesIn.flexContainer}>

        {/* create a flex container for rendering spacebook logo */}
        <View style={stylesIn.homeLogo}>
          <Logo />
        </View>

        {/* create a flex container for a search bar to search for any user */} 
        <View style={stylesIn.friendSearch}>
          {/* using searchbar component to render a search bar and store the text on the search bar
          to be the string to be search for */}
          <Searchbar
            placeholder="Find friends"
            onChangeText={(query) => { this.setState({ searchQuery: query }); }}
            onIconPress={() => { this.onSearchPress(); }}
          />
        </View>
        
        {/* create a flex container to render the serch result */}   
        <View style={stylesIn.friendLists}>
          {/* passing the alertMessage state to display the error message  */}
          <Text style={styles.errorMessage}>{this.state.alertMessage}</Text>
          <Text style={styles.postHeaderText}>Search Result</Text>

          {/* using flatlist component to show the list of the serach query  result */}
          <FlatList
            //store the list into the data before rendering each item
            data={this.state.searchList}

            renderItem={({ item }) => (
              // create a container for each single post
              <View style={[styles.inPostContainer, styles.postBox]}>
                {/* create a container to render profile image */}
                <View style={styles.inPostImage}>
                   {/* passing the profileImage component and given the attributes to the component
                    in order to render the right profile image and right size */}
                  <ProfileImage
                    userId={item.user_id}
                    isEditable={false}
                    width={50}
                    height={50}
                    navigation={this.props.navigation}
                  />
                </View>

                {/* create a container to render user information*/}     
                <View style={styles.inPostHeader}>
                  {/* make the name of each user clickable, and allow a user to visit their profile when click on their name */}
                  <Text onPress={() => { this.props.navigation.navigate('FriendProfile', { friendId: item.user_id }) }} style={styles.postNameText}>
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
            //set the user id to be the unique key for each item
            keyExtractor={(item) => item.user_id.toString()}
          />
        </View>

        {/* create a button container to store the back and next button below the search result */}
        <View style={stylesIn.btnContainer}>
          {/* create a back button and call the previousPage function when click on a button */}
          <View style={stylesIn.leftBtn}>
            <TouchableOpacity
              onPress={() => { this.previousPage(); }}
              style={[stylesIn.backBtn, styles.actionBtnOrange]}
            >
              <Text style={styles.actionBtnLight}>Back</Text>
            </TouchableOpacity>
          </View>
          {/* create a next button and call the nextPage function when click on a button */}
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

//using stylesheet to design the render
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
