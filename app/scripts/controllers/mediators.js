'use strict';

angular.module('openhimWebui2App')
  .controller('MediatorsCtrl', function ($scope, $modal, $location, Api, Alerting) {


    /******************************************************************/
    /**   These are the functions for the Mediators initial load     **/
    /******************************************************************/

    var querySuccess = function(mediators){
      $scope.mediators = mediators;
      if( mediators.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no mediators created');
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
    
  });
