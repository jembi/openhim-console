'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionsAddReqResModalCtrl', function ($scope, $modalInstance, record) {

    $scope.viewFullBody = false;
    $scope.record = record;

    $scope.toggleFullView = function () {
      if ($scope.viewFullBody === true){
        $scope.viewFullBody = false;
      }else{
        $scope.viewFullBody = true;
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });