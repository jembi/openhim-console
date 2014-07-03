'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionsModalCtrl', function ($scope, $modalInstance, Api, Notify, transactionsSelected) {

    $scope.transactionsSelected = transactionsSelected;

    $scope.confirmRerun = function() {

      var tIds = $scope.transactionsSelected;
      var transactionsArray = [];
      for (var i=0; i<tIds.length; i++){
        transactionsArray.push({ tid: tIds[i], tstatus: 'Processing' });
      }

      var consoleSession = localStorage.getItem('consoleSession');
      consoleSession = JSON.parse(consoleSession);
      var sessionUser = consoleSession.sessionUser;

      var taskObject = {status: 'NotStarted', transactions: transactionsArray, created: new Date(), user: sessionUser};
      $scope.task = new Api.Tasks(taskObject);
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
