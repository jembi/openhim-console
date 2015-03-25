'use strict';

angular.module('openhimConsoleApp')
  .controller('TaskDetailsCtrl', function ($scope, $modal, $location, $routeParams, Api, Alerting, $route) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    var querySuccess = function(task){
      $scope.task = task;
    };

    var queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    //get the Data for the supplied ID and store in 'transactionsDetails' object
    Api.Tasks.get({ taskId: $routeParams.taskId }, querySuccess, queryError);

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/
    


    /**************************************************/
    /**         Task Calculation Functions           **/
    /**************************************************/

    $scope.getProcessedTotal = function(task){
      var totalTransactions = task.transactions.length;
      var remainingTransactions = task.remainingTransactions;
      return totalTransactions - remainingTransactions;
    };

    $scope.getExecutionTime = function(task){
      if (task){
        if( task.completedDate ){
          var created = new Date(task.created);
          var completedDate = new Date(task.completedDate);
          var miliseconds = completedDate - created;
          var seconds = miliseconds/1000;
          return seconds.toFixed(2);
        }else{
          return 0;
        }
      }
    };

    $scope.viewTransactionDetails = function(path) {
      $location.path(path);
    };

    /**************************************************/
    /**         Task Calculation Functions           **/
    /**************************************************/

    function updateTaskWithStatus(task, status) {
      var updated = new Api.Tasks();
      updated._id = task._id;
      updated.status = status;
      updated.$update({}, function(){
        $route.reload();
      });
    }

    $scope.pauseTask = function(task){
      updateTaskWithStatus(task, 'Paused');
    };

    $scope.resumeTask = function(task){
      updateTaskWithStatus(task, 'Queued');
    };

    $scope.cancelTask = function(task){
      var cancelObject = {
        title: 'Cancel Task',
        button: 'Yes',
        message: 'Are you sure you want to cancel this task?'
      };

      var modalInstance = $modal.open({
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: function () {
            return cancelObject;
          }
        }
      });

      modalInstance.result.then(function () {
        // cancel confirmed
        updateTaskWithStatus(task, 'Cancelled');
      }, function () {
        // cancel cancelled
      });
    };

  });
