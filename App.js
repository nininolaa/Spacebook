import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
//
import Login from './components/login';
import Index from './components/index';
import mainScreen from './components/mainScreen';
import Register from './components/register';

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
                {/* <Stack.Screen name="mainScreen" component={mainScreen} /> */}
            </Stack.Navigator>
            </NavigationContainer>
        );
      
}
}

export default App;