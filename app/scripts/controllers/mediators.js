'use strict';

angular.module('openhimConsoleApp')
  .controller('MediatorsCtrl', function ($scope, $modal, $location, Api, Alerting, MediatorDisplay) {


    /******************************************************************/
    /**   These are the functions for the Mediators initial load     **/
    /******************************************************************/

    var querySuccess = function(mediators){
      $scope.mediators = mediators;
      if( mediators.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no mediators created');
      } else {
        MediatorDisplay.formatMediators(mediators);
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
