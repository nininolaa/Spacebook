import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './components/screens/login';
import Index from './components/screens/index';
import Register from './components/screens/register';
import FriendRequest from './components/screens/friendRequest';
import SearchResult from './components/screens/searchResult';
import FriendProfile from './components/screens/friendProfile';
import NonFriend from './components/screens/nonFriend';
import UploadPicture from './components/screens/uploadPicture';
import FriendsOfFriend from './components/screens/friendsOfFriend';

const Stack = createNativeStackNavigator();

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Index} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="FriendRequest" component={FriendRequest} />
          <Stack.Screen name="SearchResult" component={SearchResult} />
          <Stack.Screen name="FriendProfile" component={FriendProfile} />
          <Stack.Screen name="NonFriend" component={NonFriend} />
          <Stack.Screen name="UploadPicture" component={UploadPicture} />
          <Stack.Screen name="FriendsOfFriend" component={FriendsOfFriend} />

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
