'use strict';

angular.module('openhimWebui2App')
  .controller('UsersCtrl', function ($scope, $modal, Api, Alerting) {


    /* -------------------------Initial load & onChanged---------------------------- */
    var querySuccess = function(users){
      $scope.users = users;
      if( users.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no users created');
      }
    };

    var queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    // do the initial request
    Api.Users.query(querySuccess, queryError);

    $scope.$on('usersChanged', function () {
      Api.Users.query(querySuccess, queryError);
    });



    /* API call to load Users - Channels Matrix */

    $scope.usersChannelsMatrix = Api.UsersChannelsMatrix.get();

    $scope.isAllowedChannel = function(channelID, allowedChannels){
      // check if channelID is found in allowedChannels
      if ( allowedChannels.indexOf(channelID) >= 0 ){
        return true;
      }
      return false;
    };

    /* API call to load Users - Channels Matrix */

    /* -------------------------Initial load & onChanged---------------------------- */



    /* -------------------------Add/edit user popup modal---------------------------- */
    $scope.addUser = function () {
      Alerting.AlertReset();

      $modal.open({
        templateUrl: 'views/usersmodal.html',
        controller: 'UsersModalCtrl',
        resolve: {
          user: function () {
          }
        }
      });
    };

    $scope.editUser = function (user) {
      Alerting.AlertReset();

      $modal.open({
        templateUrl: 'views/usersmodal.html',
        controller: 'UsersModalCtrl',
        resolve: {
          user: function () {
            return user;
          }
        }
      });
    };
    /* -------------------------Add/edit user popup modal---------------------------- */



    /*--------------------------Delete Confirm----------------------------*/
    $scope.confirmDelete = function(user){
      Alerting.AlertReset();

      var deleteObject = {
        title: 'Delete User',
        message: 'Are you sure you wish to delete the user "' + user.firstname + ' ' + user.surname + '"?'
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
        user.$remove(deleteSuccess, deleteError);
      }, function () {
        // delete cancelled - do nothing
      });

    };

    var deleteSuccess = function () {
      // On success
      $scope.users = Api.Users.query();
      Alerting.AlertAddMsg('top', 'success', 'The user has been deleted successfully');
    };

    var deleteError = function (err) {
      // add the error message
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while deleting the user: #' + err.status + ' - ' + err.data);
    };
    /*---------------------------Delete Confirm----------------------------*/

  });
