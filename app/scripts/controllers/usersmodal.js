'use strict';
/* global CryptoJS: false */

angular.module('openhimWebui2App')
  .controller('UsersModalCtrl', function ($scope, $modalInstance, Api, Notify, user) {
    var update = false;
    if (user) {
      update = true;
    }

    $scope.user = user || new Api.Users();

    var done = function () {
      // reset backing object and refresh users list
      $scope.user = new Api.Users();
      Notify.notify('usersChanged');

      $modalInstance.close();
    };

    var saveClient = function (user) {
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
      saveClient(user);
    };

    var hashSHA512 = function (user, password) {
      var salt = CryptoJS.lib.WordArray.random(16).toString();
      var sha512 = CryptoJS.algo.SHA512.create();
      sha512.update(password);
      sha512.update(salt);
      var hash = sha512.finalize();
      user.passwordAlgorithm = 'sha512';
      setHashAndSave(user, hash.toString(CryptoJS.enc.Hex), salt);
    };

    $scope.save = function (user, password) {
      if (password) {
        hashSHA512(user, password);
      } else {
        saveClient(user);
      }

    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.isUserValid = function (user, password, passwordRetype) {
      return  !(password && password !== passwordRetype);
    };
  });
