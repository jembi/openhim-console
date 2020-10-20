import confirmModal from '~/views/confirmModal'
import mediatorConfigModal from '~/views/mediatorConfigModal'
import { ConfirmModalCtrl, MediatorConfigModalCtrl } from './'

export function MediatorsCtrl ($scope, $uibModal, $location, Api, Alerting, MediatorDisplay) {
  /******************************************************************/
  /**   These are the functions for the Mediators initial load     **/
  /******************************************************************/

  const querySuccess = function (mediators) {
    $scope.mediators = mediators
    if (mediators.length === 0) {
      Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no mediators created')
    } else {
      MediatorDisplay.formatMediators(mediators)
    }
  }

  const queryError = function (err) {
    // on error - add server error alert
    Alerting.AlertAddServerMsg(err.status)
  }

  // do the initial request
  Api.Mediators.query(querySuccess, queryError)

  /******************************************************************/
  /**   These are the functions for the Mediators initial load     **/
  /******************************************************************/

  // location provider - load transaction details
  $scope.viewMediatorDetails = function (path, $event) {
    // do mediators details redirection when clicked on TD
    if ($event.target.tagName === 'TD') {
      $location.path(path)
    }
  }

  /***********************************/
  /**   Delete Mediator Functions   **/
  /***********************************/

  const deleteSuccess = function () {
    // On success
    $scope.mediators = Api.Mediators.query(querySuccess, queryError)
    Alerting.AlertAddMsg('top', 'success', 'The Mediator has been deleted successfully')
  }

  const deleteError = function (err) {
    // add the error message
    Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while deleting the Mediator: #' + err.status + ' - ' + err.data)
  }

  $scope.confirmDelete = function (mediator) {
    Alerting.AlertReset()

    const deleteObject = {
      title: 'Delete Mediator',
      button: 'Delete',
      message: 'Are you sure you wish to delete the mediator "' + mediator.name + '"?'
    }

    const modalInstance = $uibModal.open({
      template: confirmModal,
      controller: ConfirmModalCtrl,
      resolve: {
        confirmObject: function () {
          return deleteObject
        }
      }
    })

    modalInstance.result.then(function () {
      // Delete confirmed - delete the user
      mediator.$remove(deleteSuccess, deleteError)
    }, function () {
      // delete cancelled - do nothing
    })
  }

  /***********************************/
  /**   Delete Mediator Functions   **/
  /***********************************/

  $scope.editMediatorConfig = function (mediator) {
    Alerting.AlertReset()

    $uibModal.open({
      template: mediatorConfigModal,
      controller: MediatorConfigModalCtrl,
      resolve: {
        mediator: function () {
          return mediator
        }
      }
    })
  }
}
