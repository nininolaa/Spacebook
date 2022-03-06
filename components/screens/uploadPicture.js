import { Component } from "react";
import { View,Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import styles from "./modules/stylesheet";

class UploadPicture extends Component{
    constructor(props){
        super(props);
        
        this.state = {
          hasPermission: null,
          type: Camera.Constants.Type.front,
          alertMessage: ''
        }
    }

    async componentDidMount(){

          const { status } = await Camera.requestCameraPermissionsAsync();
          this.setState({hasPermission: status === 'granted'});
        
    }

    uploadImage = async (data) => {
        let token = await AsyncStorage.getItem('@session_token')
        let user_id = await AsyncStorage.getItem('user_id')
    
        let res = await fetch(data.base64);
        let blob = await res.blob();
    
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", {
          method: "POST",
          headers: {
              "Content-Type": "image/png",
              "X-Authorization": token 
          },
          body: blob
        })
        .then((response) => {
          console.log("Picture added", response);
          switch(response.status){
            case 200: 
                this.props.navigation.navigate("Profile");
                break
            case 400:
                throw {errorCase: "BadRequest"}
                break
            case 401:
                throw {errorCase: "Unauthorised"}
                break
            case 404:
                throw {errorCase: "NotFound"}
                break
            case 500:
                throw {errorCase: "ServerError"}
                break
            default:
                throw {errorCase: "WentWrong"}
                break
        }
          
        })
        .catch((err) => {
          console.log(err);
          switch (error.errorCase){

            case 'BadRequest':    
                this.setState({
                    alertMessage: 'Bad request, please try again',
                    isLoading: false,
                })
                break
            case 'Unauthorised':    
                this.setState({
                    alertMessage: 'Unauthorised, please login',
                    isLoading: false,
                })
                break     
            case 'NotFound':    
                this.setState({
                    alertMessage: 'Not found',
                    isLoading: false,
                })
                break
            case "ServerError":
                this.setState({
                    alertMessage: 'Cannot connect to the server, please try again',
                    isLoading: false,
                })
                break
            case "WentWrong":
                this.setState({
                    alertMessage: 'Something went wrong, please try again',
                    isLoading: false,
                })
                break
        }
        })
    }
    
    takePicture = async () => {
        if(this.camera){
            const options = {
            quality: 0.5,
            base64: true,
            onPictureSaved: (data) => this.uploadImage(data)
            };
            await this.camera.takePictureAsync(options);
        }
    }

    render(){
        return(
            <View style={styles.container} >
                <Camera 
                style={styles.camera} 
                type={this.state.type}
                ref={ref => {this.camera = ref}}>
                <View style={styles.buttonContainer}>
                  <View style={styles.flipButtonContainer}>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        let type = type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back;

                        this.setState({type: type});
                    }}>
                    <Text style={styles.text}> Flip </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.captureButtonContainer}>
                    <TouchableOpacity
                    onPress={() => {this.takePicture()}}
                    ><Text style={styles.text}>Take Picture</Text></TouchableOpacity>
                    <Text style = {styles.errorMessage}>{this.state.alertMessage}</Text>
                  </View>
                </View>
                </Camera>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    
    camera: {
      flex: 1,
    },

    buttonContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      margin: 20,
      justifyContent: 'flex-end',
      alignItems: 'space-around',
    },

    flipButtonContainer:{
      flex: 1,
      justifyContent:'flex-start',
      alignItems: 'flex-start'
    },

    captureButtonContainer:{
      flex: 1,
      alignItems: 'flex-end'
    },

    button: {
      flex: 0.1,
    },

    text: {
      fontSize: 18,
      color: 'black',
      fontWeight: 3,
    },
  });

export default UploadPicture;