import usersmodal from '~/views/usersmodal'
import confirmModal from '~/views/confirmModal'
import { UsersModalCtrl, ConfirmModalCtrl } from './'

export function UsersCtrl ($scope, $uibModal, $window, Api, Alerting, Notify) {
  /* -------------------------Initial load & onChanged---------------------------- */
  const querySuccess = function (users) {
    $scope.users = users
    if (users.length === 0) {
      Alerting.AlertReset()
      Alerting.AlertAddMsg('bottom', 'warning', 'There are currently no users created')
    }

    /* ----- Users Channels matrix ----- */
    // Query all channels for Users Channels matrix table
    Api.Channels.query(function (channels) {
      const usersArray = []
      const channelsArray = []

      // loop through channels to create channels map
      angular.forEach(channels, function (channnel) {
        if (typeof channnel.status === 'undefined' || channnel.status !== 'deleted') {
          channelsArray.push({ id: channnel._id, name: channnel.name })
        }
      })

      // loop through all users
      angular.forEach(users, function (user) {
        const allowedChannels = []
        const allowedChannelsRerun = []
        const allowedChannelsBody = []

        // loop through channels to determine if user has permissions
        angular.forEach(channels, function (channel) {
          // loop through each user group to check if channel has access
          angular.forEach(user.groups, function (group) {
            // check if user group found in channel txViewAcl
            if (channel.txViewAcl.indexOf(group) >= 0 || group === 'admin') {
              allowedChannels.push(channel._id)
            }

            // check if user group found in channel txViewFullAcl
            if (channel.txViewFullAcl.indexOf(group) >= 0 || group === 'admin') {
              allowedChannelsBody.push(channel._id)
            }

            // check if user group found in channel txRerunAcl
            if (channel.txRerunAcl.indexOf(group) >= 0 || group === 'admin') {
              allowedChannelsRerun.push(channel._id)
            }
          })
        })

        usersArray.push({ user: user, allowedChannels: allowedChannels, allowedChannelsBody: allowedChannelsBody, allowedChannelsRerun: allowedChannelsRerun })
      })

      $scope.usersChannelsMatrix = {}
      $scope.usersChannelsMatrix.channels = channelsArray
      $scope.usersChannelsMatrix.users = usersArray
    }, function () { /* server error - could not connect to API to get channels */ })
    /* ----- Users Channels matrix ----- */
  }

  const queryError = function (err) {
    // on error - add server error alert
    Alerting.AlertReset()
    Alerting.AlertAddServerMsg(err.status)
  }

  // do the initial request
  Api.Users.query(querySuccess, queryError)

  $scope.$on('usersChanged', function () {
    Api.Users.query(querySuccess, queryError)
  })

  /* -------------------------Initial load & onChanged---------------------------- */

  // function to determine if channel is in the allowedChannels array
  $scope.isAllowedChannel = function (channelID, allowedChannels) {
    // check if channelID is found in allowedChannels
    if (allowedChannels.indexOf(channelID) >= 0) {
      return true
    }
    return false
  }

  /* -------------------------Add/edit user popup modal---------------------------- */
  $scope.addUser = function () {
    Alerting.AlertReset()

    $uibModal.open({
      template: usersmodal,
      controller: UsersModalCtrl,
      resolve: {
        user: function () {
        }
      }
    })
  }

  $scope.editUser = function (user) {
    Alerting.AlertReset()

    $uibModal.open({
      template: usersmodal,
      controller: UsersModalCtrl,
      resolve: {
        user: function () {
          return user
        }
      }
    })
  }
  /* -------------------------Add/edit user popup modal---------------------------- */

  /* --------------------------Delete Confirm---------------------------- */
  $scope.confirmDelete = function (user) {
    Alerting.AlertReset()

    const deleteObject = {
      title: 'Delete User',
      button: 'Delete',
      message: 'Are you sure you wish to delete the user "' + user.firstname + ' ' + user.surname + '"?'
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
      // Delete confirmed - check if current user deleted themself, set flag, then delete user
      $scope.sessionUserDeleted = false
      let sessionUser = localStorage.getItem('loggedOnUser')
      sessionUser = JSON.parse(sessionUser)

      if (sessionUser.email === user.email) {
        $scope.sessionUserDeleted = true
      }

      user.$remove(deleteSuccess, deleteError)
    }, function () {
      // delete cancelled - do nothing
    })
  }

  const deleteSuccess = function () {
    // On success - if current user was deleted, logout
    if ($scope.sessionUserDeleted) {
      $window.location = '#/logout'
      return
    }
    $scope.users = Api.Users.query()
    Alerting.AlertReset()
    Notify.notify('usersChanged')
    Alerting.AlertAddMsg('top', 'success', 'The user has been deleted successfully')
  }

  const deleteError = function (err) {
    // add the error message
    Alerting.AlertReset()
    Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while deleting the user: #' + err.status + ' - ' + err.data)
  }
  /* ---------------------------Delete Confirm---------------------------- */
}
