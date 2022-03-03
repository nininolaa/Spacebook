import React, {Component} from 'react';
import { View,Text, StyleSheet, Button } from 'react-native';
import HomeLogo from '../modules/homeLogo';

 class ErrorAlert extends Component {

    constructor(props){
        super(props);
    }

    render(){
        switch (this.props.route.params.errorCase){

            case "Duplicate":
            return(
                <View style = {stylesIn.flexContainer}>
                    <Text>This user is already exist, please try to register with a new email address</Text>
                </View>
            )

            case "InvalidInfo":
            return(
                <View style = {stylesIn.flexContainer}>
                    <Text>Invalid email or password</Text>
                </View>
            )

            case "Unauthorised":
            return(
                <View style = {stylesIn.flexContainer}>
                    <Text>Unauthorised, Please login</Text>
                </View>
            )

            case "UnauthorisedPost":
            return(
                <View style = {stylesIn.flexContainer}>
                    <Text>You can only view the post of yourself or your friends</Text>
                </View>
            )

            case "UserNotFound":
            return(
                <View style = {stylesIn.flexContainer}>
                    <Text>Not found</Text>
                </View>
            )

            case "BadRequest":
                return(
                <View style = {stylesIn.flexContainer}>
                    <Text>Bad Request</Text>
                </View>
                )

            case "ForbiddenUpdatePost":
                return(
                <View style = {stylesIn.flexContainer}>
                    <Text> Forbidden - you can only update your own posts </Text>
                </View>
                )

            case "ForbiddenLikePost":
                return(
                <View style = {stylesIn.flexContainer}>
                    <Text> Forbidden - you have not liked this post </Text>
                </View>
                )

            case "AlreadyAdded":
                return(
                <View style = {stylesIn.flexContainer}>
                    <Text> User is already added as a friend </Text>
                </View>
                )
                
            case "ViewFriend":
                return(
                <View style = {stylesIn.flexContainer}>
                    <Text> Can only view the friends of yourself or your friends</Text>
                </View>
                )
            case "ServerError":
            return(
                <View style = {stylesIn.flexContainer}>
                    <Text>Can't connect to the server, please try again</Text>
                </View>
            )

            case "WentWrong":
            return(
                <View style = {stylesIn.flexContainer}>
                    <Text>Something went wrong, please try again</Text>
                </View>
            )
        }
    }
 }

 const stylesIn = StyleSheet.create({

    flexContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
 
 })

 export default ErrorAlert ;


