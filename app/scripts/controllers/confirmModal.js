'use strict'

angular.module('openhimConsoleApp')
  .controller('ConfirmModalCtrl', function ($scope, $modalInstance, confirmObject) {
    $scope.confirmObject = confirmObject

    $scope.confirmed = function () {
      $modalInstance.close()
    }

    $scope.cancelled = function () {
      $modalInstance.dismiss('cancel')
    }
  })
