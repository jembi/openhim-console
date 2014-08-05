'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionsRouteModalCtrl', function ($scope, $modalInstance, route) {

    $scope.viewFullBody = false;
    $scope.route = route;

    $scope.toggleFullView = function () {
      var viewFullBody = $scope.viewFullBody;

      if (viewFullBody === true){
        $scope.viewFullBody = false;
      }else{
        $scope.viewFullBody = true;
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });