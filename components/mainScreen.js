import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Alert } from 'react-native';
//

import Feed from './feed';
import FriendScreen from './friendScreen';
import PostScreen from './postScreen';
import ProfileScreen from './profileScreen';
import SettingScreen from './settingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Tab = createBottomTabNavigator() ;

class App extends Component{

  constructor(props){
    super(props);

    this.state={
        isAuthed: false,
      }

  }
//   componentDidMount() {
//     this.unsubscribe = this.props.navigation.addListener('focus', () => {
//       this.checkLoggedIn();
//     });

//   }

//   componentWillUnmount() {
//     this.unsubscribe();
//   }

//   checkLoggedIn = async () => {
//     const value = await AsyncStorage.getItem('@session_token');
    
//     if (value == null) {
//        this.props.navigation.navigate('Login');
//     }
//     else {
//         this.state.isAuthed = true;
//     }
//   };
componentDidMount() {
    AsyncStorage.getItem('@session_token')
    .then (session => {
      console.log(session)
      if (session) {
        this.setState({isAuthed: true});
      }
    });
  }

  

  render() {

    if(true === this.state.isAuthed ){

        return (
        <NavigationContainer> 
        <Tab.Navigator
            initialRouteName={'Feed'}
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName;
                let rn = route.name;
    
                switch(rn)  {
                  case 'Feed':
                    iconName = focused ? 'home' : 'home-outline';
                    break;
    
                  case 'Friends':
                    iconName = focused ? 'list' : 'list-outline';
                    break;
    
                  case 'Add Post':
                    iconName = focused ? 'home' : 'home-outline';
                    break;
                  
                  case 'Profile':
                    iconName = focused ? 'home' : 'home-outline';
                    break;
                  
                    case 'Setting':
                    iconName = focused ? 'home' : 'home-outline';
                    break;
    
                }
    
                return <Ionicons name={iconName} size={size} color={color}/>
              }
            })}>
    
            <Tab.Screen name="Feed" component={Feed}></Tab.Screen>
            <Tab.Screen name="Friends" component={FriendScreen}></Tab.Screen>
            <Tab.Screen name="Add Post" component={Feed}></Tab.Screen>
            <Tab.Screen name="Profile" component={FriendScreen}></Tab.Screen>
            <Tab.Screen name="Setting" component={SettingScreen}></Tab.Screen>
                   
          </Tab.Navigator>
    
        </NavigationContainer>
        
        );
        
    
    }
}

}

export default App;