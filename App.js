import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
//
import Login from './components/login';
import Index from './components/index';
import Register from './components/register';

const Drawer = createDrawerNavigator();

class App extends Component{

  constructor(props){
    super(props);

  }

  
  render() {
        return (
            <NavigationContainer> 
              <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={Index} />
                <Drawer.Screen name="Login" component={Login} />
                <Drawer.Screen name="Register" component={Register} />
              </Drawer.Navigator>
            </NavigationContainer>
        );        
  }
}

export default App;