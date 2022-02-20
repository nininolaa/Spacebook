import React, {Component} from 'react';
import { View, Image , StyleSheet} from 'react-native';

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


 class HomeLogo extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return(
        
        <View style={stylesIn.homeLogo}>
            <Image source={require('../../assets/img/banner.png')} style={stylesIn.logoImg} ></Image> 
            {/* <Image source={require('../../assets/img/Heading.png')} style={styles.headingImgIndex}></Image> */}
        </View>

        )
    }

 }

 const stylesIn = StyleSheet.create({
    logoImg: {
        //position: 'absolute',
        // justifyContent: 'center',
        // alignItems: 'center',
        // alignContent: 'center',
        // width: '100%',
        // height: 150,

        flex: 1,
        width: '100%',
        height: 150,
        resizeMode: 'contain'
     },
 })

 export default HomeLogo;

