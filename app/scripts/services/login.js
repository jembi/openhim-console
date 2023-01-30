export function login (Api, Authinterceptor) {
  let userProfile = {}

  return {
    login: function (email, password, done) {
      // fetch salt from openhim-core server and work out password hash
      Api.Authenticate.save({ username: email, password }, function () {
        // on success
        // notify the authInterceptor of a logged in user
        // Verify that you can make authenticated requests
        Api.Users.get({ email: email }, function (profile) {
          userProfile = profile
          Authinterceptor.setLoggedInUser(userProfile)
          done('Authentication Success')
        }, function () {
          // Throw error upon failure
          done('Authentication Failed')
        })
        
      }, function (err) {
        if (err.status < 100) {
          // If the status is outside the possible http status range no then http error

            done('Internal Server Error');
          } else {
            // if error returns a status then server is active - user not authenticated
            done('Authentication Failed');
          }
        }
      );
    },
    logout: function () {
      Api.Logout.get(
        {},
        function () {
          console.log('Logout Successfull');
        },function (err) {
          console.log(err);
        },
      );
      userProfile = null;
    },
    getLoggedInUser: function () {
      return userProfile
    },
    isLoggedIn: function () {
      return userProfile !== null
    }
  }
}
