import AsyncStorage from '@react-native-async-storage/async-storage';

export function likePost(token, user_id, post_id) {

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
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
                case 401:
                    throw 'Unauthorised'
                    break
                case  403:
                    throw '	Forbidden - You have already liked this post'
                    break
                case 404:
                    throw 'Not found'
                    break
                default:
                    throw 'Something went wrong'
                    break
           }
        })
        .then((responseJson) => {
            console.log("Liked");
        })
        .catch((error) => {
            console.log(error);
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
            console.log("Unliked");
        })
        .catch((error) => {
            console.log(error);
        })
}
