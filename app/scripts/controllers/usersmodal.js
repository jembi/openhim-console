'use strict';
/* global getHashAndSalt: false */

angular.module('openhimWebui2App')
  .controller('UsersModalCtrl', function ($scope, $modalInstance, Api, Notify, Alerting, user) {

    // get/set the users scope whether new or update
    if (user) {
      $scope.update = true;
      $scope.user = angular.copy(user);
    }else{
      $scope.update = false;
      $scope.user = new Api.Users();
    }


    /* -------------------------Processing save request-----------------------------*/
    var success = function () {
      // add the success message
      Alerting.AlertAddMsg('top', 'success', 'The user has been saved successfully');
      notifyUser();
    };

    var error = function (err) {
      // add the success message
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving the users\' details: #' + err.status + ' - ' + err.data);
      notifyUser();
    };

    var notifyUser = function(){
      // reset backing object and refresh users list
      Notify.notify('usersChanged');
      $modalInstance.close();
    };

    var saveUser = function (user) {
      if ($scope.update) {
        user.$update(success, error);
      } else {
        user.$save({ email: '' }, success, error);
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
    /* -------------------------Processing save request-----------------------------*/

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.isUserValid = function (password, passwordConfirm) {
      if ( password && password === passwordConfirm ){
        return true;
      }else{
        return false;
      }
    };

  });