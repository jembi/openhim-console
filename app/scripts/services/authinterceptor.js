'use strict';
/* global CryptoJS: false */

angular.module('openhimWebui2App')
  .factory('Authinterceptor', function () {

    //var user = null;
    var user = {
      username: 'root@openhim.org',
      passwordhash: '943a856bba65aad6c639d5c8d4a11fc8bb7fe9de62ae307aec8cf6ae6c1faab722127964c71db4bdd2ea2cdf60c6e4094dcad54d4522ab2839b65ae98100d0fb'
    };

    return {
      'setLoggedInUser': function (u) {
        user = u;
      },
      'getLoggedInUser': function() {
        return user;
      },
      'request': function (config) {

        if (user) {

          var passwordhash = user.passwordhash;
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
