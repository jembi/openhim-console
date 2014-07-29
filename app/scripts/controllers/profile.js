'use strict';
/* global getHashAndSalt: false */

angular.module('openhimWebui2App')
  .controller('ProfileCtrl', function ($scope, Api, login, Alerting) {

    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);
    $scope.consoleSession = consoleSession;


    /* -------------------------Initial load & onChanged---------------------------- */
    var querySuccess = function (user) {
      $scope.user = user;
    };

    var queryError = function (err) {
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    // do the initial request
    Api.Users.get({ email: $scope.consoleSession.sessionUser }, querySuccess, queryError);
    /* -------------------------Initial load & onChanged---------------------------- */


    /* -------------------------Processing save request-----------------------------*/
    var success = function () {
      // add the success message
      Api.Users.get({ email: $scope.consoleSession.sessionUser }, querySuccess, queryError);
      $scope.alerts = [];
      Alerting.AlertAddMsg('top', 'success', 'Your user details have been updated succesfully.');
    };

    var error = function (err) {
      // add the error message
      $scope.alerts = [];
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving your details: #' + err.status + ' - ' + err.data);
    };


    var saveUser = function (user, email, password) {
      user.$update(function () {
        if (password !== '') {
          //re-login with new credentials
          console.log(user.email);
          login.login(email, password, function (loggedIn) {

            if (loggedIn) {
              success();
            } else {
              error();
            }
          });
        } else {
          success();
        }
      });

    };

    var setHashAndSave = function (user, hash, salt, email, password) {
      if (typeof salt !== 'undefined' && salt !== null) {
        user.passwordSalt = salt;
      }
      user.passwordHash = hash;
      saveUser(user, email, password);
    };

    $scope.save = function (user, password) {
      if (password) {
        var h = getHashAndSalt(password);
        user.passwordAlgorithm = h.algorithm;
        console.log(user.password);
        setHashAndSave(user, h.hash, h.salt, user.email, password);
      } else {
        saveUser(user, '', '');
      }
    };
    /* -------------------------Processing save request-----------------------------*/

    $scope.isUserValid = function (password, passwordConfirm) {
      if (password && password === passwordConfirm) {
        return true;
      } else {
        return false;
      }
    };

  });
