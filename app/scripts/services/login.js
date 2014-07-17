'use strict';
/* global CryptoJS: false */

angular.module('openhimWebui2App')
  .factory('login', function (Api, Authinterceptor) {

    var username = null;
    var passwordhash = null;
    var userProfile = {
      username: false,
      passwordHash: false
    };

    return {
      login: function (email, password, done) {
        // fetch salt from openhim-core serer and work out password hash
        Api.Authenticate.get({ email: email }, function (authDetails) {
            // on success
            if (!authDetails.salt) {
              done(false);
            }

            var sha512 = CryptoJS.algo.SHA512.create();
            sha512.update(authDetails.salt);
            sha512.update(password);
            var hash = sha512.finalize();

            passwordhash = hash.toString(CryptoJS.enc.Hex);
            username = email;
            // Fetch currently logged in user's profile
            userProfile = Api.Users.get({ email: email }, function (userProfile) {
              done(userProfile);
              return  userProfile;
            }, function (){
              done(false);
            });
            //Add values to UserProfile
            userProfile.passwordHash = passwordhash;
            userProfile.username = email;
            // notify the authInterceptor of a logged in user
            Authinterceptor.setLoggedInUser(userProfile);
          },
          function () {
            // on error
            done(false);
          });
      },
      logout: function () {
        userProfile.email = null;
        userProfile.passwordHash = null;
      },
      getLoggedInUser: function () {
        return userProfile;
      },
      isLoggedIn: function () {
        return !!userProfile.passwordHash;
      }

    };
  });
