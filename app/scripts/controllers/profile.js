'use strict';
/* global getHashAndSalt: false */

angular.module('openhimWebui2App')
  .controller('ProfileCtrl', function ($scope, Api, Notify,Authinterceptor) {
    var update = true;
    var email = '';

    $scope.user =  Authinterceptor.getLoggedInUser();
    $scope.user =  Api.Users.get({ email: $scope.user.email }, function (userProfile) {
      return userProfile;
    });



    var done = function (user) {
      // reset backing object and refresh user profile
      Api.Users.get({ email: user.email }, function (userProfile) {
        $scope.user = userProfile;
      });

    };

    var saveUser = function (user) {
      if (update) {
        user.$update(done(user));
      } else {
        user.$save({ email: '' }, done);
      }
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
