'use strict';
/* global getHashAndSalt: false */
/* global isValidMSISDN: false */

angular.module('openhimConsoleApp')
  .controller('UsersModalCtrl', function ($http, $scope, $modalInstance, $timeout, Api, login, Notify, Alerting, user) {

    /*************************************************************/
    /**   These are the functions for the User initial load     **/
    /*************************************************************/

    // default - update is false
    $scope.update = false;

    // object for the taglist roles
    $scope.taglistUserRoleOptions = [];

    // object to store temp values like password (not associated with schema object)
    $scope.temp = {};

    // get the allowed channels for the transaction settings
    Api.Channels.query(function(channels){
      $scope.channels = channels;

      $scope.primaryRoutes = [];
      $scope.secondaryRoutes = [];

      angular.forEach(channels, function(channel){
        angular.forEach(channel.routes, function(route){
          if (route.primary) {
            if ($scope.primaryRoutes.indexOf(route.name) < 0) {
              $scope.primaryRoutes.push(route.name);
            }
          } else {
            if ($scope.secondaryRoutes.indexOf(route.name) < 0) {
              $scope.secondaryRoutes.push(route.name);
            }
          }
        });
      });
    }, function(){ /* server error - could not connect to API to get channels */ });

    Api.Mediators.query(function(mediators){
      $scope.mediators = mediators;
    }, function(){ /* server error - could not connect to API to get mediators */ });

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
      $scope.user = Api.Users.get({ email: user.email }, function () {
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

        var isUsingOldVisualizerSettings = $scope.user.settings.visualizer &&
          $scope.user.settings.visualizer.endpoints && !$scope.user.settings.visualizer.mediators;

        if ( !$scope.user.settings.visualizer || isUsingOldVisualizerSettings){
          if (!isUsingOldVisualizerSettings) {
            $scope.user.settings.visualizer = {};

            // load default visualizer config for user with no visualizer settings
            $http.get('config/visualizer.json').success(function( visualizerConfig ) {
              angular.extend( $scope.user.settings.visualizer, angular.copy( visualizerConfig ) );
            });
          } else {
            // migrate settings
            $scope.user.settings.visualizer.channels = [];
            $scope.user.settings.visualizer.mediators = [];
            $scope.user.settings.visualizer.time.minDisplayPeriod = 100;

            angular.forEach($scope.user.settings.visualizer.endpoints, function (endpoint) {
              $scope.user.settings.visualizer.channels.push({
                eventType: 'channel',
                eventName: endpoint.event.replace('channel-', ''),
                display: endpoint.desc
              });
            });
            delete $scope.user.settings.visualizer.endpoints;

            angular.forEach($scope.user.settings.visualizer.components, function (component) {
              var split = component.event.split('-');
              if (split.length > 1) {
                component.eventType = split[0];
                component.eventName = split[1];
              } else {
                component.eventType = 'channel';
                component.eventName = component.event;
              }
              component.display = component.desc;
              delete component.event;
              delete component.desc;
            });
          }
        }
      });

    }else{
      $scope.user = new Api.Users();

      // create visualizer settings properties
      $scope.user.settings = {};
      $scope.user.settings.list = {};
      $scope.user.settings.filter = {};
      $scope.user.settings.filter.limit = 100;
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

    $scope.addSelectedChannel = function(){
      $scope.user.settings.visualizer.channels.push({ eventType: 'channel', eventName: $scope.visualizer.addSelectChannel.name, display: $scope.visualizer.addSelectChannel.name });
      $scope.visualizer.addSelectChannel = null;
    };

    $scope.addSelectedMediator = function(){
      $scope.user.settings.visualizer.mediators.push({ mediator: $scope.visualizer.addSelectMediator.urn, name: $scope.visualizer.addSelectMediator.name, display: $scope.visualizer.addSelectMediator.name });
      $scope.visualizer.addSelectMediator = null;
    };

    $scope.addComponent = function(){
      if( $scope.visualizer.addComponent.eventType ){
        $scope.user.settings.visualizer.components.push({ eventType: $scope.visualizer.addComponent.eventType, eventName: $scope.visualizer.addComponent.eventName, display: $scope.visualizer.addComponent.display });
        $scope.visualizer.addComponent.eventType = '';
        $scope.visualizer.addComponent.eventName = '';
        $scope.visualizer.addComponent.display = '';
      }
    };

    $scope.removeComponent = function(index){
      $scope.user.settings.visualizer.components.splice(index, 1);
    };

    $scope.removeChannel = function(index){
      $scope.user.settings.visualizer.channels.splice(index, 1);
    };

    $scope.removeMediator = function(index){
      $scope.user.settings.visualizer.mediators.splice(index, 1);
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

      // ensure password check only happens on update
      if( $scope.update ){
        // password validation
        if( $scope.temp.password ){
          if( !$scope.temp.passwordConfirm || $scope.temp.password !== $scope.temp.passwordConfirm ){
            $scope.ngError.passwordConfirm = true;
            $scope.ngError.hasErrors = true;
          }
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
