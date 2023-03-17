import { getHashAndSalt, isValidMSISDN } from '../utils'

export function UsersModalCtrl ($http, $scope, $uibModalInstance, $sce, $timeout, Api, login, Notify, Alerting, user) {
  /*************************************************************/
  /**   These are the functions for the User initial load     **/
  /*************************************************************/

  // default - update is false
  $scope.update = false
  $scope.phoneNumberTooltip = $sce.trustAsHtml('Accepted format: <br />27123456789 <br />( 5 - 15 digits )')

  // object for the taglist roles
  $scope.taglistUserRoleOptions = []

  // object to store temp values like password (not associated with schema object)
  $scope.temp = {}

  // get the allowed channels for the transaction settings
  Api.Channels.query(function (channels) {
    $scope.channels = channels

    $scope.primaryRoutes = []
    $scope.secondaryRoutes = []

    angular.forEach(channels, function (channel) {
      angular.forEach(channel.routes, function (route) {
        if (route.primary) {
          if ($scope.primaryRoutes.indexOf(route.name) < 0) {
            $scope.primaryRoutes.push(route.name)
          }
        } else {
          if ($scope.secondaryRoutes.indexOf(route.name) < 0) {
            $scope.secondaryRoutes.push(route.name)
          }
        }
      })
    })
  }, function () { /* server error - could not connect to API to get channels */ })

  // get the users for the taglist roles options
  Api.Users.query(function (users) {
    angular.forEach(users, function (user) {
      angular.forEach(user.groups, function (group) {
        if ($scope.taglistUserRoleOptions.indexOf(group) === -1) {
          $scope.taglistUserRoleOptions.push(group)
        }
      })
    })
  }, function () { /* server error - could not connect to API to get Users */ })

  // get/set the users scope whether new or update
  if (user) {
    $scope.update = true
    $scope.user = Api.Users.get({ email: user.email }, function () {
      // check visualizer settings properties exist
      if (!$scope.user.settings) {
        $scope.user.settings = {}
      }

      if (!$scope.user.settings.list) {
        $scope.user.settings.list = {}
      }
    })
  } else {
    $scope.user = new Api.Users()

    // create visualizer settings properties
    $scope.user.settings = {}
    $scope.user.settings.list = {}
    $scope.user.settings.filter = {}
    $scope.user.settings.filter.limit = 100
  }

  /*************************************************************/
  /**   These are the functions for the User initial load     **/
  /*************************************************************/

  /************************************************************/
  /**   These are the functions for the User Modal Popup     **/
  /************************************************************/

  const notifyUser = function () {
    // reset backing object and refresh users list
    Notify.notify('usersChanged')
    $uibModalInstance.close()
  }

  const success = function (user, password) {
    let consoleSession = localStorage.getItem('consoleSession')
    consoleSession = JSON.parse(consoleSession)

    if (user.email === consoleSession.sessionUser) {
      // update consoleSession with new userSettings
      consoleSession.sessionUserSettings = user.settings
      localStorage.setItem('consoleSession', JSON.stringify(consoleSession))

      if (password) {
        // re-login with new settings
        login.login(consoleSession.sessionUser, password, function (loggedIn) {
          if (loggedIn) {
            // add the success message
            Alerting.AlertAddMsg('top', 'success', 'Your details has been saved succesfully and you were logged in with your new credentials')
            notifyUser()
          } else {
            // add the error message
            Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while trying to log you in again with you new credentials')
            notifyUser()
          }
        })
      } else {
        // add the success message
        Alerting.AlertAddMsg('top', 'success', 'Your details has been saved succesfully')
        notifyUser()
      }
    } else {
      // add the success message
      Alerting.AlertAddMsg('top', 'success', 'The user has been saved successfully')
      notifyUser()
    }
  }

  const error = function (err) {
    // add the success message
    Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving the users\' details: #' + err.status + ' - ' + err.data)
    notifyUser()
  }

  const saveUser = function (user, password) {
    const userObject = angular.copy(user)
    if ($scope.update) {
      user.$update(function () {
        success(userObject, password)
      }, error)
    } else {
      user.$save({ email: '' }, success, error)
    }
  }

  const setHashAndSave = function (user, hash, salt, password) {
    if (typeof salt !== 'undefined' && salt !== null) {
      user.passwordSalt = salt
    }
    user.passwordHash = hash
    saveUser(user, password)
  }

  $scope.save = function (user, password) {
    if (password) {
      const h = getHashAndSalt(password)
      user.passwordAlgorithm = h.algorithm
      setHashAndSave(user, h.hash, h.salt, password)
    } else {
      saveUser(user, '')
    }
  }

  /************************************************************/
  /**   These are the functions for the User Modal Popup     **/
  /************************************************************/

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }

  /************************************************************************/
  /**   These are the general functions for the User form validation     **/
  /************************************************************************/

  $scope.validateFormUsers = function () {
    // reset hasErrors alert object
    Alerting.AlertReset('hasErrors')

    // clear timeout if it has been set
    $timeout.cancel($scope.clearValidation)

    $scope.ngError = {}
    $scope.ngError.hasErrors = false

    // name validation
    if (!$scope.user.email) {
      $scope.ngError.email = true
      $scope.ngError.hasErrors = true
    }

    // name validation
    if (!$scope.user.firstname) {
      $scope.ngError.firstname = true
      $scope.ngError.hasErrors = true
    }

    // domain validation
    if (!$scope.user.surname) {
      $scope.ngError.surname = true
      $scope.ngError.hasErrors = true
    }

    // roles validation
    if ($scope.user.msisdn && !isValidMSISDN($scope.user.msisdn)) {
      $scope.ngError.msisdn = true
      $scope.ngError.hasErrors = true
    }

    // groups validation
    if (!$scope.user.groups || $scope.user.groups.length === 0) {
      $scope.ngError.groups = true
      $scope.ngError.hasErrors = true
    }

    // ensure password check only happens on update
    if ($scope.update) {
      // password validation
      if ($scope.temp.password) {
        if (!$scope.temp.passwordConfirm || $scope.temp.password !== $scope.temp.passwordConfirm) {
          $scope.ngError.passwordConfirm = true
          $scope.ngError.hasErrors = true
        }
      }
    }

    if ($scope.ngError.hasErrors) {
      $scope.clearValidation = $timeout(function () {
        // clear errors after 5 seconds
        $scope.ngError = {}
      }, 5000)
      Alerting.AlertAddMsg('hasErrors', 'danger', $scope.validationFormErrorsMsg)
    }
  }

  $scope.submitFormUsers = function () {
    // validate the form first to check for any errors
    $scope.validateFormUsers()

    // save the user object if no errors are present
    if ($scope.ngError.hasErrors === false) {
      $scope.save($scope.user, $scope.temp.password)
    }
  }

  /************************************************************************/
  /**   These are the general functions for the User form validation     **/
  /************************************************************************/
}
