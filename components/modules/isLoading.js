import React, {Component} from 'react';
import { View, StyleSheet, ActivityIndicator, Text} from 'react-native';

 class IsLoading extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={stylesIn.loadingBox}>
                  <ActivityIndicator 
                    size="large" 
                    color='orange'
                  />
                  <Text>Loading..</Text>
            </View>
        )
    }

 }

 const stylesIn = StyleSheet.create({
        loadingBox: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
        }
    },
 )

 export default IsLoading;

