'use strict';

angular.module('openhimWebui2App')
  .controller('ClientsCtrl', function ($scope, $modal, Api) {
    $scope.clients = Api.Clients.query();

    $scope.openClientsModal = function() {
      $modal.open({
          templateUrl: 'views/clientsmodal.html',
          controller: 'ClientsModalCtrl'
        });
    };
  });
