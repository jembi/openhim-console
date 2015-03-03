'use strict';

angular.module('openhimConsoleApp')
  .controller('ContactGroupsCtrl', function ($scope, $modal, Api, Alerting) {


    /************************************************/
    /**         Initial load & onChanged           **/
    /************************************************/
    var querySuccess = function(contactGroups){
      $scope.contactGroups = contactGroups;
      if( contactGroups.length === 0 ){
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no contact groups created');
      }
    };

    var queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    // do the initial request
    Api.ContactGroups.query(querySuccess, queryError);

    $scope.$on('contactGroupChanged', function () {
      Api.ContactGroups.query(querySuccess, queryError);
    });
    /************************************************/
    /**         Initial load & onChanged           **/
    /************************************************/



    /**********************************************************/
    /**         Add/edit contactGroups popup modal           **/
    /**********************************************************/
    $scope.addContactGroup = function () {
      Alerting.AlertReset();
      $modal.open({
        templateUrl: 'views/contactGroupsModal.html',
        controller: 'ContactGroupsModalCtrl',
        resolve: {
          contactGroup: function () {
          }
        }
      });
    };

    $scope.editContactGroup = function (contactGroup) {
      Alerting.AlertReset();

      $modal.open({
        templateUrl: 'views/contactGroupsModal.html',
        controller: 'ContactGroupsModalCtrl',
        resolve: {
          contactGroup: function () {
            return contactGroup;
          }
        }
      });
    };
    /**********************************************************/
    /**         Add/edit contactGroups popup modal           **/
    /**********************************************************/



    /*******************************************/
    /**         Delete Confirmation           **/
    /*******************************************/
    $scope.confirmDelete = function(contactGroup){
      Alerting.AlertReset();

      var deleteObject = {
        title: 'Delete Contact Group',
        button: 'Delete',
        message: 'Are you sure you wish to delete the Contact Group "' + contactGroup.group + '"?'
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
        // Delete confirmed - delete the contact group
        contactGroup.$remove(deleteSuccess, deleteError);
      }, function () {
        // delete cancelled - do nothing
      });

    };

    var deleteSuccess = function () {
      // On success
      $scope.contactGroups = Api.ContactGroups.query();
      Alerting.AlertAddMsg('top', 'success', 'The contact group has been deleted successfully');
    };

    var deleteError = function (err) {
      // add the error message
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while deleting the contact group: #' + err.status + ' - ' + err.data);
    };
    /*******************************************/
    /**         Delete Confirmation           **/
    /*******************************************/

  });
