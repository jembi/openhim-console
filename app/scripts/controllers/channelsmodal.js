'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsModalCtrl', function ($scope, $modalInstance, Api, Notify, channel) {
    var update = false;
    if (channel) {
      update = true;
    }

    $scope.channel = channel || new Api.Channels();

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
      newRoute.name = null;
      newRoute.path = null;
      newRoute.host = null;
      newRoute.port = null;
      newRoute.primary = null;
    };

    $scope.editRoute = function (routeIndex, route) {
      $scope.channel.routes.splice(routeIndex, 1);
      $scope.newRoute = route;
    };

    $scope.removeRoute = function (routeIndex) {
      $scope.channel.routes.splice(routeIndex, 1);
    };

  });
