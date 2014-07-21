'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsModalCtrl', function ($scope, $modalInstance, Api, Notify, channel) {
    var update = false;
    $scope.contentMatching = 'No matching';
    if (channel) {
      update = true;

      if( channel.matchContentRegex ){ $scope.contentMatching = 'RegEx Matching'; }
      if( channel.matchContentJson ){ $scope.contentMatching = 'JSON matching'; }
      if( channel.matchContentXpath ){ $scope.contentMatching = 'XML matching'; }
    }

    $scope.channel = channel || new Api.Channels();
    $scope.newRoute = {};

    var onSuccess = function() {
      // On success
      // reset backing object and notify of change to channels
      $scope.channel = new Api.Channels();
      Notify.notify('channelsChanged');

      // close modal
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

      if (update) {
        channel.$update(onSuccess);
      } else {
        channel.$save({ channelName: '' }, onSuccess);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.addRoute = function (newRoute) {
      if (!$scope.channel.routes) {
        $scope.channel.routes = [];
      }
      $scope.channel.routes.push(angular.copy(newRoute));

      // reset the backing object
      $scope.newRoute.name = null;
      $scope.newRoute.path = null;
      $scope.newRoute.host = null;
      $scope.newRoute.port = null;
      $scope.newRoute.username = null;
      $scope.newRoute.password = null;
      $scope.newRoute.primary = false;
    };

    $scope.editRoute = function (routeIndex, route) {
      $scope.channel.routes.splice(routeIndex, 1);
      $scope.newRoute = route;
    };

    $scope.removeRoute = function (routeIndex) {
      $scope.channel.routes.splice(routeIndex, 1);
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
      if ($scope.channel.routes) {
        var routes = $scope.channel.routes;
        var count = 0;
        for (var i = 0 ; i < routes.length ; i++) {
          if (routes[i].primary === true) {
            count++;
          }

          if (count == 0) {
            return true;
          }
        }
      }

      return false;
    };


    /* ------------------ Check to see if routes are empty --------------------- */
    $scope.noRoutes = function () {
      if ($scope.channel.routes) {
        var routes = $scope.channel.routes;
        //no routes found - return true
        if( routes.length == 0 ){
          return true
        }
      }

      return false;
    };
    /* ------------------ Check to see if routes are empty --------------------- */


  });
