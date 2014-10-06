'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionsAddReqResModalCtrl', function ($scope, $modalInstance, record) {

    $scope.record = record;
    $scope.viewFullBody = false;
    $scope.viewFullBodyType = null;
    $scope.viewFullBodyContent = null;
    

    $scope.toggleFullView = function (type, bodyContent) {

      // if both parameters supplied - view body message
      if ( type && bodyContent ){
        $scope.viewFullBody = true;
        $scope.viewFullBodyType = type;
        $scope.viewFullBodyContent = bodyContent;
      }else{
        $scope.viewFullBody = false;
      }

    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });