'use strict';
/* global getHashAndSalt: false */
/* global isValidMSISDN: false */

angular.module('openhimWebui2App')
  .controller('UsersModalCtrl', function ($http, $scope, $modalInstance, $timeout, Api, login, Notify, Alerting, user) {

    /*************************************************************/
    /**   These are the functions for the User initial load     **/
    /*************************************************************/

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

    // get/set the users scope whether new or update
    if (user) {
      $scope.update = true;
      $scope.user = angular.copy(user);

      // check visualizer settings properties exist
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

    }else{
      $scope.update = false;
      $scope.user = new Api.Users();

      // create visualizer settings properties
      $scope.user.settings = {};
      $scope.user.settings.list = {};
      $scope.user.settings.filter = {};
      $scope.user.settings.visualizer = {};

      // load default visualizer config for new user
      $http.get('config/visualizer.json').success(function( visualizerConfig ) {
        angular.extend( $scope.user.settings.visualizer, angular.copy( visualizerConfig ) );
      });
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

        // update consoleSession with new userSettings
        consoleSession.sessionUserSettings = $scope.user.settings;
        localStorage.setItem('consoleSession', JSON.stringify( consoleSession ));

        if ( $scope.password ){
          login.login($scope.user.email, $scope.password, function (loggedIn) {
            if (loggedIn) {
              // add the success message
              Alerting.AlertAddMsg('top', 'success', 'Your details has been saved succesfully and you were logged in with your new credentials');
              notifyUser();
            } else {
              // add the error message
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