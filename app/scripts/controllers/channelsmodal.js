'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsModalCtrl', function ($scope, $modalInstance, Api, Notify, Alerting, channel) {
    
    // get/set the users scope whether new or update
    // backup object for the route being editted
    $scope.channelRoutesBackup = null;
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
        channel.$save({ channelName: '' }, success, error);
      }
    };
    /* ------------------------- Save/update channel record ---------------------------- */

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    /* -------------------------Add/edit/remove channel function---------------------------- */
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
    /* -------------------------Add/edit/remove channel function---------------------------- */
    


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
    /* ------------------ Validate form function --------------------- */


  });
