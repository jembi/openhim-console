'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionsRerunModalCtrl', function ($scope, $modalInstance, Api, Notify, transactionsSelected) {

    $scope.transactionsSelected = transactionsSelected;

    $scope.confirmRerun = function() {

      var tIds = $scope.transactionsSelected;
      $scope.task = new Api.Tasks({tids: tIds});
      $scope.task.$save({}, onSuccess);

    };

    var onSuccess = function() {
      // On success
      Notify.notify('TasksChanged');
      $scope.rerunSuccess = true;
      $scope.$emit('transactionRerunSuccess');
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });