'use strict';
/* global moment: false */

angular.module('openhimConsoleApp')
  .controller('MediatorsCtrl', function ($scope, $modal, $location, Api, Alerting) {


    /******************************************************************/
    /**   These are the functions for the Mediators initial load     **/
    /******************************************************************/

    var querySuccess = function(mediators){
      $scope.mediators = mediators;
      if( mediators.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no mediators created');
      } else {
        angular.forEach(mediators, function(mediator){
          var secondsDiffNow = function(mediator){
            return Math.abs(Date.now()-moment(mediator._lastHeartbeat)) / 1000;
          };

          if (!mediator._lastHeartbeat) {
            mediator.lastHeartbeatStatus = 'never';
          } else {
            if (secondsDiffNow(mediator) < 60) {
              mediator.lastHeartbeatStatus = 'success';
            } else if (secondsDiffNow(mediator) < 120) {
              mediator.lastHeartbeatStatus = 'warning';
            } else {
              mediator.lastHeartbeatStatus = 'danger';
            }
            mediator.lastHeartbeatDisplay = moment(mediator._lastHeartbeat).fromNow();
          }

          if (mediator._uptime) {
            //generate human-friendly display string, e.g. 4 days
            mediator.uptimeDisplay = moment().subtract(mediator._uptime, 'seconds').fromNow(true);
          }
        });
      }
    };

    var queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    // do the initial request
    Api.Mediators.query(querySuccess, queryError);

    /******************************************************************/
    /**   These are the functions for the Mediators initial load     **/
    /******************************************************************/



    //location provider - load transaction details
    $scope.viewMediatorDetails = function (path, $event) {
      //do mediators details redirection when clicked on TD
      if( $event.target.tagName === 'TD' ){
        $location.path(path);
      }
    };


    /***********************************/
    /**   Delete Mediator Functions   **/
    /***********************************/

    $scope.confirmDelete = function(mediator){
      Alerting.AlertReset();

      var deleteObject = {
        title: 'Delete Mediator',
        button: 'Delete',
        message: 'Are you sure you wish to delete the mediator "' + mediator.name + '"?'
      };

      var modalInstance = $modal.open({
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: function () {
            return deleteObject;
          }
        }
      });

      modalInstance.result.then(function () {
        // Delete confirmed - delete the user
        mediator.$remove(deleteSuccess, deleteError);
      }, function () {
        // delete cancelled - do nothing
      });

    };

    var deleteSuccess = function () {
      // On success
      $scope.mediators = Api.Mediators.query(querySuccess, queryError);
      Alerting.AlertAddMsg('top', 'success', 'The Mediator has been deleted successfully');
    };

    var deleteError = function (err) {
      // add the error message
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while deleting the Mediator: #' + err.status + ' - ' + err.data);
    };
    
    /***********************************/
    /**   Delete Mediator Functions   **/
    /***********************************/
    
  });
