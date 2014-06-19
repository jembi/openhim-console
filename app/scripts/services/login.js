'use strict';
/* global CryptoJS: false */

angular.module('openhimWebui2App')
  .factory('login', function (Api, Authinterceptor) {

    var username = null;
    var passwordhash = null;
    var firstname = null;
    var surname = null;
    var groups = null;

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
            Api.Users.get({ email: email }, function (userProfile) {
              firstname = userProfile.firstname;
              surname = userProfile.surname;
              groups = userProfile.groups;
            });

            // notify the authInterceptor of a logged in user
            Authinterceptor.setLoggedInUser({
              username: username,
              passwordhash: passwordhash
            });

            done(true);
          },
          function () {
            // on error
            done(false);
          });
      },
      logout: function () {
        username = null;
        passwordhash = null;
      },
      getLoggedInUser: function () {
        return {
          username: username,
          passwordhash: passwordhash,
          firstname: firstname,
          surname: surname,
          groups: groups

        };
      },
      isLoggedIn: function () {
        return !!passwordhash;
      }

    };
  });
