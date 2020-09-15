import channelsmodal from '~/views/channelsmodal'
import confirmModal from '~/views/confirmModal'
import { ChannelsModalCtrl, ConfirmModalCtrl } from './'

export function ChannelsCtrl ($scope, $uibModal, Api, Alerting) {
  /* -------------------------Initial load & onChanged---------------------------- */
  const querySuccess = function (channels) {
    $scope.channels = channels
    if (channels.length === 0) {
      Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no channels created')
    }
  }

  const queryError = function (err) {
    // on error - add server error alert
    Alerting.AlertAddServerMsg(err.status)
  }

  // do the initial request
  Api.Channels.query(querySuccess, queryError)

  $scope.$on('channelsChanged', function () {
    Api.Channels.query(querySuccess, queryError)
  })
  /* -------------------------Initial load & onChanged---------------------------- */

  /* -------------------------Add/edit user popup modal---------------------------- */
  $scope.addChannel = function () {
    Alerting.AlertReset()

    $uibModal.open({
      template: channelsmodal,
      controller: ChannelsModalCtrl,
      resolve: {
        channel: function () { },
        channelDuplicate: function () { },
        tab: function () { }
      }
    })
  }

  $scope.editChannel = function (channel, tab) {
    Alerting.AlertReset()

    $uibModal.open({
      template: channelsmodal,
      controller: ChannelsModalCtrl,
      resolve: {
        channel: function () {
          return channel
        },
        channelDuplicate: function () { },
        tab: function () {
          return tab
        }
      }
    })
  }

  $scope.duplicateChannel = function (channel) {
    Alerting.AlertReset()

    $uibModal.open({
      template: channelsmodal,
      controller: ChannelsModalCtrl,
      resolve: {
        channel: function () { },
        channelDuplicate: function () {
          return channel._id
        },
        tab: function () { }
      }
    })
  }
  /* -------------------------Add/edit user popup modal---------------------------- */

  /* --------------------------Delete Confirm---------------------------- */
  const deleteSuccess = function () {
    // On success
    $scope.channels = Api.Channels.query()
    Alerting.AlertAddMsg('top', 'success', 'The channel has been deleted successfully')
  }

  const deleteError = function (err) {
    // add the error message
    Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while deleting the channel: #' + err.status + ' - ' + err.data)
  }

  $scope.confirmDelete = function (channel) {
    Alerting.AlertReset()

    const deleteObject = {
      title: 'Delete Channel',
      button: 'Delete',
      message: 'Are you sure you wish to delete the channel "' + channel.name + '"?'
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
      channel.$remove(deleteSuccess, deleteError)
    }, function () {
      // delete cancelled - do nothing
    })
  }
  /* ---------------------------Delete Confirm---------------------------- */

  /* --------------------------Restore Confirm---------------------------- */
  const restoreSuccess = function () {
    // On success
    $scope.channels = Api.Channels.query()
    Alerting.AlertAddMsg('top', 'success', 'The channel has been successfully restored')
  }

  const restoreError = function (err) {
    // add the error message
    Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while restoring the channel: #' + err.status + ' - ' + err.data)
  }

  $scope.confirmRestore = function (channel) {
    Alerting.AlertReset()

    const restoreObject = {
      title: 'Restore Channel',
      button: 'Restore',
      message: 'Are you sure you want to restore the deleted channel "' + channel.name + '"?'
    }

    const modalInstance = $uibModal.open({
      template: confirmModal,
      controller: ConfirmModalCtrl,
      resolve: {
        confirmObject: function () {
          return restoreObject
        }
      }
    })

    modalInstance.result.then(function () {
      // restore confirmed
      channel.status = 'enabled'
      channel.$update(restoreSuccess, restoreError)
    }, function () {
      // restore cancelled - do nothing
    })
  }

  /* --------------------------Update priority Level---------------------------- */
  $scope.updateChannelPriority = function (channel, direction) {
    let newPriority
    const curPriority = channel.priority
    if (!curPriority) {
      newPriority = $scope.getLowestPriority() + 1
    } else {
      // set priority to lower number ( minus 1 )
      if (direction === 'up') {
        if (curPriority === 1) { return }

        newPriority = curPriority - 1
      } else {
        newPriority = curPriority + 1
      }
    }

    channel.priority = newPriority
    channel.$update(function () {
      // reload channels
      $scope.$broadcast('channelsChanged')
    }, function (err) {
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while updating the channel: #' + err.status + ' - ' + err.data)
    })
  }

  $scope.getLowestPriority = function () {
    let lowestPriority = 0
    for (let i = 0; i < $scope.channels.length; i++) {
      if ($scope.channels[i].priority && $scope.channels[i].priority > lowestPriority) {
        lowestPriority = $scope.channels[i].priority
      }
    }
    return lowestPriority
  }
}
