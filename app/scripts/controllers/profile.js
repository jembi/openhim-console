'use strict';
/* global getHashAndSalt: false */

angular.module('openhimWebui2App')
  .controller('ProfileCtrl', function ($scope, Api) {

    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);
    $scope.consoleSession = consoleSession;

    $scope.user =  Api.Users.get({ email: $scope.consoleSession.sessionUser }, function (userProfile) {
      return userProfile;
    });

    var done = function () {
      // reset backing object and refresh user profile
      Api.Users.get({ email: $scope.consoleSession.sessionUser }, function (userProfile) {
        $scope.user = userProfile;
      });
    };

    var saveUser = function (user) {
      user.$update(user);
      done(user);
    };

    var setHashAndSave = function (user, hash, salt) {
      if (typeof salt !== 'undefined' && salt !== null) {
        user.passwordSalt = salt;
      }
      user.passwordHash = hash;
      saveUser(user);
    };

    $scope.save = function (user, password) {
      if (password) {
        var h = getHashAndSalt(password);
        user.passwordAlgorithm = h.algorithm;
        setHashAndSave(user, h.hash, h.salt);
      } else {
        saveUser(user);
      }
    };

    $scope.isUserValid = function (user, password, passwordRetype) {
      return  !(password && password !== passwordRetype);
    };
  });
