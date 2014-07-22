'use strict';
/* global CryptoJS: false */

angular.module('openhimWebui2App')
  .factory('login', function (Api, Authinterceptor) {

    var userProfile = {};

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
            // Fetch currently logged in user's profile
            userProfile = Api.Users.get({ email: email }, function (userProfile) {
              // notify the authInterceptor of a logged in user
              Authinterceptor.setLoggedInUser(userProfile);
              done(true);
              return  userProfile;
            }, function (){
              done(false);
            });
          },
          function () {
            done(false);
          });
      },
      logout: function () {
        userProfile = null;
      },
      getLoggedInUser: function () {
        return userProfile;
      },
      isLoggedIn: function () {
        return !!userProfile.passwordHash;
      }
    };
  });
