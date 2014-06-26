'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionsModalCtrl', function ($scope, $modalInstance, Api, Notify, transactionsSelected) {

    $scope.transactionsSelected = transactionsSelected;    

    var onSuccess = function() {
      // On success
      Notify.notify('TasksChanged');

      // close modal
      $modalInstance.close();
    };

    $scope.confirmRerun = function() {

        var tIds = $scope.transactionsSelected;
        var transactionsArray = [];
        for (var i=0; i<tIds.length; i++){
          console.log(tIds[i]);
          transactionsArray.push({ tid: tIds[i], tstatus: 'Processing' });
        }
        console.log(transactionsArray);
        var taskObject = {status: 'NotStarted', transactions: transactionsArray, created: new Date(), user: "root@openhim.org"}
        //var taskObject = {status: 'Processing'}
        $scope.task = new Api.Tasks(taskObject);
        //alert( $scope.task );
        $scope.task.$save({}, onSuccess);

    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
