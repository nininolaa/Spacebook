import AsyncStorage from '@react-native-async-storage/async-storage';

export function likePost(token, user_id, post_id) {

    return new Promise((resolve,reject) => {
        fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
        method: 'post',
        headers: {
            "X-Authorization": token,
            'Content-Type': 'application/json'
        },
        })
        .then((response) => {
        switch(response.status){
            case 200: 
                return true;
                break
            case 400:
                throw 'Failed validation'
                break
            default:
                throw 'Something went wrong'
                break
        }
        })
        .then((responseJson) => {
            console.log("Posted post ", responseJson);
            
            resolve(true);
        })
        .catch((error) => {
            console.log(error);
            reject(false);
        })
    }) 
}

export async function unlikePost(token, user_id, post_id) {

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
        method: 'delete',
        headers: {
            "X-Authorization": token,
            'Content-Type': 'application/json'
        },
        })
        .then((response) => {
        switch(response.status){
            case 200: 
                return true;
                break
            case 400:
                throw 'Failed validation'
                break
            default:
                throw 'Something went wrong'
                break
        }
        })
        .then((responseJson) => {
            console.log("Posted post ", responseJson);
        })
        .catch((error) => {
            console.log(error);
        })
}
