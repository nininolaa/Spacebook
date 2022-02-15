import React, {Component} from 'react';
import { View, TextInput, Image , StyleSheet} from 'react-native';
import stylesheet from './stylesheet';

const styles = StyleSheet.create({
    loginHeader: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },

     logo: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: 100,
        height: 100,
     },

     headingImgIndex: {
        top:'50%',
        width: 300,
        height: 150
     }
})


 class Logo extends Component {

    constructor(props){
        super(props);

    }

    render(){
        return(
        
        <View style={styles.loginHeader}>
            <Image source={require('../../assets/img/logo.png')} style={styles.logo} ></Image> 
            <Image source={require('../../assets/img/Heading.png')} style={styles.headingImgIndex}></Image>
        </View>

        )
    }

 }

 export default Logo;

