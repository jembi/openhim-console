'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsModalCtrl', function ($scope, $modalInstance, $timeout, Api, Notify, Alerting, channel) {
    
    /****************************************************************/
    /**   These are the functions for the Channel initial load     **/
    /****************************************************************/

    // object to store temp values like password (not associated with schema object)
    $scope.temp = {};

    // get the users for the Channel Alert User dropdown
    $scope.alertUsers = Api.Users.query(function(){
      $scope.usersMap = {};
      angular.forEach($scope.alertUsers, function(user){
        $scope.usersMap[user.email] = user.firstname + ' ' + user.surname + ' (' + user.email + ')';
      });
    },
    function(){
      // server error - could not connect to API to get channels
    });

    // get/set the users scope whether new or update
    $scope.matching = {};
    $scope.matching.contentMatching = 'No matching';
    if (channel) {
      $scope.update = true;
      $scope.channel = angular.copy(channel);

      if( channel.matchContentRegex ){ $scope.matching.contentMatching = 'RegEx matching'; }
      if( channel.matchContentJson ){ $scope.matching.contentMatching = 'JSON matching'; }
      if( channel.matchContentXpath ){ $scope.matching.contentMatching = 'XML matching'; }
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

    $scope.saveOrUpdate = function(channel, contentMatching) {

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

    // define the routes backup object
    $scope.channelRoutesBackup = null;
    $scope.newRoute = {};

    $scope.addRoute = function (newRoute) {
      if (!$scope.channel.routes) {
        $scope.channel.routes = [];
      }
      $scope.channel.routes.push(angular.copy(newRoute));
      // reset the backup route object when a record is added
      $scope.channelRoutesBackup = null;

      // reset the backing object
      $scope.newRoute.name = null;
      $scope.newRoute.path = null;
      $scope.newRoute.pathTransform = null;
      $scope.newRoute.host = null;
      $scope.newRoute.port = null;
      $scope.newRoute.username = null;
      $scope.newRoute.password = null;
      $scope.newRoute.primary = false;

      // Check if any route warnings exist and add them to alerts route object
      $scope.hasRouteWarnings();
    };

    $scope.editRoute = function (routeIndex, route) {

      // remove the selected route object from scope
      $scope.channel.routes.splice(routeIndex, 1);

      // if backup object exist update routes object with backup route
      if ( $scope.channelRoutesBackup !== null ){
        $scope.channel.routes.push(angular.copy($scope.channelRoutesBackup));
      }
      // override backup route object to new route being editted
      $scope.channelRoutesBackup = angular.copy(route);
      $scope.newRoute = route;

      // Check if any route warnings exist and add them to alerts route object
      $scope.hasRouteWarnings();
    };

    $scope.removeRoute = function (routeIndex) {
      $scope.channel.routes.splice(routeIndex, 1);

      // Check if any route warnings exist and add them to alerts route object
      $scope.hasRouteWarnings();
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
      if (!$scope.newAlert.status || !$scope.newAlert.users || $scope.newAlert.users.length === 0){
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





    /***************************************************************************/
    /**   These are the general functions for the channel form validation     **/
    /***************************************************************************/
    
    $scope.hasRouteWarnings = function(){
      // reset route alert object
      Alerting.AlertReset('route');

      var noRoutes = $scope.noRoutes();
      var noPrimaries = $scope.noPrimaries();
      var multiplePrimaries = $scope.multiplePrimaries();

      if ( noRoutes || noPrimaries || multiplePrimaries ){
        return true;
      }
    };
    
    $scope.isRouteValid = function () {
      if ( !$scope.newRoute.name || !$scope.newRoute.host || !$scope.newRoute.port ){
        return false;
      }
      return true;
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

      // clientID validation
      if( !$scope.channel.urlPattern ){
        $scope.ngError.urlPattern = true;
        $scope.ngError.hasErrors = true;
      }

      // roles validation
      if( !$scope.channel.allow || $scope.channel.allow.length===0 ){
        $scope.ngError.allow = true;
        $scope.ngError.hasErrors = true;
      }

      switch ($scope.matching.contentMatching){
        case 'RegEx matching':
          if( !$scope.channel.matchContentRegex){
            $scope.ngError.matchContentRegex = true;
            $scope.ngError.hasErrors = true;
          }
          break;
        case 'XML matching':
          if( !$scope.channel.matchContentXpath){
            $scope.ngError.matchContentXpath = true;
            $scope.ngError.hasErrors = true;
          }
          if( !$scope.channel.matchContentValue){
            $scope.ngError.matchContentValue = true;
            $scope.ngError.hasErrors = true;
          }
          break;
        case 'JSON matching':
          if( !$scope.channel.matchContentJson){
            $scope.ngError.matchContentJson = true;
            $scope.ngError.hasErrors = true;
          }
          if( !$scope.channel.matchContentValue){
            $scope.ngError.matchContentValue = true;
            $scope.ngError.hasErrors = true;
          }
          break;
      }

      // has route errors
      if ( $scope.hasRouteWarnings() ){
        $scope.ngError.hasRouteWarnings = true;
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


  });