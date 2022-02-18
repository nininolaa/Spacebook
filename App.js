import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './components/login';
import Index from './components/index';
import Register from './components/register';
import FriendReqeust from './components/friendRequestScreen';

const Stack = createNativeStackNavigator();

class App extends Component{

  constructor(props){
    super(props);
  }
  
  render() {
        return (
            <NavigationContainer> 
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Index} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="FriendRequest" component={FriendReqeust} />
              </Stack.Navigator>
            </NavigationContainer>
        );        
  }
}

export default App;