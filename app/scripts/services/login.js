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

            userProfile.email = email;
            userProfile.passwordHash = hash.toString(CryptoJS.enc.Hex);
            // notify the authInterceptor of a logged in user
            Authinterceptor.setLoggedInUser(userProfile);
            //Verify that you can make authenticated requests
            userProfile = Api.Users.get({ email: email }, function (userProfile) {
              Authinterceptor.setLoggedInUser(userProfile);
              done(true);
            }, function (){
              //Throw error upon failure
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
        if (userProfile !== null){
          return typeof(userProfile.passwordHash) !== 'undefined';
        } else {
          return false;
        }
      }
    };
  });
