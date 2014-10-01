'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionsBodyModalCtrl', function ($scope, $modalInstance, bodyData) {

    $scope.bodyData = bodyData;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });