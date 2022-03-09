import AsyncStorage from '@react-native-async-storage/async-storage';

export function likePost(token, userId, post_id) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post/${post_id}/like`, {
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
            break
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
      .then(() => {
        console.log('Liked');
        resolve(true);
      })
      .catch((error) => {
        console.log(error);
        switch (error.errorCase) {
          case 'Liked':
            reject({
              alertMessage1: 'You already like this post',
            });
            break;
          case 'Unauthorised':
            reject({
              alertMessage1: 'Unauthorised, Please login',
            });
            break;
          case 'ForbiddenLikePost':
            reject({
              alertMessage1: 'Forbidden - You can only like a post of your friends',
            });
            break;
          case 'UserNotFound':
            reject({
              alertMessage1: 'Not found',
            });
            break;
          case 'ServerError':
            reject({
              alertMessage1: 'Cannot connect to the server, please try again',
            });
            break;
          case 'WentWrong':
            reject({
              alertMessage1: 'Something went wrong, please try again',
            });
            break;
        }
      });
  });
}

export function unlikePost(token, userId, post_id) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post/${post_id}/like`, {
      method: 'delete',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        switch (response.status) {
          case 200:
            break;
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
      .then(() => {
        console.log('unliked')
        resolve(true);
      })
      .catch((error) => {
        console.log(error);
        switch (error.errorCase) {
          case 'Unauthorised':
            reject({
              alertMessage1: 'Unauthorised, Please login',
            });
            break;
          case 'ForbiddenLikePost':
            reject({
              alertMessage1: 'Forbidden - you have not like this post yet',
            });
            break;
          case 'UserNotFound':
            reject({
              alertMessage1: 'Not found',
            });
            break;
          case 'ServerError':
            reject({
              alertMessage1: 'Cannot connect to the server, please try again',
            });
            break;
          case 'WentWrong':
            reject({
              alertMessage1: 'Something went wrong, please try again',
            });
            break;
        }
      });
  });
}