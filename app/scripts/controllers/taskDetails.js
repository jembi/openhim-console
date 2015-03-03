'use strict';

angular.module('openhimConsoleApp')
  .controller('TaskDetailsCtrl', function ($scope, $modal, $location, $routeParams, Api, Alerting) {

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

  });