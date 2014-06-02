'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsModalCtrl', function ($scope, $modalInstance, Api, Notify, channel) {
    var update = false;
    if (channel) {
      update = true;
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

    $scope.saveOrUpdate = function(channel) {
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

  });
