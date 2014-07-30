'use strict';

angular.module('openhimWebui2App')
  .controller('DeleteConfirmModalCtrl', function ($scope, $modalInstance, deleteObject) {

    $scope.deleteObject = deleteObject;

    $scope.confirmDelete = function() {
      // delete confirmed
      $modalInstance.close();
    };

    $scope.cancelDelete = function () {
      $modalInstance.dismiss('cancel');
    };

  });