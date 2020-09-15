export function ContactGroupsModalCtrl ($scope, $uibModalInstance, $timeout, Api, login, Notify, Alerting, contactGroup) {
  /*********************************************************************/
  /**   These are the functions for the contactGroup initial load     **/
  /*********************************************************************/

  // object to store temp values like password (not associated with schema object)
  $scope.temp = {}

  // get the users for the Channel Alert User dropdown
  $scope.alertUsers = Api.Users.query(function () {
    $scope.usersMap = {}
    angular.forEach($scope.alertUsers, function (user) {
      $scope.usersMap[user.email] = user.firstname + ' ' + user.surname + ' (' + user.email + ')'
    })
  },
  function () {
    // server error - could not connect to API to get channels
  })

  // get/set the contactGroup scope whether new or update
  if (contactGroup) {
    $scope.update = true
    $scope.contactGroup = Api.ContactGroups.get({ groupId: contactGroup._id })
  } else {
    $scope.update = false
    $scope.contactGroup = new Api.ContactGroups()
  }

  /*********************************************************************/
  /**   These are the functions for the contactGroup initial load     **/
  /*********************************************************************/

  /********************************************************************/
  /**   These are the functions for the contactGroup Modal Popup     **/
  /********************************************************************/

  const notifyContactGroup = function () {
    // reset backing object and refresh users list
    Notify.notify('contactGroupChanged')
    $uibModalInstance.close()
  }

  const success = function () {
    // add the success message
    Alerting.AlertAddMsg('top', 'success', 'The contact list has been saved successfully')
    notifyContactGroup()
  }

  const error = function (err) {
    // add the success message
    Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving the contact lists\' details: #' + err.status + ' - ' + err.data)
    notifyContactGroup()
  }

  const saveContactGroup = function (contactGroup) {
    if ($scope.update) {
      contactGroup.$update(success, error)
    } else {
      contactGroup.$save({}, success, error)
    }
  }

  /************************************************************/
  /**   These are the functions for the User Modal Popup     **/
  /************************************************************/

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }

  /**********************************************************/
  /**   These are the functions for the Channel Alerts     **/
  /**********************************************************/

  // define the alerts backup object
  $scope.newGroupUserBackup = null
  $scope.newGroupUser = {}

  $scope.addGroupUser = function (newGroupUser) {
    if (!$scope.contactGroup.users) {
      $scope.contactGroup.users = []
    }
    $scope.contactGroup.users.push(angular.copy(newGroupUser))
    // reset the backup route object when a record is added
    $scope.newGroupUserBackup = null

    // reset the newGroupUser object
    $scope.newGroupUser.user = ''
    $scope.newGroupUser.method = ''
    $scope.newGroupUser.maxAlerts = ''
  }

  $scope.editGroupUser = function (userIndex, user) {
    // remove the selected user object from scope
    $scope.contactGroup.users.splice(userIndex, 1)

    // if backup object exist update alerts object with backup user
    if ($scope.newGroupUserBackup !== null) {
      $scope.contactGroup.users.push(angular.copy($scope.newGroupUserBackup))
    }
    // override backup user object to new user being editted
    $scope.newGroupUserBackup = angular.copy(user)

    $scope.newGroupUser = user
  }

  $scope.removeGroupUser = function (userIndex) {
    $scope.contactGroup.users.splice(userIndex, 1)
  }

  $scope.isGroupUserValid = function () {
    if (!$scope.newGroupUser.user || !$scope.newGroupUser.method || !$scope.newGroupUser.maxAlerts) {
      return false
    }
    return true
  }

  /**********************************************************/
  /**   These are the functions for the Channel Alerts     **/
  /**********************************************************/

  /************************************************************************/
  /**   These are the general functions for the User form validation     **/
  /************************************************************************/

  $scope.validateFormContactGroups = function () {
    // reset hasErrors alert object
    Alerting.AlertReset('hasErrors')

    // clear timeout if it has been set
    $timeout.cancel($scope.clearValidation)

    $scope.ngError = {}
    $scope.ngError.hasErrors = false

    // group name validation
    if (!$scope.contactGroup.group) {
      $scope.ngError.group = true
      $scope.ngError.hasErrors = true
    }

    // group users validation
    if (!$scope.contactGroup.users || $scope.contactGroup.users.length === 0) {
      $scope.ngError.users = true
      $scope.ngError.hasErrors = true
    }

    if ($scope.ngError.hasErrors) {
      $scope.clearValidation = $timeout(function () {
        // clear errors after 5 seconds
        $scope.ngError = {}
      }, 5000)
      Alerting.AlertAddMsg('hasErrors', 'danger', $scope.validationFormErrorsMsg)
    }
  }

  $scope.submitFormContactGroups = function () {
    // validate the form first to check for any errors
    $scope.validateFormContactGroups()

    // save the user object if no errors are present
    if ($scope.ngError.hasErrors === false) {
      saveContactGroup($scope.contactGroup)
    }
  }

  /************************************************************************/
  /**   These are the general functions for the User form validation     **/
  /************************************************************************/
}
