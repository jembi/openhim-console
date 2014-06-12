'use strict';

angular.module('openhimWebui2App')
  .controller('UsersModalCtrl', function ($scope, $modalInstance, Api, Notify, user) {
    var update = false;
    if (user) {
      update = true;
    }

    $scope.user = user || new Api.Users();
    $scope.newRoute = {};

    var onSuccess = function() {
      // On success
      // reset backing object and notify of change to users
      $scope.user = new Api.Users();
      Notify.notify('usersChanged');

      // close modal
      $modalInstance.close();
    };

    $scope.saveOrUpdate = function(user) {
      if (update) {
        user.$update(onSuccess);
      } else {
        user.$save({ userName: '' }, onSuccess);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.addRoute = function (newRoute) {
      if (!$scope.user.routes) {
        $scope.user.routes = [];
      }
      $scope.user.routes.push(angular.copy(newRoute));

      // reset the backing object
      $scope.newRoute.name = null;
      $scope.newRoute.path = null;
      $scope.newRoute.host = null;
      $scope.newRoute.port = null;
      $scope.newRoute.primary = false;
    };

    $scope.editRoute = function (routeIndex, route) {
      $scope.user.routes.splice(routeIndex, 1);
      $scope.newRoute = route;
    };

    $scope.removeRoute = function (routeIndex) {
      $scope.user.routes.splice(routeIndex, 1);
    };

    $scope.multiplePrimaries = function () {
      if ($scope.user.routes) {
        var routes = $scope.user.routes;
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
