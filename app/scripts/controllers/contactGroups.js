'use strict'

angular.module('openhimConsoleApp')
  .controller('ContactGroupsCtrl', function ($scope, $modal, Api, Alerting) {
    /************************************************/
    /**         Initial load & onChanged           **/
    /************************************************/
    var querySuccess = function (contactGroups) {
      $scope.contactGroups = contactGroups
      if (contactGroups.length === 0) {
        Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no contact lists created')
      }
    }

    var queryError = function (err) {
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status)
    }

    // do the initial request
    Api.ContactGroups.query(querySuccess, queryError)

    $scope.$on('contactGroupChanged', function () {
      Api.ContactGroups.query(querySuccess, queryError)
    })
    /************************************************/
    /**         Initial load & onChanged           **/
    /************************************************/

    /**********************************************************/
    /**         Add/edit contactGroups popup modal           **/
    /**********************************************************/
    $scope.addContactGroup = function () {
      Alerting.AlertReset()
      $modal.open({
        templateUrl: 'views/contactGroupsModal.html',
        controller: 'ContactGroupsModalCtrl',
        resolve: {
          contactGroup: function () {}
        }
      })
    }

    $scope.editContactGroup = function (contactGroup) {
      Alerting.AlertReset()

      $modal.open({
        templateUrl: 'views/contactGroupsModal.html',
        controller: 'ContactGroupsModalCtrl',
        resolve: {
          contactGroup: function () {
            return contactGroup
          }
        }
      })
    }
    /**********************************************************/
    /**         Add/edit contactGroups popup modal           **/
    /**********************************************************/

    /*******************************************/
    /**         Delete Confirmation           **/
    /*******************************************/
    var deleteSuccess = function () {
      // On success
      $scope.contactGroups = Api.ContactGroups.query()
      Alerting.AlertAddMsg('top', 'success', 'The contact list has been deleted successfully')
    }

    var deleteError = function (err) {
      if (err.status === 409) {
        var warningMessage = 'Could not delete the contact list because it is associated with the following channels: '
        for (var i = 0; i < err.data.length; i++) {
          if (i > 0) {
            warningMessage += ', '
          }
          warningMessage += err.data[i].name
        }
        Alerting.AlertAddMsg('top', 'warning', warningMessage)
      } else {
        // add the error message
        Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while deleting the contact list: #' + err.status + ' - ' + err.data)
      }
    }

    $scope.confirmDelete = function (contactGroup) {
      Alerting.AlertReset()

      var deleteObject = {
        title: 'Delete Contact Group',
        button: 'Delete',
        message: 'Are you sure you wish to delete the Contact list "' + contactGroup.group + '"?'
      }

      var modalInstance = $modal.open({
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: function () {
            return deleteObject
          }
        }
      })

      modalInstance.result.then(function () {
        // Delete confirmed - delete the contact group
        contactGroup.$remove(deleteSuccess, deleteError)
      }, function () {
        // delete cancelled - do nothing
      })
    }

    /*******************************************/
    /**         Delete Confirmation           **/
    /*******************************************/
  })
