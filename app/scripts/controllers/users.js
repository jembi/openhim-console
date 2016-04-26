'use strict';

angular.module('openhimConsoleApp')
  .controller('UsersCtrl', function ($scope, $modal, Api, Alerting) {


    /* -------------------------Initial load & onChanged---------------------------- */
    var querySuccess = function(users){
      $scope.users = users;
      if( users.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no users created');
      }


      /* ----- Users Channels matrix ----- */
      // Query all channels for Users Channels matrix table
      Api.Channels.query(function(channels){
      
        var usersArray = [];
        var channelsArray = [];

        // loop through channels to create channels map
        angular.forEach(channels, function(channnel){
          if (typeof channnel.status === 'undefined' || channnel.status !== 'deleted') {
            channelsArray.push({ 'id': channnel._id, 'name':channnel.name });
          }
        });

        // loop through all users
        angular.forEach(users, function(user){

          var allowedChannels = [];
          var allowedChannelsRerun = [];
          var allowedChannelsBody = [];

          // loop through channels to determine if user has permissions
          angular.forEach(channels, function(channel){

            // loop through each user group to check if channel has access
            angular.forEach(user.groups, function(group){

              // check if user group found in channel txViewAcl
              if ( channel.txViewAcl.indexOf(group) >= 0 || group === 'admin' ){
                allowedChannels.push(channel._id);
              }

              // check if user group found in channel txViewFullAcl
              if ( channel.txViewFullAcl.indexOf(group) >= 0 || group === 'admin' ){
                allowedChannelsBody.push(channel._id);
              }

              // check if user group found in channel txRerunAcl
              if ( channel.txRerunAcl.indexOf(group) >= 0 || group === 'admin' ){
                allowedChannelsRerun.push(channel._id);
              }
            });
          });

          usersArray.push({ 'user': user, 'allowedChannels':allowedChannels, 'allowedChannelsBody':allowedChannelsBody, 'allowedChannelsRerun':allowedChannelsRerun });
        });

        $scope.usersChannelsMatrix = {};
        $scope.usersChannelsMatrix.channels = channelsArray;
        $scope.usersChannelsMatrix.users = usersArray;

      }, function(){ /* server error - could not connect to API to get channels */ });
      /* ----- Users Channels matrix ----- */

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

    /* -------------------------Initial load & onChanged---------------------------- */


    // function to determine if channel is in the allowedChannels array
    $scope.isAllowedChannel = function(channelID, allowedChannels){
      // check if channelID is found in allowedChannels
      if ( allowedChannels.indexOf(channelID) >= 0 ){
        return true;
      }
      return false;
    };



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
        button: 'Delete',
        message: 'Are you sure you wish to delete the user "' + user.firstname + ' ' + user.surname + '"?'
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
