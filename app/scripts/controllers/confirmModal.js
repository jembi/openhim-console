'use strict';

angular.module('openhimWebui2App')
  .controller('ConfirmModalCtrl', function ($scope, $modalInstance, confirmObject) {

    $scope.confirmObject = confirmObject;

    $scope.confirmed = function() {
      $modalInstance.close();
    };

    $scope.cancelled = function () {
      $modalInstance.dismiss('cancel');
    };

  });
