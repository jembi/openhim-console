'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsModalCtrl', function ($scope, $modalInstance, Api, Notify, Alerting, channel) {
    

    // get the users for the Channel Alert User dropdown
    $scope.alertUsers = Api.Users.query();


    // get/set the users scope whether new or update
    // backup object for the route/alert being editted
    $scope.channelRoutesBackup = null;
    $scope.channelAlertsBackup = null;
    $scope.routeWarnings = [];
    $scope.contentMatching = 'No matching';
    if (channel) {
      $scope.update = true;
      $scope.channel = angular.copy(channel);

      if( channel.matchContentRegex ){ $scope.contentMatching = 'RegEx Matching'; }
      if( channel.matchContentJson ){ $scope.contentMatching = 'JSON matching'; }
      if( channel.matchContentXpath ){ $scope.contentMatching = 'XML matching'; }
    }else{
      $scope.update = false;
      $scope.channel = new Api.Channels();
    }
    $scope.newRoute = {};
    $scope.newAlert = {};





    /* ------------------------- Save/update channel record ---------------------------- */
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
        case 'RegEx Matching':
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
    /* ------------------------- Save/update channel record ---------------------------- */

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    /* -------------------------Add/edit/remove channel route function---------------------------- */
    $scope.addRoute = function (newRoute) {
      if (!$scope.channel.routes) {
        $scope.channel.routes = [];
      }
      $scope.channel.routes.push(angular.copy(newRoute));
      // reset the backup route object when a record is added
      $scope.channelRoutesBackup = null;

      // Check if any route warnings exist and add them to routeWarnings object
      $scope.checkRouteWarnings();

      // reset the backing object
      $scope.newRoute.name = null;
      $scope.newRoute.path = null;
      $scope.newRoute.pathTransform = null;
      $scope.newRoute.host = null;
      $scope.newRoute.port = null;
      $scope.newRoute.username = null;
      $scope.newRoute.password = null;
      $scope.newRoute.primary = false;
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

      // Check if any route warnings exist and add them to routeWarnings object
      $scope.checkRouteWarnings();
    };

    $scope.removeRoute = function (routeIndex) {
      $scope.channel.routes.splice(routeIndex, 1);

      // Check if any route warnings exist and add them to routeWarnings object
      $scope.checkRouteWarnings();
    };
    /* -------------------------Add/edit/remove channel route function---------------------------- */





    /* -------------------------Add/edit/remove channel route function---------------------------- */
    $scope.addAlert = function (newAlert) {
      if (!$scope.channel.alerts) {
        $scope.channel.alerts = [];
      }
      $scope.channel.alerts.push(angular.copy(newAlert));
      // reset the backup route object when a record is added
      $scope.channelAlertsBackup = null;

      // Check if any route warnings exist and add them to routeWarnings object
      //$scope.checkRouteWarnings();

      // reset the backing object
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

      // Check if any route warnings exist and add them to routeWarnings object
      $scope.checkRouteWarnings();
    };

    $scope.removeAlert = function (alertIndex) {
      $scope.channel.alerts.splice(alertIndex, 1);

      // Check if any route warnings exist and add them to routeWarnings object
      $scope.checkRouteWarnings();
    };
    /* -------------------------Add/edit/remove channel route function---------------------------- */


    


    /* ------------------ Validate form function --------------------- */
    // verify if any warnings exist - if warnings exist then disable channel save button
    $scope.checkChannelWarnings = function () {
      var routeWarnings = $scope.checkRouteWarnings();

      if ( routeWarnings > 0 ){
        return true;
      }
      return false;
    };

    $scope.checkRouteWarnings = function () {

      // clear the routeWarnings object to have a clean object
      $scope.routeWarnings = [];
      var countErrors = 0;

      if ($scope.noRoutes() === true) {
        $scope.routeWarnings.push('You must supply atleast one route.');
        countErrors++;
      }
      if ($scope.noPrimaries() === true) {
        $scope.routeWarnings.push('Atleast one of your routes must be set to the primary.');
        countErrors++;
      }
      if ($scope.multiplePrimaries() === true) {
        $scope.routeWarnings.push('You cannot have multiple primary routes.');
        countErrors++;
      }

      return countErrors;
      
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
            return true;
          }
        }
      }

      return false;
    };

    $scope.noPrimaries = function () {
      if ($scope.channel.routes.length > 0) {
        for (var i = 0 ; i < $scope.channel.routes.length ; i++) {
          if ($scope.channel.routes[i].primary === true) {
            // atleast one primary so return false
            return false;
          }
        }
      }
      // return true if no primary routes found
      return true;
    };

    $scope.noRoutes = function () {
      //no routes found - return true
      if ($scope.channel.routes.length === 0) {
        return true;
      }
      return false;
    };



    $scope.isAlertValid = function(){

      if (!$scope.newAlert.status || !$scope.newAlert.users){
        return false;
      }
      if ($scope.newAlert.status.length !== 3){
        return false;
      }
      return true;

    };

    /* ------------------ Validate form function --------------------- */









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

      // Check if any route warnings exist and add them to routeWarnings object
      //$scope.checkRouteWarnings();
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

























  });
