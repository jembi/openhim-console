'use strict';

angular.module('openhimWebui2App')
  .controller('TasksCtrl', function ($scope, $modal, $location, Api, Alerting) {

    /**********************************************/
    /**         Initial load functions           **/
    /**********************************************/

    $scope.filter = {};

    // get the channels for the transactions filter dropdown
    $scope.users = Api.Users.query();

    var querySuccess = function(tasks){
      $scope.tasks = tasks;
      if( tasks.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no tasks created');
      }
    };

    var queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    // do the initial request
    Api.Tasks.query(querySuccess, queryError);

    /**********************************************/
    /**         Initial load functions           **/
    /**********************************************/



    /*****************************************************/
    /**         View task details modal popup           **/
    /*****************************************************/

    $scope.viewTaskDetails = function(path) {
      $location.path(path);
    };
    
    /*****************************************************/
    /**         View task details modal popup           **/
    /*****************************************************/




    $scope.getProcessedTotal = function(task){
      var totalTransactions = task.transactions.length;
      var remainingTransactions = task.remainingTransactions;
      return totalTransactions - remainingTransactions;
    };

    $scope.getExecutionTime = function(task){
      if( task.completedDate ){
        var created = new Date(task.created);
        var completedDate = new Date(task.completedDate);
        var miliseconds = completedDate - created;
        var seconds = miliseconds/1000;
        return seconds.toFixed(2);
      }else{
        return 0;
      }
    };


    $scope.refreshTasksList = function () {
      
    };

    //Clear filter data end refresh transactions scope
    $scope.clearFilters = function () {
      $scope.filter = {};
    };


    /**************************************************/
    /**         Delete Confirm modal popup           **/
    /**************************************************/

    $scope.confirmDelete = function(task){
      Alerting.AlertReset();

      var deleteObject = {
        title: 'Delete Task',
        message: 'Are you sure you wish to delete this task?'
      };

      var modalInstance = $modal.open({
        templateUrl: 'views/deleteConfirmModal.html',
        controller: 'DeleteConfirmModalCtrl',
        resolve: {
          deleteObject: function () {
            return deleteObject;
          }
        }
      });

      modalInstance.result.then(function () {
        $scope.tasks = {};
        // Delete confirmed - delete the user
        task.$remove(deleteSuccess, deleteError);
      }, function () {
        // delete cancelled - do nothing
      });

    };

    var deleteSuccess = function () {
      // reload the scope with updated API result
      Api.Tasks.query(querySuccess, queryError);
      Alerting.AlertAddMsg('top', 'success', 'The task has been deleted successfully');
    };

    var deleteError = function (err) {
      // add the error message
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while deleting the task: #' + err.status + ' - ' + err.data);
    };
    
    /**************************************************/
    /**         Delete Confirm modal popup           **/
    /**************************************************/

  });