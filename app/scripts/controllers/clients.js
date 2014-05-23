'use strict';

angular.module('openhimWebui2App')
  .controller('ClientsCtrl', function ($scope, $modal, Api, Notify) {
    $scope.clients = Api.Clients.query();

    $scope.$on('clientsChanged', function() {
      $scope.clients = Api.Clients.query();
    });

    $scope.addClient = function() {
      $modal.open({
        templateUrl: 'views/clientsmodal.html',
        controller: 'ClientsModalCtrl',
        resolve: {
          client: function () {}
        }
      });
    };

    $scope.removeClient = function(client) {
      client.$remove(function() {
        Notify.notify('clientsChanged');
      });
    };

    $scope.editClient = function(client) {
      $modal.open({
        templateUrl: 'views/clientsmodal.html',
        controller: 'ClientsModalCtrl',
        resolve: {
          client: function () {
            return client;
          }
        }
      });
    };
  });
