import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
//
import Login from './components/login';
import Index from './components/index';
import Register from './components/register';
import Feed from './components/feed';
import FriendScreen from './components/friendScreen';
import PostScreen from './components/postScreen';
import ProfileScreen from './components/profileScreen';
import SettingScreen from './components/settingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator() ;

class App extends Component{

  constructor(props){
    super(props);

    this.state={
      isAuthed: false,
    }
  }

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

    if (true === this.state.isAuthed){
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

      else{
        return (
  
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={Index} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Feed" component={Feed} />
            </Stack.Navigator>
          </NavigationContainer>
        );
      }
  } 
}

export default App;