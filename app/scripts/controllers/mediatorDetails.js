'use strict';

angular.module('openhimConsoleApp')
  .controller('MediatorDetailsCtrl', function ($scope, $modal, $location, $routeParams, Api, Alerting) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    var querySuccess = function(mediatorDetails){
      $scope.mediatorDetails = mediatorDetails;
    };

    var queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    //get the Data for the supplied ID and store in 'mediatorDetails' object
    Api.Mediators.get({ urn: $routeParams.urn }, querySuccess, queryError);

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

  });
