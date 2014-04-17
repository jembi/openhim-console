'use strict';

angular.module('openhimWebui2App')
  .controller('SidebarCtrl', function ($scope, $location) {
    $scope.isCurrent = function(path) {
      if (path.length > 1 && $location.path().substr(0, path.length) === path) {
        return true;
      } else if ($location.path() === path) {
        return true;
      } else {
        return false;
      }
    };
  });
