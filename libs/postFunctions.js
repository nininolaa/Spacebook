import AsyncStorage from '@react-native-async-storage/async-storage';

export function likePost(token, user_id, post_id) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}/like`, {
      method: 'post',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        switch (response.status) {
          case 200:
            break;
          case 400:
            throw { errorCase: 'Liked' };
          case 401:
            throw { errorCase: 'Unauthorised' };
            break;
          case 403:
            throw { errorCase: 'ForbiddenLikePost' };
            break;
          case 404:
            throw { errorCase: 'UserNotFound' };
            break;
          case 500:
            throw { errorCase: 'ServerError' };
            break;
          default:
            throw { errorCase: 'WentWrong' };
            break;
        }
      })
      .then((responseJson) => {
        console.log('Posted post ', responseJson);

        resolve(true);
      })
      .catch((error) => {
        console.log(error);
        switch (error.errorCase) {
          case 'Liked':
            reject({
              alertMessage: 'You already like this post',
            });
            break;
          case 'Unauthorised':
            reject({
              alertMessage: 'Unauthorised, Please login',
            });
            break;
          case 'ForbiddenLikePost':
            reject({
              alertMessage: 'Forbidden - you can only delete your own posts',
            });
            break;
          case 'UserNotFound':
            reject({
              alertMessage: 'Not found',
            });
            break;
          case 'ServerError':
            reject({
              alertMessage: 'Cannot connect to the server, please try again',
            });
            break;
          case 'WentWrong':
            reject({
              alertMessage: 'Something went wrong, please try again',
            });
            break;
        }
      });
  });
}

export function unlikePost(token, user_id, post_id) {
  return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}/like`, {
    method: 'delete',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      switch (response.status) {
        case 200:
          return true;
          break;
        case 400:
          throw 'Failed validation';
          break;
        default:
          throw 'Something went wrong';
          break;
      }
    })
    .then((responseJson) => {
      console.log('Unliked');
    })
    .catch((error) => {
      console.log(error);
    });
}
