'use strict';

angular.module('openhimConsoleApp')
  .controller('MediatorDetailsCtrl', function ($rootScope, $scope, $modal, $location, $routeParams, Api, Alerting, MediatorDisplay) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    var querySuccess = function(mediatorDetails){
      MediatorDisplay.formatMediator(mediatorDetails);
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
      Alerting.AlertReset();

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
