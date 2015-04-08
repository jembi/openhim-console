'use strict';

var app = angular.module('openhimConsoleApp');

  app.controller('ChannelsModalCtrl', function ($scope, $modalInstance, $timeout, Api, Notify, Alerting, channel) {

    /****************************************************************/
    /**   These are the functions for the Channel initial load     **/
    /****************************************************************/

    $scope.ngError = {};
    //$scope.ngError.hasErrors = false;

    // used in child and parent controller - ( basic info ) - define globally
    $scope.urlPattern = {};
    $scope.urlPattern.regex = true;

    // used in child and parent controller - ( Content Matching ) - define globally
    $scope.matching = {};
    $scope.matching.contentMatching = 'No matching';

    // get the users for the Channel taglist option and alert users - used in two child controllers
    Api.Users.query(function( users ){
      $scope.users = users;
    },
    function(){ /* server error - could not connect to API to get Users */ });

    
    if (channel) {
      $scope.update = true;
      $scope.channel = angular.copy(channel);
    }else{
      $scope.update = false;
      $scope.channel = new Api.Channels();
    }

    /****************************************************************/
    /**   These are the functions for the Channel initial load     **/
    /****************************************************************/



    /***************************************************************/
    /**   These are the functions for the Channel Modal Popup     **/
    /***************************************************************/

    var success = function () {
      // add the success message
      Alerting.AlertAddMsg('top', 'success', 'The channel has been saved successfully');
      notifyUser();
    };

    var error = function (err) {
      // add the success message
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving the channels\' details: #' + err.status + ' - ' + err.data);
      notifyUser();
    };

    var notifyUser = function(){
      // reset backing object and refresh users list
      Notify.notify('channelsChanged');
      $modalInstance.close();
    };

    $scope.saveOrUpdate = function(channel) {

      // add regex delimiter when true
      if ( $scope.urlPattern.regex === true ){
        channel.urlPattern = '^' + channel.urlPattern + '$';
      }

      switch (channel.type) {
        case 'tcp':
          channel.pollingSchedule = null;
          break;
        case 'tls':
          channel.pollingSchedule = null;
          break;
        case 'polling':
          channel.tcpHost = null;
          channel.tcpPort = null;
          break;
        default:
          channel.pollingSchedule = null;
          channel.tcpHost = null;
          channel.tcpPort = null;
      }

      switch ($scope.matching.contentMatching) {
        case 'RegEx matching':
          channel.matchContentXpath = null;
          channel.matchContentJson = null;
          channel.matchContentValue = null;
          break;
        case 'XML matching':
          channel.matchContentRegex = null;
          channel.matchContentJson = null;
          break;
        case 'JSON matching':
          channel.matchContentRegex = null;
          channel.matchContentXpath = null;
          break;
        default:
          channel.matchContentRegex = null;
          channel.matchContentXpath = null;
          channel.matchContentJson = null;
          channel.matchContentValue = null;
      }

      if ($scope.update) {
        channel.$update(success, error);
      } else {
        channel.$save({ channelId: '' }, success, error);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    /***************************************************************/
    /**   These are the functions for the Channel Modal Popup     **/
    /***************************************************************/



    /***************************************************************************/
    /**   These are the general functions for the channel form validation     **/
    /***************************************************************************/


    $scope.validateFormChannels = function(){

      // reset hasErrors alert object
      Alerting.AlertReset('hasErrors');

      // clear timeout if it has been set
      $timeout.cancel( $scope.clearValidation );

      $scope.ngError.hasErrors = false;

      // send broadcast to children ( routes controller ) to save route if applicable and check route warnings
      $scope.$broadcast('parentSaveRouteAndCheckRouteWarnings');

      // name validation
      if( !$scope.channel.name ){
        $scope.ngError.name = true;
        $scope.ngError.accessBasicInfoTab = true;
        $scope.ngError.hasErrors = true;
      }

      // urlPattern validation
      if( !$scope.channel.urlPattern ){
        $scope.ngError.urlPattern = true;
        $scope.ngError.accessBasicInfoTab = true;
        $scope.ngError.hasErrors = true;
      }

      switch ($scope.channel.type){
        case 'tcp':
          if( !$scope.channel.tcpHost){
            $scope.ngError.tcpHost = true;
            $scope.ngError.hasErrors = true;
          }
          if( !$scope.channel.tcpPort || isNaN($scope.channel.tcpPort) ){
            $scope.ngError.tcpPort = true;
            $scope.ngError.hasErrors = true;
          }
          break;
        case 'tls':
          if( !$scope.channel.tcpHost){
            $scope.ngError.tcpHost = true;
            $scope.ngError.hasErrors = true;
          }
          if( !$scope.channel.tcpPort || isNaN($scope.channel.tcpPort) ){
            $scope.ngError.tcpPort = true;
            $scope.ngError.hasErrors = true;
          }
          break;
        case 'polling':
          if( !$scope.channel.pollingSchedule){
            $scope.ngError.pollingSchedule = true;
            $scope.ngError.hasErrors = true;
          }
          break;
      }

      // roles validation
      if( !$scope.channel.allow || $scope.channel.allow.length===0 ){
        $scope.ngError.allow = true;
        $scope.ngError.accessControlTab = true;
        $scope.ngError.hasErrors = true;
      }

      switch ($scope.matching.contentMatching){
        case 'RegEx matching':
          if( !$scope.channel.matchContentRegex){
            $scope.ngError.matchContentRegex = true;
            $scope.ngError.contentMatchingTab = true;
            $scope.ngError.hasErrors = true;
          }
          break;
        case 'XML matching':
          if( !$scope.channel.matchContentXpath){
            $scope.ngError.matchContentXpath = true;
            $scope.ngError.contentMatchingTab = true;
            $scope.ngError.hasErrors = true;
          }
          if( !$scope.channel.matchContentValue){
            $scope.ngError.matchContentValue = true;
            $scope.ngError.contentMatchingTab = true;
            $scope.ngError.hasErrors = true;
          }
          break;
        case 'JSON matching':
          if( !$scope.channel.matchContentJson){
            $scope.ngError.matchContentJson = true;
            $scope.ngError.contentMatchingTab = true;
            $scope.ngError.hasErrors = true;
          }
          if( !$scope.channel.matchContentValue){
            $scope.ngError.matchContentValue = true;
            $scope.ngError.contentMatchingTab = true;
            $scope.ngError.hasErrors = true;
          }
          break;
      }

      // has route errors
      if ( $scope.ngError.hasRouteWarnings ){
        $scope.ngError.routesTab = true;
        $scope.ngError.hasErrors = true;
      }

      if ( $scope.ngError.hasErrors ){
        $scope.clearValidation = $timeout(function(){
          // clear errors after 5 seconds
          $scope.ngError = {};
          Alerting.AlertReset('hasErrors');

          // send broadcast to children ( routes controller ) to check route warnings
          $scope.$broadcast('parentCheckRouteWarnings');

        }, 5000);
        Alerting.AlertAddMsg('hasErrors', 'danger', $scope.validationFormErrorsMsg);
      }

    };

    $scope.submitFormChannels = function(){
      // validate the form first to check for any errors
      $scope.validateFormChannels();

      // save the channel object if no errors are present
      if ( $scope.ngError.hasErrors === false ){
        $scope.saveOrUpdate($scope.channel);
      }
    };

    /***************************************************************************/
    /**   These are the general functions for the channel form validation     **/
    /***************************************************************************/

  });

  // nested controller for the channel basic info tab
  app.controller('channelBasicInfoCtrl', function ($scope) {

    // if update is true
    if ($scope.update) {
      // check if urlPattern has regex delimiters
      var urlPatternLength = $scope.channel.urlPattern.length;
      if ( $scope.channel.urlPattern.indexOf('^') === 0 && $scope.channel.urlPattern.indexOf('$') === urlPatternLength-1 ){
        var urlPattern = $scope.channel.urlPattern;
        // remove delimiters
        $scope.channel.urlPattern = urlPattern.slice(1,-1);
      }else{
        // update checkbox if no regex delimiters
        $scope.urlPattern.regex = false;
      }
    }else{
      // set default options if new channel
      $scope.channel.type = 'http';
      $scope.channel.authType = 'private';
      $scope.channel.status = 'enabled';
    }

  });

  // nested controller for the channel access control tab
  app.controller('channelAccessControlCtrl', function ($scope, Api) {

    // object for the taglist roles
    $scope.taglistClientRoleOptions = [];
    $scope.taglistUserRoleOptions = [];

    // watch parent scope for 'users' change
    $scope.$parent.$watch( 'users', function(){
      // setup user groups taglist options
      angular.forEach($scope.users, function(user){
        angular.forEach(user.groups, function(group){
          if ( $scope.taglistUserRoleOptions.indexOf(group) === -1 ){
            $scope.taglistUserRoleOptions.push(group);
          }
        });
      });
    });

    // get the roles for the client taglist option
    Api.Clients.query(function(clients){
      angular.forEach(clients, function(client){
        if ( $scope.taglistClientRoleOptions.indexOf(client.clientID) === -1 ){
          $scope.taglistClientRoleOptions.push(client.clientID);
        }
        angular.forEach(client.roles, function(role){
          if ( $scope.taglistClientRoleOptions.indexOf(role) === -1 ){
            $scope.taglistClientRoleOptions.push(role);
          }
        });
      });
    },
    function(){ /* server error - could not connect to API to get clients */  });

  });

  // nested controller for the channel content matching tab
  app.controller('channelContentMatchingCtrl', function ($scope) {

    // if update is true
    if ($scope.update) {

      if( $scope.channel.matchContentRegex ){ $scope.matching.contentMatching = 'RegEx matching'; }
      if( $scope.channel.matchContentJson ){ $scope.matching.contentMatching = 'JSON matching'; }
      if( $scope.channel.matchContentXpath ){ $scope.matching.contentMatching = 'XML matching'; }

    }

  });

  // nested controller for the channel routes tab
  app.controller('channelRoutesCtrl', function ($scope, $timeout, Api, Alerting) {

    /*************************************************/
    /**   Default Channel Routes configurations     **/
    /*************************************************/

    // if channel update is false
    if (!$scope.update) {
      // set default routes array variable
      $scope.channel.routes = [];
    }

    $scope.mediator = {};
    $scope.mediator.route = {};
    $scope.mediators = [];
    $scope.routeAddEdit = false;

    // get the mediators for the route option
    Api.Mediators.query(function(mediators){
      // foreach mediator
      angular.forEach(mediators, function(mediator){
        // foreach endpoint in the mediator
        angular.forEach(mediator.endpoints, function(route){
          $scope.mediators.push({ 'name': mediator.name + ' - ' + route.name, route: route });
        });
      });
    }, function(){ /* server error - could not connect to API to get Mediators */ });

    // get the Trusted Certificates for the Channel routes cert dropdown
    Api.Keystore.query({ type: 'ca' }, function(result){
      $scope.trustedCerts = [];
      angular.forEach(result, function(cert){
        $scope.trustedCerts.push({ _id: cert._id, commonName: 'cn='+cert.commonName });
      });
    },
    function(){ /* server error - could not connect to API to get Trusted Certificates */ });

    /*************************************************/
    /**   Default Channel Routes configurations     **/
    /*************************************************/



    /****************************************/
    /**   Functions for Channel Routes     **/
    /****************************************/

    $scope.resetRouteErrors = function(){
      $scope.ngErrorRoute = {};
      Alerting.AlertReset('route');
      Alerting.AlertReset('hasErrorsRoute');
    };

    $scope.saveRoute = function(index){
      // check for route form errors
      $scope.validateFormRoutes();

      console.log( 'ERRORS' )
      console.log( $scope.ngErrorRoute )

      // push the route object to channel.routes if no errors exist
      if ( $scope.ngErrorRoute.hasErrors === false ){
        
        // if index then this is an update - delete old route based on idex
        if ( typeof( index ) !== undefined && index !== null ){
          // remove old route from array
          $scope.channel.routes.splice( index, 1 );
        }

        // add route to channel.routes array
        $scope.channel.routes.push($scope.newRoute);

        // hide add/edit box
        $scope.routeAddEdit = false;

        // check for route warnings
        $scope.checkRouteWarnings();

      }else{
        // inform parent controller of route errors
        $scope.$parent.ngError.hasRouteWarnings = true;
      }
    };

    // remove route
    $scope.removeRoute = function(index) {
      $scope.channel.routes.splice(index, 1);

      // check for route warnings
      $scope.checkRouteWarnings();
    };

    // add route
    $scope.addEditRoute = function(type, object, index) {

      // reset route errors
      $scope.resetRouteErrors();

      // show add/edit box
      $scope.routeAddEdit = true;

      // create new route object
      if ( type === 'new' ){
        $scope.newRoute = {
          name: '',
          secured: false,
          host: '',
          port: '',
          path: '',
          pathTransform: '',
          primary: false,
          username: '',
          password: '',
          type : 'http'
        };
      }else if ( type === 'edit' ){
        // set new/edit route to supplied object
        $scope.newRoute = angular.copy( object );
        $scope.oldRouteIndex = index;
      }else if ( type === 'mediator' ){
        // create mediator route object
        $scope.newRoute = {
          name: $scope.mediator.route.route.name,
          secured: false,
          host: $scope.mediator.route.route.host,
          port: $scope.mediator.route.route.port,
          path: '',
          pathTransform: '',
          primary: false,
          username: '',
          password: '',
          type : $scope.mediator.route.route.type
        };
        // reset selected mediator option
        $scope.mediator.route = null;
      }

    };

    $scope.cancelRouteAddEdit = function(){
      // clear timeout if it has been set
      $timeout.cancel( $scope.clearValidationRoute );

      $scope.resetRouteErrors();

      // check for route warnings
      $scope.checkRouteWarnings();

      // hide add/edit box
      $scope.routeAddEdit = false;
    };


    /****************************************/
    /**   Functions for Channel Routes     **/
    /****************************************/



    /****************************************************/
    /**   Functions for Channel Routes Validations     **/
    /****************************************************/

    $scope.validateFormRoutes = function(){

      // reset hasErrors alert object
      $scope.resetRouteErrors();

      // clear timeout if it has been set
      $timeout.cancel( $scope.clearValidationRoute );

      $scope.ngErrorRoute = {};
      $scope.ngErrorRoute.hasErrors = false;

      // name validation
      if( !$scope.newRoute.name ){
        $scope.ngErrorRoute.name = true;
        $scope.ngErrorRoute.hasErrors = true;
      }

      // host validation
      if( !$scope.newRoute.host ){
        $scope.ngErrorRoute.host = true;
        $scope.ngErrorRoute.hasErrors = true;
      }

      // port validation
      var portError = $scope.checkIsPortValid($scope.newRoute.port);
      if( portError ){
        $scope.ngErrorRoute.port = true;
        $scope.ngErrorRoute.portError = portError;
        $scope.ngErrorRoute.hasErrors = true;
      }

      // path/transform validation
      var pathTransformError = $scope.checkPathTransformPathSet($scope.newRoute);
      if( pathTransformError ){
        $scope.ngErrorRoute.pathTransform = true;
        $scope.ngErrorRoute.pathTransformError = pathTransformError;
        $scope.ngErrorRoute.hasErrors = true;
      }

      if ( $scope.ngErrorRoute.hasErrors ){
        $scope.clearValidationRoute = $timeout(function(){
          // clear errors after 5 seconds
          $scope.resetRouteErrors();
          $scope.checkRouteWarnings();
        }, 5000);
        Alerting.AlertAddMsg('hasErrorsRoute', 'danger', $scope.validationFormErrorsMsg);
      }
    };

    // check required fields for empty inputs
    $scope.checkIsPortValid = function(value) {
      if ( value !== '' && value !== undefined ) {
        if ( isNaN( value ) ){
          // return error message
          return 'Only numbers allowed!';
        }else{
          if ( value <= 0 || value > 65536 ){
            return 'Not in valid port range!';
          }
        }
      }else{
        return 'This field is required!';
      }
    };

    // check both path and pathTransform isnt supplied
    $scope.checkPathTransformPathSet = function(route) {
      // if both supplied
      if ( route.path && route.pathTransform ){
        //return error message
        return 'Cant supply both!';
      }
    };

    $scope.noRoutes = function () {
      //no routes found - return true
      if (!$scope.channel.routes || $scope.channel.routes.length === 0) {
        Alerting.AlertAddMsg('route', 'danger', 'You must supply atleast one route.');
        return true;
      }
      return false;
    };

    $scope.noPrimaries = function () {
      if ($scope.channel.routes) {
        for (var i = 0 ; i < $scope.channel.routes.length ; i++) {
          if ($scope.channel.routes[i].primary === true) {
            // atleast one primary so return false
            return false;
          }
        }
      }
      // return true if no primary routes found
      Alerting.AlertAddMsg('route', 'danger', 'Atleast one of your routes must be set to the primary.');
      return true;
    };

    $scope.multiplePrimaries = function () {
      if ($scope.channel.routes) {
        var routes = $scope.channel.routes;
        var count = 0;
        for (var i = 0 ; i < routes.length ; i++) {
          if (routes[i].primary === true) {
            count++;
          }

          if (count > 1) {
            Alerting.AlertAddMsg('route', 'danger', 'You cannot have multiple primary routes.');
            return true;
          }
        }
      }

      return false;
    };

    // listen for broadcast from parent controller to check route warnings on save
    $scope.$on('parentSaveRouteAndCheckRouteWarnings', function() {
      // if route add/edit true then save route and check for warning
      if ( $scope.routeAddEdit === true ){
        $scope.saveRoute( $scope.oldRouteIndex );
      }else{
        $scope.checkRouteWarnings();
      }
    });

    // listen for broadcast from parent controller to check route warnings
    $scope.$on('parentCheckRouteWarnings', function() {
      $scope.checkRouteWarnings();
    });

    $scope.checkRouteWarnings = function(){
      // reset route errors
      $scope.resetRouteErrors();

      var noRoutes = $scope.noRoutes();
      var noPrimaries = $scope.noPrimaries();
      var multiplePrimaries = $scope.multiplePrimaries();

      if ( noRoutes || noPrimaries || multiplePrimaries ){
        $scope.$parent.ngError.hasRouteWarnings = true;
      }
    };
    // check for route warnings on inital load
    $scope.checkRouteWarnings();

    /****************************************************/
    /**   Functions for Channel Routes Validations     **/
    /****************************************************/

  });

  // nested controller for the channel alerts tab
  app.controller('channelAlersCtrl', function ($scope, Api) {

    // watch parent scope for 'users' change
    $scope.$parent.$watch( 'users', function(){
      // setup usersMap options object
      $scope.usersMap = {};
      angular.forEach($scope.users, function(user){
        $scope.usersMap[user.email] = user.firstname + ' ' + user.surname + ' (' + user.email + ')';
      });
    });

    // get the groups for the Channel Alert Group dropdown
    $scope.alertGroups = Api.ContactGroups.query(function(){
      $scope.groupsMap = {};
      angular.forEach($scope.alertGroups, function(group){
        $scope.groupsMap[group._id] = group.group;
      });
    },
    function(){ /* server error - could not connect to API to get Alert Groups */ });



    /**********************************************************/
    /**   These are the functions for the Channel Alerts     **/
    /**********************************************************/

    // define the alerts backup object
    $scope.channelAlertsBackup = null;
    $scope.newAlert = {};

    $scope.addAlert = function (newAlert) {
      if (!$scope.channel.alerts) {
        $scope.channel.alerts = [];
      }
      $scope.channel.alerts.push(angular.copy(newAlert));
      // reset the backup route object when a record is added
      $scope.channelAlertsBackup = null;

      // reset the alert object
      $scope.newAlert.status = null;
      $scope.newAlert.failureRate = null;
      $scope.newAlert.groups = [];
      $scope.newAlert.users = [];
    };

    $scope.editAlert = function (alertIndex, alert) {

      // remove the selected alert object from scope
      $scope.channel.alerts.splice(alertIndex, 1);

      // if backup object exist update alerts object with backup alert
      if ( $scope.channelAlertsBackup !== null ){
        $scope.channel.alerts.push(angular.copy($scope.channelAlertsBackup));
      }
      // override backup alert object to new alert being editted
      $scope.channelAlertsBackup = angular.copy(alert);

      $scope.newAlert = alert;
    };

    $scope.removeAlert = function (alertIndex) {
      $scope.channel.alerts.splice(alertIndex, 1);
    };

    $scope.isAlertValid = function(){
      if (!$scope.newAlert.status){
        return false;
      }

      if ( (!$scope.newAlert.users || $scope.newAlert.users.length === 0) && (!$scope.newAlert.groups || $scope.newAlert.groups.length === 0) ){
        return false;
      }

      if ($scope.newAlert.status.length !== 3){
        return false;
      }
      return true;
    };

    /**********************************************************/
    /**   These are the functions for the Channel Alerts     **/
    /**********************************************************/






    /***************************************************************/
    /**   These are the functions for the Channel Alert Users     **/
    /***************************************************************/

    // define the alerts users backup object
    $scope.channelAlertsUsersBackup = null;
    $scope.newAlertUser = {};

    $scope.addAlertUser = function (newAlertUser) {
      if (!$scope.newAlert.users) {
        $scope.newAlert.users = [];
      }
      $scope.newAlert.users.push(angular.copy(newAlertUser));
      // reset the backup route object when a record is added
      $scope.channelAlertsUsersBackup = null;

      // reset the backing object
      $scope.newAlertUser.user = '';
      $scope.newAlertUser.method = '';
      $scope.newAlertUser.maxAlerts = '';
    };

    $scope.editAlertUser = function (alertUserIndex, alertUser) {

      // remove the selected alert user object from scope
      $scope.newAlert.users.splice(alertUserIndex, 1);

      // if backup object exist update alerts users object with backup alert user
      if ( $scope.channelAlertsUsersBackup !== null ){
        $scope.newAlert.users.push(angular.copy($scope.channelAlertsUsersBackup));
      }
      // override backup alert user object to new alert user being editted
      $scope.channelAlertsUsersBackup = angular.copy(alertUser);
      $scope.newAlertUser = alertUser;
    };

    $scope.removeAlertUser = function (alertUserIndex) {
      $scope.newAlert.users.splice(alertUserIndex, 1);
    };

    $scope.isAlertUserValid = function(){
      if (!$scope.newAlertUser.user || !$scope.newAlertUser.method || !$scope.newAlertUser.maxAlerts){
        return false;
      }
      return true;
    };

    /***************************************************************/
    /**   These are the functions for the Channel Alert Users     **/
    /***************************************************************/





    /****************************************************************/
    /**   These are the functions for the Channel Alert Groups     **/
    /****************************************************************/

    // define the alerts groups backup object
    $scope.newAlertGroup = {};
    $scope.newAlert.groups = [];

    $scope.addAlertGroup = function (newAlertGroup) {

      if( $scope.newAlert.groups.indexOf(newAlertGroup.group) === -1 ){
        $scope.newAlert.groups.push(angular.copy(newAlertGroup.group));
      }

      // reset the backing object
      $scope.newAlertGroup.group = '';
    };

    $scope.removeAlertGroup = function (alertGroupIndex) {
      $scope.newAlert.groups.splice(alertGroupIndex, 1);
    };

    $scope.isAlertGroupValid = function(){
      if (!$scope.newAlertGroup.group){
        return false;
      }
      return true;
    };

    /****************************************************************/
    /**   These are the functions for the Channel Alert Groups     **/
    /****************************************************************/

  });

  // nested controller for the channel settings tab
  app.controller('channelSettingsCtrl', function ($scope) {

    // if update is false
    if (!$scope.update) {
      // set default variables if new channel
      $scope.channel.requestBody = true;
      $scope.channel.responseBody = true;
    }

  });
