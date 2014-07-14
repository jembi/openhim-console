'use strict';
/* global CryptoJS: true */

angular.module('openhimWebui2App')
  .factory('Authinterceptor', function () {

    var user;

    return {
      'setLoggedInUser': function (u) {
        user = u;
      },
      'getLoggedInUser': function() {
        return user;
      },
      'request': function (config) {

        if (user) {

          var consoleSession = localStorage.getItem('consoleSession');
          consoleSession = JSON.parse(consoleSession);

          var passwordhash = user.passwordHash;
          var requestSalt = CryptoJS.lib.WordArray.random(16).toString();
          var requestTS = new Date().toISOString();
          var username = user.username;

          var sha512 = CryptoJS.algo.SHA512.create();
          sha512.update(passwordhash);
          sha512.update(requestSalt);
          sha512.update(requestTS);
          var hash = sha512.finalize();

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
