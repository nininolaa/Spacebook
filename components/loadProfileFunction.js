import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

 class LoadProfileFunction extends Component {

    constructor(props){
        super(props);

        this.state = {
            email: '',
            first_name: '',
            last_name: '',
            friend_count: '',
            user_id: '',
        }
    }

    componentDidMount() {
        this.loadProfile();
    }

    async loadProfile() {
        
        const userId = await AsyncStorage.getItem('user_id');
        const token = await AsyncStorage.getItem('@session_token');

        return fetch("http://localhost:3333/api/1.0.0/user/" + userId, {
            method: 'get',
            headers: {
                "X-Authorization": token,
                'Content-Type': 'application/json'
            },
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Invalid email or password';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(profile => {
            this.setState(profile)
        }) 
    }

 }



 export default LoadProfileFunction;


