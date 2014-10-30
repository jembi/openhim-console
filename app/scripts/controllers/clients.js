'use strict';

angular.module('openhimWebui2App')
  .controller('ClientsCtrl', function ($rootScope, $scope, $modal, $interval, Api, Alerting) {

    // set varaibles for server restart
    $scope.serverRestarting = false;
    $scope.restartTimeout = 0;

    // server restart later function
    $scope.restartServerLater = function(){
      $rootScope.serverRestartRequired = false;
    };

    // server restart confirm function
    $scope.restartServer = function(){

      var restartServer = new Api.Restart();
      restartServer.$save({}, function(){
        // restart request sent successfully

        // update restart variables
        $scope.serverRestarting = true;
        $rootScope.serverRestartRequired = false;

        // set estimate time for server restart - 120 seconds
        $scope.restartTimeout = 120;
        var restartInterval = $interval(function() {
          // decrement the timer
          $scope.restartTimeout--;

          // if timer is finshed - cancel interval - update display varaible
          if ($scope.restartTimeout === 0){
            $scope.serverRestarting = false;
            $interval.cancel(restartInterval);
          }
        }, 1000);
      }, function(){ /* server error - could not connect to API send restart request */ });


      //Api.Restart.get(function(){
        


      //}, function(){ /* server error - could not connect to API send restart request */ });
    };


    /* -------------------------Initial load & onChanged---------------------------- */
    var querySuccess = function(clients){
      $scope.clients = clients;
      if( clients.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no clients created');
      }
    };

    var queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    // do the initial request
    Api.Clients.query(querySuccess, queryError);

    $scope.$on('clientsChanged', function () {
      Api.Clients.query(querySuccess, queryError);
    });
    /* -------------------------Initial load & onChanged---------------------------- */



    /* -------------------------Add/edit client popup modal---------------------------- */
    $scope.addClient = function() {
      Alerting.AlertReset();
      $scope.serverRestarting = false;

      $modal.open({
        templateUrl: 'views/clientsmodal.html',
        controller: 'ClientsModalCtrl',
        resolve: {
          client: function () {}
        }
      });
    };

    $scope.editClient = function(client) {
      Alerting.AlertReset();
      $scope.serverRestarting = false;

      $modal.open({
        templateUrl: 'views/clientsmodal.html',
        controller: 'ClientsModalCtrl',
        resolve: {
          client: function () {
            return client;
          }
        }
      });
    };
    /* -------------------------Add/edit client popup modal---------------------------- */



    /*------------------------Delete Confirm----------------------------*/
    $scope.confirmDelete = function(client){
      Alerting.AlertReset();
      $scope.serverRestarting = false;

      var deleteObject = {
        title: 'Delete Client',
        message: 'Are you sure you wish to delete the client "' + client.name + '"?'
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
        // Delete confirmed - delete the user
        client.$remove(deleteSuccess, deleteError);
      }, function () {
        // delete cancelled - do nothing
      });

    };

    var deleteSuccess = function () {
      // On success
      $scope.clients = Api.Clients.query();
      Alerting.AlertAddMsg('top', 'success', 'The client has been deleted successfully');
    };

    var deleteError = function (err) {
      // add the error message
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while deleting the client: #' + err.status + ' - ' + err.data);
    };
    /*------------------------Delete Confirm----------------------------*/

  });
