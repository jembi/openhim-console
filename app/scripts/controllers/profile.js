'use strict';
/* global getHashAndSalt: false */
/* global isValidMSISDN: false */

angular.module('openhimConsoleApp')
  .controller('ProfileCtrl', function ($http, $scope, $timeout, Api, login, Alerting) {

    /****************************************************************/
    /**   These are the functions for the Profile initial load     **/
    /****************************************************************/

    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);
    $scope.consoleSession = consoleSession;

    // object for the taglist roles
    $scope.taglistUserRoleOptions = [];

    // object to store temp values like password (not associated with schema object)
    $scope.temp = {};

    // get the allowed channels for the transaction settings
    Api.Channels.query(function(channels){
      $scope.channels = channels;

      $scope.components = [];
      // setup components object
      angular.forEach(channels, function(channel){
        $scope.components.push({ key: channel.name, event: channel.name });

        angular.forEach(channel.routes, function(route){
          $scope.components.push({ key: 'route-'+route.name, event: '----> route-'+route.name });
        });
      });
    }, function(){ /* server error - could not connect to API to get channels */ });

    // get the users for the taglist roles options
    Api.Users.query(function(users){
      angular.forEach(users, function(user){
        angular.forEach(user.groups, function(group){
          if ( $scope.taglistUserRoleOptions.indexOf(group) === -1 ){
            $scope.taglistUserRoleOptions.push(group);
          }
        });
      });
    }, function(){ /* server error - could not connect to API to get Users */ });

    var querySuccess = function (user) {
      $scope.user = user;

      // check visualizer settings properties exist
      if ( !$scope.user.settings ){
        $scope.user.settings = {};
      }

      if ( !$scope.user.settings.list ){
        $scope.user.settings.list = {};
      }

      if ( !$scope.user.settings.filter ){
        $scope.user.settings.filter = {};
      }

      if ( !$scope.user.settings.visualizer ){
        $scope.user.settings.visualizer = {};

        // load default visualizer config for user with no visualizer settings
        $http.get('config/visualizer.json').success(function( visualizerConfig ) {
          angular.extend( $scope.user.settings.visualizer, angular.copy( visualizerConfig ) );
        });
      }
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

    var success = function (user, password) {
      // update consoleSession with new userSettings
      $scope.consoleSession.sessionUserSettings = user.settings;
      localStorage.setItem('consoleSession', JSON.stringify( $scope.consoleSession ));

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
      var userObject = angular.copy(user);
      user.$update({}, function(){
        success(userObject, password);

        // rootScope function to scroll to top
        $scope.goToTop();
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




    /*******************************************/
    /**   Settings - Visualizer Functions     **/
    /*******************************************/

    // setup visualizer object
    $scope.visualizer = {};

    $scope.addSelectComponentEndpoint = function(type){
      // check type and add to correct object
      if ( type === 'component' ){
        $scope.user.settings.visualizer.components.push({ event: $scope.visualizer.addSelectComponent, desc: $scope.visualizer.addSelectComponent });
        $scope.visualizer.addSelectComponent = null;
      }else if( type === 'endpoint' ){
        $scope.user.settings.visualizer.endpoints.push({ event: 'channel-'+$scope.visualizer.addSelectEndpoint.name, desc: $scope.visualizer.addSelectEndpoint.name });
        $scope.visualizer.addSelectEndpoint = null;
      }
    };

    $scope.addComponentEndpoint = function(type){
      // check type and add to correct object
      if ( type === 'component' ){
        $scope.user.settings.visualizer.components.push({ event: $scope.visualizer.addComponent.event, desc: $scope.visualizer.addComponent.desc });
        $scope.visualizer.addComponent.event = '';
        $scope.visualizer.addComponent.desc = '';
      }else if( type === 'endpoint' ){
        $scope.user.settings.visualizer.endpoints.push({ event: 'channel-'+$scope.visualizer.addEndpoint.event, desc: $scope.visualizer.addEndpoint.desc });
        $scope.visualizer.addEndpoint.event = '';
        $scope.visualizer.addEndpoint.desc = '';
      }
    };

    $scope.removeComponentEndpoint = function(type, index){
      if ( type === 'component' ){
        $scope.user.settings.visualizer.components.splice(index, 1);
      }else if( type === 'endpoint' ){
        $scope.user.settings.visualizer.endpoints.splice(index, 1);
      }
    };

    /*******************************************/
    /**   Settings - Visualizer Functions     **/
    /*******************************************/









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
