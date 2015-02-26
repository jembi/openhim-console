'use strict';

angular.module('openhimWebui2App')
  .controller('ChannelsCtrl', function ($scope, $modal, Api, Alerting) {


    /* -------------------------Initial load & onChanged---------------------------- */
    var querySuccess = function(channels){
      $scope.channels = channels;
      if( channels.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no channels created');
      }
    };

    var queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    // do the initial request
    Api.Channels.query(querySuccess, queryError);

    $scope.$on('channelsChanged', function () {
      Api.Channels.query(querySuccess, queryError);
    });
    /* -------------------------Initial load & onChanged---------------------------- */


    /* -------------------------Add/edit user popup modal---------------------------- */
    $scope.addChannel = function() {
      Alerting.AlertReset();

      $modal.open({
        templateUrl: 'views/channelsmodal.html',
        controller: 'ChannelsModalCtrl',
        resolve: {
          channel: function () {}
        }
      });
    };

    $scope.editChannel = function(channel) {
      Alerting.AlertReset();

      $modal.open({
        templateUrl: 'views/channelsmodal.html',
        controller: 'ChannelsModalCtrl',
        resolve: {
          channel: function () {
            return channel;
          }
        }
      });
    };
    /* -------------------------Add/edit user popup modal---------------------------- */



    /*--------------------------Delete Confirm----------------------------*/
    $scope.confirmDelete = function(channel){
      Alerting.AlertReset();

      var deleteObject = {
        title: 'Delete Channel',
        button: 'Delete',
        message: 'Are you sure you wish to delete the channel "' + channel.name + '"?'
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
        channel.$remove(deleteSuccess, deleteError);
      }, function () {
        // delete cancelled - do nothing
      });

    };

    var deleteSuccess = function () {
      // On success
      $scope.channels = Api.Channels.query();
      Alerting.AlertAddMsg('top', 'success', 'The channel has been deleted successfully');
    };

    var deleteError = function (err) {
      // add the error message
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while deleting the channel: #' + err.status + ' - ' + err.data);
    };
    /*---------------------------Delete Confirm----------------------------*/
    
    /*--------------------------Restore Confirm----------------------------*/
    $scope.confirmRestore = function(channel){
      Alerting.AlertReset();

      var restoreObject = {
        title: 'Restore Channel',
        button: 'Restore',
        message: 'Are you sure you want to restore the deleted channel "' + channel.name + '"?'
      };

      var modalInstance = $modal.open({
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: function () {
            return restoreObject;
          }
        }
      });

      modalInstance.result.then(function () {
        // restore confirmed
        channel.status = 'enabled';
        channel.$update(restoreSuccess, restoreError);
      }, function () {
        // restore cancelled - do nothing
      });

    };

    var restoreSuccess = function () {
      // On success
      $scope.channels = Api.Channels.query();
      Alerting.AlertAddMsg('top', 'success', 'The channel has been successfully restored');
    };

    var restoreError = function (err) {
      // add the error message
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while restoring the channel: #' + err.status + ' - ' + err.data);
    };

  });
