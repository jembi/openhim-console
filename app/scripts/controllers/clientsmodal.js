'use strict';

angular.module('openhimWebui2App')
  .controller('ClientsModalCtrl', function ($scope, $modalInstance, Api) {
    $scope.clients = new Api.Clients();

    $scope.save = function(client) {
      client.$save();

      // reset backing object and refresh clients list
      $scope.clientsToAdd = new Api.Clients();
      $scope.clients = Api.Clients.query();

      // close modal
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
