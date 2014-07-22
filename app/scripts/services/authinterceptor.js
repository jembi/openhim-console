'use strict';
/* global CryptoJS: true */

angular.module('openhimWebui2App')
  .factory('Authinterceptor', function () {

    var user = localStorage.getItem('loggedOnUser');
    user = JSON.parse(user);

    return {
      'setLoggedInUser': function (u) {
        user = u;
        localStorage.setItem('loggedOnUser', JSON.stringify( user ));
      },
      'getLoggedInUser': function() {
        var user = localStorage.getItem('loggedOnUser');
        user = JSON.parse(user);
        return user;
      },
      'request': function (config) {

        if (user) {

          var passwordhash = user.passwordHash;
          var requestSalt = CryptoJS.lib.WordArray.random(16).toString();
          var requestTS = new Date().toISOString();
          try {
            /**
             * Try and syncronize with server time
             *
             */
           requestTS = new Date(Math.abs(new Date().getTime() + user.timeDiff)).toISOString();
          } catch (e) {
            console.log(e.message);
          }
          var username = user.username || user.email;

          var sha512 = CryptoJS.algo.SHA512.create();
          sha512.update(passwordhash);
          sha512.update(requestSalt);
          sha512.update(requestTS);
          var hash = sha512.finalize();

          /**
           * This console.log has been left here so that you can view the time diff between your client and the server
           * adjust client accordingly to test.
           * This will be removed when the code is merged into master
           */
          console.log('timeDiff: ' + user.timeDiff);

          config.headers['auth-username'] = username;
          config.headers['auth-ts'] = requestTS;
          config.headers['auth-salt'] = requestSalt;
          config.headers['auth-token'] = hash.toString(CryptoJS.enc.Hex);
        }

        return config;
      }
    };
  }).config(function ($httpProvider) {
    $httpProvider.interceptors.push('Authinterceptor');
  });
