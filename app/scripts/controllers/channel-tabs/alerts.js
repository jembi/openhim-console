export function channelAlertsCtrl ($scope, Api) {
  // watch parent scope for 'users' change
  $scope.$watch('users', function () {
    // setup usersMap options object
    $scope.usersMap = {}
    angular.forEach($scope.users, function (user) {
      $scope.usersMap[user.email] = user.firstname + ' ' + user.surname + ' (' + user.email + ')'
    })
  })

  // get the groups for the Channel Alert Group dropdown
  $scope.alertGroups = Api.ContactGroups.query(function () {
    $scope.groupsMap = {}
    angular.forEach($scope.alertGroups, function (group) {
      $scope.groupsMap[group._id] = group.group
    })
  },
  function () { /* server error - could not connect to API to get Alert Groups */ })

  /**********************************************************/
  /**   These are the functions for the Channel Alerts     **/
  /**********************************************************/

  // define the alerts backup object
  $scope.channelAlertsBackup = null
  $scope.newAlert = {}

  $scope.addAlert = function (newAlert) {
    if (!$scope.channel.alerts) {
      $scope.channel.alerts = []
    }
    $scope.channel.alerts.push(angular.copy(newAlert))
    // reset the backup route object when a record is added
    $scope.channelAlertsBackup = null

    // reset the alert object
    $scope.newAlert.status = null
    $scope.newAlert.failureRate = null
    $scope.newAlert.groups = []
    $scope.newAlert.users = []
  }

  $scope.editAlert = function (alertIndex, alert) {
    // remove the selected alert object from scope
    $scope.channel.alerts.splice(alertIndex, 1)

    // if backup object exist update alerts object with backup alert
    if ($scope.channelAlertsBackup !== null) {
      $scope.channel.alerts.push(angular.copy($scope.channelAlertsBackup))
    }
    // override backup alert object to new alert being editted
    $scope.channelAlertsBackup = angular.copy(alert)

    $scope.newAlert = alert
  }

  $scope.removeAlert = function (alertIndex) {
    $scope.channel.alerts.splice(alertIndex, 1)
  }

  $scope.isAlertValid = function () {
    if (!$scope.newAlert.condition) {
      return false
    }

    if ($scope.newAlert.condition === 'status' && !$scope.newAlert.status) {
      if (!$scope.newAlert.status) {
        return false
      }

      if ($scope.newAlert.status.length !== 3) {
        return false
      }
    }

    if ((!$scope.newAlert.users || $scope.newAlert.users.length === 0) && (!$scope.newAlert.groups || $scope.newAlert.groups.length === 0)) {
      return false
    }

    return true
  }

  /**********************************************************/
  /**   These are the functions for the Channel Alerts     **/
  /**********************************************************/

  /***************************************************************/
  /**   These are the functions for the Channel Alert Users     **/
  /***************************************************************/

  // define the alerts users backup object
  $scope.channelAlertsUsersBackup = null
  $scope.newAlertUser = {}

  $scope.addAlertUser = function (newAlertUser) {
    if (!$scope.newAlert.users) {
      $scope.newAlert.users = []
    }
    $scope.newAlert.users.push(angular.copy(newAlertUser))
    // reset the backup route object when a record is added
    $scope.channelAlertsUsersBackup = null

    // reset the backing object
    $scope.newAlertUser.user = ''
    $scope.newAlertUser.method = ''
    $scope.newAlertUser.maxAlerts = ''
  }

  $scope.editAlertUser = function (alertUserIndex, alertUser) {
    // remove the selected alert user object from scope
    $scope.newAlert.users.splice(alertUserIndex, 1)

    // if backup object exist update alerts users object with backup alert user
    if ($scope.channelAlertsUsersBackup !== null) {
      $scope.newAlert.users.push(angular.copy($scope.channelAlertsUsersBackup))
    }
    // override backup alert user object to new alert user being editted
    $scope.channelAlertsUsersBackup = angular.copy(alertUser)
    $scope.newAlertUser = alertUser
  }

  $scope.removeAlertUser = function (alertUserIndex) {
    $scope.newAlert.users.splice(alertUserIndex, 1)
  }

  $scope.isAlertUserValid = function () {
    if (!$scope.newAlertUser.user || !$scope.newAlertUser.method || !$scope.newAlertUser.maxAlerts) {
      return false
    }
    return true
  }

  /***************************************************************/
  /**   These are the functions for the Channel Alert Users     **/
  /***************************************************************/

  /****************************************************************/
  /**   These are the functions for the Channel Alert Groups     **/
  /****************************************************************/

  // define the alerts groups backup object
  $scope.newAlertGroup = {}
  $scope.newAlert.groups = []

  $scope.addAlertGroup = function (newAlertGroup) {
    if ($scope.newAlert.groups.indexOf(newAlertGroup.group) === -1) {
      $scope.newAlert.groups.push(angular.copy(newAlertGroup.group))
    }

    // reset the backing object
    $scope.newAlertGroup.group = ''
  }

  $scope.removeAlertGroup = function (alertGroupIndex) {
    $scope.newAlert.groups.splice(alertGroupIndex, 1)
  }

  $scope.isAlertGroupValid = function () {
    if (!$scope.newAlertGroup.group) {
      return false
    }
    return true
  }

  /****************************************************************/
  /**   These are the functions for the Channel Alert Groups     **/
  /****************************************************************/
}
