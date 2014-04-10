'use strict';

angular.module('openhimWebui2App')
  .controller('ApplicationsCtrl', function ($scope, Api) {
    $scope.applications = Api.Applications.query();
  });
