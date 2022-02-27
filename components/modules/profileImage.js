import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity , Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class ProfileImage extends Component{
  constructor(props){
    super(props);

    this.token = ''

    this.state = {
      profileImage: ''
    }
  }

  async componentDidMount(){
    console.log(this.props.navigation)
    
    this.token = await AsyncStorage.getItem('@session_token')
    this.getImage()
    this.focusListener = this.props.navigation.addListener('focus', async () => {
      console.log('loaded')
      this.getImage()
    })
    
  }

  getImage() {
    console.log('hi')
      fetch("http://localhost:3333/api/1.0.0/user/" + this.props.userId + "/photo", {
      method: "GET",
      headers: {
          "Content-Type": "image/png",
          "X-Authorization": this.token
      },
    })

    .then((res) => {
      return res.blob();
    })
    .then((resBlob) => {
      this.setState({
        profileImage: URL.createObjectURL(resBlob)
      });   
    })
    .catch((err) => {
      console.log("error", err)
    });
  }

  render(){

    if(this.props.isEditable == false){
      return(
        <View>
          <Image source={{
            uri: this.state.profileImage
          }}
          style = {{
            width: this.props.width,
            height: this.props.height
          }}></Image>
        </View>
      )
    }

    else{
      return(
        <View style={styles.container}>
          <Image source={{
            uri: this.state.profileImage
          }}
          style = {{
            width: this.props.width,
            height: this.props.height
          }}></Image>
          <TouchableOpacity
            style = {styles.navigateBtn}
            onPress = {() => {this.props.navigation.navigate("UploadPicture")}}
            ><Text style = {styles.navigateBtnText}>Upload profile picture</Text>
          </TouchableOpacity>
          
        </View>
      );
      
    }
  }
}

export default ProfileImage;

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