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

    $scope.$on('mediatorConfigChanged', function () {
      Api.Mediators.get({ urn: $routeParams.urn }, querySuccess, queryError);
    });

    //get the Data for the supplied ID and store in 'mediatorDetails' object
    Api.Mediators.get({ urn: $routeParams.urn }, querySuccess, queryError);

    $scope.editMediatorConfig = function() {
      $modal.open({
        templateUrl: 'views/mediatorConfigModal.html',
        controller: 'MediatorConfigModalCtrl',
        resolve: {
          mediator: function () {
            return $scope.mediatorDetails;
          }
        }
      });
    };

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

  });
