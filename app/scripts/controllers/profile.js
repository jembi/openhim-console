'use strict';
/* global getHashAndSalt: false */

angular.module('openhimWebui2App')
  .controller('ProfileCtrl', function ($scope, Api, Notify,Authinterceptor) {
    var update = true;
    var email = '';

    $scope.user =  Authinterceptor.getLoggedInUser();
    $scope.user =  Api.Users.get({ email: $scope.user.username }, function (userProfile) {
      return userProfile;
    });



    var done = function () {
      // reset backing object and refresh user profile
      $scope.user =  Api.Users.get({ email: $scope.user.username }, function (userProfile) {
        return userProfile;
      });
      Notify.notify('usersChanged');

    };

    var saveUser = function (user) {
      if (update) {
        user.$update(done);
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
