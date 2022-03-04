import { Component } from "react";
import { View,Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput, Button, Image} from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import styles from "./modules/stylesheet";

class UploadPicture extends Component{
    constructor(props){
        super(props);
        
        this.state = {
          hasPermission: null,
          type: Camera.Constants.Type.front
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
          this.props.navigation.navigate("Profile");
        })
        .catch((err) => {
          console.log(err);
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
      justifyContent: 'space-around',
      alignItems: 'space-around',
    },

    flipButtonContainer:{
      flex: 1,
    },

    captureButtonContainer:{
      flex: 1,
    },

    button: {
      flex: 0.1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },

    text: {
      fontSize: 18,
      color: 'white',
    },
  });

export default UploadPicture;