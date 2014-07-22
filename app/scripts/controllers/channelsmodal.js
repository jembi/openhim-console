'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsModalCtrl', function ($scope, $modalInstance, Api, Notify, channel) {
    
    // backup object for the route being editted
    $scope.channelRoutesBackup = null;
    if (channel) {
      $scope.update = true;
      $scope.channel = angular.copy(channel);      
    }else{
      $scope.update = false;
      $scope.channel = new Api.Channels();
    }
    $scope.newRoute = {};

    var onSuccess = function() {
      // On success
      // reset backing object and notify of change to channels
      $scope.channel = new Api.Channels();
      Notify.notify('channelsChanged');

      // close modal
      $modalInstance.close();
    };

    $scope.saveOrUpdate = function(channel) {
      if ($scope.update) {
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
      // reset the backup route object when a record is added
      $scope.channelRoutesBackup = null;

      // reset the backing object
      $scope.newRoute.name = null;
      $scope.newRoute.path = null;
      $scope.newRoute.host = null;
      $scope.newRoute.port = null;
      $scope.newRoute.primary = false;
    };

    $scope.editRoute = function (routeIndex, route) {

      // remove the selected route object from scope
      $scope.channel.routes.splice(routeIndex, 1);

      // if backup object exist update routes object with backup route
      if ( $scope.channelRoutesBackup != null ){
        $scope.channel.routes.push(angular.copy($scope.channelRoutesBackup));
      }
      // override backup route object to new route being editted
      $scope.channelRoutesBackup = angular.copy(route);

      
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

  });
