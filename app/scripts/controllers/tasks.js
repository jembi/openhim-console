'use strict';

angular.module('openhimConsoleApp')
  .controller('TasksCtrl', function ($scope, $modal, $location, Api, Alerting, $route) {

    /**********************************************/
    /**         Initial load functions           **/
    /**********************************************/

    $scope.filter = {};

    // get the users for the transactions filter dropdown
    $scope.users = Api.Users.query();

    $scope.querySuccess = function(tasks){
      $scope.tasks = tasks;
      if( tasks.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no tasks created');
      }
    };

    $scope.queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    // do the initial request
    Api.Tasks.query($scope.querySuccess, $scope.queryError);

    /**********************************************/
    /**         Initial load functions           **/
    /**********************************************/



    /*****************************************************/
    /**         General rerun task functions            **/
    /*****************************************************/

    $scope.viewTaskDetails = function(path) {
      $location.path(path);
    };

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

    //Clear filter data end refresh transactions scope
    $scope.clearFilters = function () {
      $scope.filter = {};
    };
    
    /*****************************************************/
    /**         General rerun task functions            **/
    /*****************************************************/

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
