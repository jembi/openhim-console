'use strict';
/* global getHashAndSalt: false */
/* global isValidMSISDN: false */

angular.module('openhimWebui2App')
  .controller('ProfileCtrl', function ($scope, $timeout, Api, login, Alerting) {

    /****************************************************************/
    /**   These are the functions for the Profile initial load     **/
    /****************************************************************/

    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);
    $scope.consoleSession = consoleSession;

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

    var querySuccess = function (user) {
      $scope.user = user;
    };

    var queryError = function (err) {
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    // do the initial request
    Api.Users.get({ email: $scope.consoleSession.sessionUser }, querySuccess, queryError);
    
    /****************************************************************/
    /**   These are the functions for the Profile initial load     **/
    /****************************************************************/



    /****************************************************************/
    /**   These are the functions for the Profile save process     **/
    /****************************************************************/

    var success = function (password) {
      // add the success message
      if (password !== '') {
        //re-login with new credentials
        login.login($scope.consoleSession.sessionUser, password, function (loggedIn) {
          if (loggedIn) {
            Api.Users.get({ email: $scope.consoleSession.sessionUser }, querySuccess, queryError);
          } else {
            error();
          }
        });
      } else {
        Api.Users.get({ email: $scope.consoleSession.sessionUser }, querySuccess, queryError);
      }

      Alerting.AlertReset();
      Alerting.AlertAddMsg('top', 'success', 'Your user details have been updated succesfully.');
    };

    var error = function (err) {
      // add the error message
      Alerting.AlertReset();
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving your details: #' + err.status + ' - ' + err.data);
    };


    var saveUser = function (user, password) {
      user.$update({}, function(){
        success(password);
      });
    };

    var setHashAndSave = function (user, hash, salt,password) {
      if (typeof salt !== 'undefined' && salt !== null) {
        user.passwordSalt = salt;
      }
      user.passwordHash = hash;
      saveUser(user, password);
    };

    $scope.save = function (user, password) {
      if (password) {
        var h = getHashAndSalt(password);
        user.passwordAlgorithm = h.algorithm;

        setHashAndSave(user, h.hash, h.salt, password);
      } else {
        saveUser(user, '');
      }
    };
    
    /****************************************************************/
    /**   These are the functions for the Profile save process     **/
    /****************************************************************/



    /***************************************************************************/
    /**   These are the general functions for the Profile form validation     **/
    /***************************************************************************/

    $scope.validateFormProfile = function(){

      // reset hasErrors alert object
      Alerting.AlertReset('hasErrors');
      Alerting.AlertReset('top');

      // clear timeout if it has been set
      $timeout.cancel( $scope.clearValidation );

      $scope.ngError = {};
      $scope.ngError.hasErrors = false;

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
      if( $scope.userGroupAdmin && $scope.user.groups.length  ===0){
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

    $scope.submitFormProfile = function(){
      // validate the form first to check for any errors
      $scope.validateFormProfile();
      // save the user object if no errors are present
      if ( $scope.ngError.hasErrors === false ){
        $scope.save($scope.user, $scope.temp.password);
      }
    };

    /**************************************************************************/
    /**   These are the general functions for the Client form validation     **/
    /**************************************************************************/

  });
