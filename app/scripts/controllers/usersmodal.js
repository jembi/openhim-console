'use strict';
/* global getHashAndSalt: false */
/* global isValidMSISDN: false */

angular.module('openhimWebui2App')
  .controller('UsersModalCtrl', function ($scope, $modalInstance, Api, login, Notify, Alerting, user) {

    $scope.password = '';
    $scope.passwordConfirm = '';

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

      var consoleSession = localStorage.getItem('consoleSession');
      consoleSession = JSON.parse(consoleSession);

      if ( $scope.user.email === consoleSession.sessionUser ){
        if ( $scope.password ){
          login.login($scope.user.email, $scope.password, function (loggedIn) {
            if (loggedIn) {
              // add the success message
              Alerting.AlertAddMsg('top', 'success', 'Your details has been saved succesfully and you were logged in with your new credentials');
              notifyUser();
            } else {
              // add the success message
              Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while trying to log you in again with you new credentials');
              notifyUser();
            }
          });
        }else{
          // add the success message
          Alerting.AlertAddMsg('top', 'success', 'Your details has been saved succesfully');
          notifyUser();
        }
      }else{
        // add the success message
        Alerting.AlertAddMsg('top', 'success', 'The user has been saved successfully');
        notifyUser();
      }
      
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
        $scope.password = password;
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

      // user being updated and no pnew password supplied
      if (!password && $scope.update === true){
        return true;
      }else{
        // either user is new or password being updated
        if ( password === passwordConfirm ){
          return true;
        }else{
          return false;
        }
      }
    };

    // assign function to $scope object to validate via ng binding
    $scope.isValidMSISDN = function(inputtxt){
      // util function defined in utils.js
      return isValidMSISDN(inputtxt);
    };

  });