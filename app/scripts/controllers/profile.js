'use strict';

angular.module('openhimWebui2App')
  .controller('ProfileCtrl', function ($scope, login, Api, Notify) {
    var update = true;
    $scope.user = login.getLoggedInUser();

    var done = function () {
      // reset backing object and refresh users list
      $scope.user = new Api.Users();
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
