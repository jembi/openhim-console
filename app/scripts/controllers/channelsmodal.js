'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsModalCtrl', function ($scope, $modalInstance, $timeout, Api, Notify, Alerting, channel) {

    /****************************************************************/
    /**   These are the functions for the Channel initial load     **/
    /****************************************************************/

    // object for the taglist roles
    $scope.taglistClientRoleOptions = [];
    $scope.taglistUserRoleOptions = [];

    // object to store temp values like password (not associated with schema object)
    $scope.temp = {};

    // get the mediators for the route option
    Api.Mediators.query(function(mediators){
      $scope.mediator = {};
      $scope.mediator.route = {};
      $scope.mediators = [];

      // foreach mediator
      angular.forEach(mediators, function(mediator){
        // foreach endpoint in the mediator
        angular.forEach(mediator.endpoints, function(route){
          $scope.mediators.push({ 'name': mediator.name + ' - ' + route.name, route: route });
        });
      });
    }, function(){ /* server error - could not connect to API to get Mediators */ });



    // get the users for the Channel taglist option
    $scope.alertUsers = Api.Users.query(function(){
      $scope.usersMap = {};
      angular.forEach($scope.alertUsers, function(user){
        $scope.usersMap[user.email] = user.firstname + ' ' + user.surname + ' (' + user.email + ')';

        angular.forEach(user.groups, function(group){
          if ( $scope.taglistUserRoleOptions.indexOf(group) === -1 ){
            $scope.taglistUserRoleOptions.push(group);
          }
        });
      });
    },
    function(){ /* server error - could not connect to API to get Users */ });

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

    // get the groups for the Channel Alert Group dropdown
    $scope.alertGroups = Api.ContactGroups.query(function(){
      $scope.groupsMap = {};
      angular.forEach($scope.alertGroups, function(group){
        $scope.groupsMap[group._id] = group.group;
      });
    },
    function(){ /* server error - could not connect to API to get Alert Groups */ });

    // get/set the users scope whether new or update
    $scope.matching = {};
    $scope.matching.contentMatching = 'No matching';
    $scope.urlPattern = {};
    $scope.urlPattern.regex = true;
    if (channel) {
      $scope.update = true;
      $scope.channel = angular.copy(channel);

      console.log($scope.channel);

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



      if( channel.matchContentRegex ){ $scope.matching.contentMatching = 'RegEx matching'; }
      if( channel.matchContentJson ){ $scope.matching.contentMatching = 'JSON matching'; }
      if( channel.matchContentXpath ){ $scope.matching.contentMatching = 'XML matching'; }

    }else{
      $scope.update = false;
      $scope.channel = new Api.Channels();
      $scope.channel.type = 'http';
      $scope.channel.routes = [];
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

    $scope.saveOrUpdate = function(channel, contentMatching) {

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

      switch (contentMatching) {
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









    /**********************************************************/
    /**   These are the functions for the Channel Routes     **/
    /**********************************************************/

    // setup dropdown options
    $scope.primaryOptions = [{ key: false, value: 'False' }, { key: true, value: 'True' }];
    $scope.typeOptions = [{ key: 'http', value: 'HTTP' }, { key: 'tcp', value: 'TCP' }];
    $scope.securedOptions = [{ key: false, value: 'Not Secured' }, { key: true, value: 'Secured' }];

    // check required fields for empty inputs
    $scope.checkRequiredField = function(value) {
      if ( value.length === 0 ) {
        // return error message
        return 'This field is required!';
      }
    };

    // check both path and pathTransform isnt supplied
    $scope.checkPathTransformPathSet = function(route, field) {
      // if both supplied
      if ( route.path && route.pathTransform ){
        // if field being checked is pathTransform (always checked after 'path')
        if ( field === 'pathTransform' ){
          // reset the path fields
          route.path = '';
          route.pathTransform = '';
        }
        //return error message
        return 'Cant supply both!';
      }
    };

    // remove route
    $scope.removeRoute = function(index) {
      $scope.channel.routes.splice(index, 1);
    };

    // add route
    $scope.addRoute = function(mediator) {
      // create new route object
      if ( mediator === undefined ){
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
      }else{
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
      
      $scope.channel.routes.push($scope.newRoute);
    };


    /**********************************************************/
    /**   These are the functions for the Channel Routes     **/
    /**********************************************************/












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
      $scope.newAlert.groups = null;
      $scope.newAlert.users = null;
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





    /***************************************************************************/
    /**   These are the general functions for the channel form validation     **/
    /***************************************************************************/

    $scope.hasRouteWarnings = function(){
      // reset route alert object
      Alerting.AlertReset('route');

      // remove incomplete routes that got added
      $scope.removeIncompleteRoutes();

      var noRoutes = $scope.noRoutes();
      var noPrimaries = $scope.noPrimaries();
      var multiplePrimaries = $scope.multiplePrimaries();

      if ( noRoutes || noPrimaries || multiplePrimaries ){
        return true;
      }
    };

    // validate no incomplete routes added - remove if incomplete routes
    $scope.removeIncompleteRoutes = function () {
      // loop backwards to keep object 'index' integrity for object removal (start from the last record)
      var indexStart = $scope.channel.routes.length - 1;
      for (var index = indexStart; index >= 0 ; index--) {
        if ( !$scope.channel.routes[index].name || !$scope.channel.routes[index].host || !$scope.channel.routes[index].port || isNaN($scope.channel.routes[index].port) ){
          $scope.channel.routes.splice(index, 1);
        }
      }
    };

    $scope.noRoutes = function () {
      //no routes found - return true
      if (!$scope.channel.routes || $scope.channel.routes.length === 0) {
        Alerting.AlertAddMsg('route', 'warning', 'You must supply atleast one route.');
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
      Alerting.AlertAddMsg('route', 'warning', 'Atleast one of your routes must be set to the primary.');
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
            Alerting.AlertAddMsg('route', 'warning', 'You cannot have multiple primary routes.');
            return true;
          }
        }
      }

      return false;
    };





    $scope.validateFormChannels = function(){

      // reset hasErrors alert object
      Alerting.AlertReset('hasErrors');

      // clear timeout if it has been set
      $timeout.cancel( $scope.clearValidation );

      $scope.ngError = {};
      $scope.ngError.hasErrors = false;

      // name validation
      if( !$scope.channel.name ){
        $scope.ngError.name = true;
        $scope.ngError.hasErrors = true;
      }

      // urlPattern validation
      if( !$scope.channel.urlPattern ){
        $scope.ngError.urlPattern = true;
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
      if ( $scope.hasRouteWarnings() ){
        $scope.ngError.hasRouteWarnings = true;
        $scope.ngError.routesTab = true;
        $scope.ngError.hasErrors = true;
      }

      if ( $scope.ngError.hasErrors ){
        $scope.clearValidation = $timeout(function(){
          // clear errors after 5 seconds
          $scope.ngError = {};
        }, 5000);
        Alerting.AlertAddMsg('hasErrors', 'danger', $scope.validationFormErrorsMsg);
      }

    };

    $scope.submitFormChannels = function(){

      // validate the form first to check for any errors
      $scope.validateFormChannels();
      // save the channel object if no errors are present
      if ( $scope.ngError.hasErrors === false ){
        $scope.saveOrUpdate($scope.channel, $scope.matching.contentMatching);
      }

    };

    /***************************************************************************/
    /**   These are the general functions for the channel form validation     **/
    /***************************************************************************/

  }).run(function(editableOptions) {
    // add boostrap theme to xeditable module
    editableOptions.theme = 'bs3';
  });
