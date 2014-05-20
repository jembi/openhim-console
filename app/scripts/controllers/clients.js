'use strict';

angular.module('openhimWebui2App')
  .controller('ClientsCtrl', function ($scope, Api) {
    $scope.clients = Api.Clients.query();
  });
