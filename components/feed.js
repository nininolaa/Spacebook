import React, {Component} from 'react';
import { View, Text, StyleSheet,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

 class Feed extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
  
          AsyncStorage.getItem('@session_token')
            .then (session => {
              console.log(session);
              if (session == null) {   
               this.props.navigation.navigate('Feed');
              }
              else{
                this.setState({token: session})
              }
            });
  
        })
        
    }
  
    componentWillUnmount() {
    this.unsubscribe();
    }    

    render(){
        return(
    
        <View style = {stylesIn.flexContainer}>

            <View style = {stylesIn.homeLogo}>
                <Image source={require('../assets/img/logo.png')} ></Image> 
                <Image source={require('../assets/img/Heading.png')}></Image>
            </View>

            <View style = {stylesIn.friendSearch}>

            </View>

            <View style = {stylesIn.postFeed}>
                <Text>Feed</Text>
            </View>

            <View styles = {stylesIn.mainMenu}>

            </View>

        </View>
  
        )
    }
 }

 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
    },

    homeLogo: {
        flex: 5,
     //   backgroundColor: 'blue',
    },

    logoImg: {
        width: 100,
        height: 100
    },

    friendSearch: {
        flex: 5,
    //    backgroundColor: 'green',
    },

    postFeed: {
        flex: 30,
     //   backgroundColor: 'orange',
    },

    mainMenu: {
        flex: 10,
     //   backgroundColor: 'blue',
    }
 
 })

 export default Feed;


