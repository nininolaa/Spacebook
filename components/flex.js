import React, {Component} from 'react';
import {View , StyleSheet, ScrollView} from 'react-native';

class Flex extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
          
            <View style={styles.flexContainer}>
                <View style = {styles.firstrow}>
                    <View style= {styles.viewOne}></View>
                    <View style= {styles.viewTwo}></View>
                </View>

                <View style = {styles.secondrow}>
                    <View style= {styles.viewThree}></View>
                    <View style= {styles.viewFour}></View>
                </View>

                <View style = {styles.thirdrow}>
                    <View style= {styles.viewFive}></View>
                    <View style= {styles.viewSix}></View>
                    <View style= {styles.viewSeven}></View>
                    <View style= {styles.viewEight}></View>
                </View>

                <View style = {styles.fourthrow}>
                    <View style= {styles.viewFive}></View>
                    <View style= {styles.viewSix}></View>
                    <View style= {styles.viewSeven}></View>
                    <View style= {styles.viewEight}></View>
                </View>

                <View style = {styles.fifthrow}>
                    <View style= {styles.viewThree}></View>
                    <View style= {styles.viewFour}></View>
                </View>

            </View>
            

        )
    }

}

const styles = StyleSheet.create({

    scrollView: {
        marginHorizontal: 20
    },

    flexContainer: {
        flex: 1,
        backgroundColor: 'whtie',
        flexDirection: 'column'
    },

    firstrow:{
        flex: 2,
        flexDirection: 'row'
    },

    secondrow:{
        flex: 2,
        flexDirection: 'row'
    },

    thirdrow:{
        flex: 3,
    },

    fourthrow:{
        flex: 3,
    },

    fifthrow:{
        flex: 2,
        flexDirection: 'row'
    },
    

    viewOne:{
        flex: 2,
        backgroundColor: '#cbc3e3'
    },

    viewTwo:{
        flex: 2,
        backgroundColor: '#f4c2c2'
    },

    viewThree:{
        flex: 2,
        backgroundColor: 'green'
    },

    viewFour:{
        flex: 2,
        backgroundColor: 'blue'
    },

    viewFive:{
        flex: 1,
        backgroundColor: 'yellow'
    },
    
    viewSix: {
        flex:1,
        backgroundColor: 'orange'
    },

    viewSeven: {
        flex:1,
        backgroundColor: 'red'
    },

    viewEight: {
        flex:1,
        backgroundColor: 'grey'
    },



})

export default Flex;