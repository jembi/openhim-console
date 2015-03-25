'use strict';

angular.module('openhimConsoleApp')
  .controller('TransactionsRerunModalCtrl', function ($scope, $modalInstance, Api, Notify, Alerting, transactionsSelected, rerunTransactionsSelected) {

    $scope.rerunSuccess = false;
    $scope.transactionsSelected = transactionsSelected;
    $scope.rerunTransactionsSelected = rerunTransactionsSelected;
    $scope.taskSetup = {};
    $scope.taskSetup.batchSize = 1;
    $scope.taskSetup.paused = false;

    if ( rerunTransactionsSelected === 1 && transactionsSelected.length === 1 ){
      Alerting.AlertAddMsg('rerun', 'warning', 'This transaction has already been rerun');
    }else if( rerunTransactionsSelected > 0 ){
      Alerting.AlertAddMsg('rerun', 'warning', rerunTransactionsSelected + ' of these transactions have already been rerun');
    }

    $scope.confirmRerun = function() {
      console.log($scope.taskSetup);

      var tIds = $scope.transactionsSelected;
      $scope.task = new Api.Tasks({ tids: tIds, batchSize: $scope.taskSetup.batchSize, paused: $scope.taskSetup.paused });
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
