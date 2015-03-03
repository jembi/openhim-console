'use strict';

angular.module('openhimConsoleApp')
  .controller('TasksCtrl', function ($scope, $modal, $location, Api, Alerting) {

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


  });