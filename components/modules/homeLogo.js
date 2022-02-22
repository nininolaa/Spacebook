import React, {Component} from 'react';
import { View, Image , StyleSheet} from 'react-native';

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
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
       // marginBottom: '30%',
        width: '100%',
        height: 150,
        resizeMode: 'contain'
     },
 })

 export default HomeLogo;

