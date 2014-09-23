'use strict';
/* global getHashAndSalt: false */
/* global isValidMSISDN: false */

angular.module('openhimWebui2App')
  .controller('UsersModalCtrl', function ($scope, $modalInstance, $timeout, Api, login, Notify, Alerting, user) {

    /*************************************************************/
    /**   These are the functions for the User initial load     **/
    /*************************************************************/

    // object for the taglist roles
    $scope.taglistRoleOptions = [];

    // object to store temp values like password (not associated with schema object)
    $scope.temp = {};

    // get the users for the taglist roles options
    var users = Api.Users.query(function(){
      angular.forEach(users, function(user){
        angular.forEach(user.groups, function(group){
          if ( $scope.taglistRoleOptions.indexOf(group) === -1 ){
            $scope.taglistRoleOptions.push(group);
          }
        });
      });
    },
    function(){
      // server error - could not connect to API to get Users
    });

    // get/set the users scope whether new or update
    if (user) {
      $scope.update = true;
      $scope.user = angular.copy(user);
    }else{
      $scope.update = false;
      $scope.user = new Api.Users();
    }

    /*************************************************************/
    /**   These are the functions for the User initial load     **/
    /*************************************************************/



    /************************************************************/
    /**   These are the functions for the User Modal Popup     **/
    /************************************************************/

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
    
    /************************************************************/
    /**   These are the functions for the User Modal Popup     **/
    /************************************************************/



    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };



    /************************************************************************/
    /**   These are the general functions for the User form validation     **/
    /************************************************************************/

    $scope.validateFormUsers = function(){

      // reset hasErrors alert object
      Alerting.AlertReset('hasErrors');

      // clear timeout if it has been set
      $timeout.cancel( $scope.clearValidation );

      $scope.ngError = {};
      $scope.ngError.hasErrors = false;

      // name validation
      if( !$scope.user.email ){
        $scope.ngError.email = true;
        $scope.ngError.hasErrors = true;
      }

      // name validation
      if( !$scope.user.firstname ){
        $scope.ngError.firstname = true;
        $scope.ngError.hasErrors = true;
      }

      // domain validation
      if( !$scope.user.surname ){
        $scope.ngError.surname = true;
        $scope.ngError.hasErrors = true;
      }

      // roles validation
      if( $scope.user.msisdn && !isValidMSISDN($scope.user.msisdn) ){
        $scope.ngError.msisdn = true;
        $scope.ngError.hasErrors = true;
      }

      // groups validation
      if( !$scope.user.groups || $scope.user.groups.length===0){
        $scope.ngError.groups = true;
        $scope.ngError.hasErrors = true;
      }

      // password validation
      if( $scope.temp.password ){
        if( !$scope.temp.passwordConfirm || $scope.temp.password !== $scope.temp.passwordConfirm ){
          $scope.ngError.passwordConfirm = true;
          $scope.ngError.hasErrors = true;
        }
      }

      if ( $scope.ngError.hasErrors ){
        $scope.clearValidation = $timeout(function(){
          // clear errors after 5 seconds
          $scope.ngError = {};
        }, 5000);
        Alerting.AlertAddMsg('hasErrors', 'danger', $scope.validationFormErrorsMsg);
      }

    };

    $scope.submitFormUsers = function(){
      // validate the form first to check for any errors
      $scope.validateFormUsers();

      // save the user object if no errors are present
      if ( $scope.ngError.hasErrors === false ){
        $scope.save($scope.user, $scope.temp.password);
      }
    };

    /************************************************************************/
    /**   These are the general functions for the User form validation     **/
    /************************************************************************/

  });