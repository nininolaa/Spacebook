//create a function for like and unlike post 

//create a function to like a post by passing in the needed parameters from the component that use like button
export function likePost(token, userId, post_id) {
  //create a new promise 
  return new Promise((resolve, reject) => {
    //using fetch to call the api and send the post request 
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post/${post_id}/like`, {
      method: 'post',
      //passing the session token to be authorised
      headers: {
        'X-Authorization': token,
      },
    })
      //checking the response status in the return promise
      .then((response) => {
        //if the response status error occured, store the error reasons into the 
        //object array
        switch (response.status) {
          case 200:
            break;
          case 400:
            throw { errorCase: 'Liked' };
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
      //when the call is successful, set the resolve to be true
      .then(() => {
        resolve(true);
      })
      //when the promise is rejected, check which error reason from the response was and
      //set the correct error message to each error in order to render the right error message
      //also set the isLoading state to be false as the promise has been rejected
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

//create a function to unlike a post by passing in the needed parameters from the component that use unlike button
export function unlikePost(token, userId, post_id) {
  //create a new promise 
  return new Promise((resolve, reject) => {
    //using fetch to call the api and send the delete request 
    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post/${post_id}/like`, {
      method: 'delete',
      //passing the session token to be authorised
      headers: {
        'X-Authorization': token,
      },
    })
      //checking the response status in the return promise
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
      //if the response status error occured, store the error reasons into the 
      //object array
      .then(() => {
        resolve(true);
      })
      //when the promise is rejected, check which error reason from the response was and
      //set the correct error message to each error in order to render the right error message
      //also set the isLoading state to be false as the promise has been rejected
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
