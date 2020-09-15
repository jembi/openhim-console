import { isValidMSISDN, getHashAndSalt } from '../utils'

export function SetPasswordCtrl ($scope, $uibModal, $routeParams, $timeout, $location, Api, Alerting) {
  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  // object to store temp values like password
  $scope.temp = {}

  $scope.passwordSetSuccessful = false

  const setPassSuccess = function (user) {
    $scope.user = user
    $scope.tokenType = user.tokenType
  }

  const setPassError = function (err) {
    Alerting.AlertReset()
    // on error - add server error alert
    if (err.status === 404) {
      Alerting.AlertAddMsg('top', 'danger', 'Invalid token')
    } else if (err.status === 410) {
      // expired new user
      Alerting.AlertAddMsg('top', 'danger', 'The time to set the new user password has expired. Please contact your OpenHIM administrator to set your password')
    } else {
      Alerting.AlertAddServerMsg(err.status)
    }
  }

  // get the Data for the supplied token
  Api.UserPasswordToken.get({ token: $routeParams.token }, setPassSuccess, setPassError)

  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  /****************************************************************/
  /**   These are the functions for the Profile save process     **/
  /****************************************************************/

  const success = function () {
    $scope.goToTop()
    Alerting.AlertReset()
    Alerting.AlertAddMsg('top', 'success', 'Your user details have been updated succesfully. You will be redirected to the login screen shortly.')
    $scope.passwordSetSuccessful = true

    $scope.redirectToLogin = $timeout(function () {
      // redirect after 5 seconds
      $location.path('/login').search({ email: $scope.user.email })
    }, 5000)
  }

  const error = function (err) {
    Alerting.AlertReset()
    // add the error message
    if (err.status === 410) {
      // expired new user
      Alerting.AlertAddMsg('top', 'danger', 'The time to set the new user password has expired. Please contact your OpenHIM administrator to set your password')
    } else {
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving your details: #' + err.status + ' - ' + err.data)
      Alerting.AlertAddMsg('top', 'danger', 'Please contact your OpenHIM administrator to set your password')
    }
  }

  const saveUser = function (user) {
    Api.UserPasswordToken.update({ token: $routeParams.token }, user, success, error)
  }

  const setHashAndSave = function (user, hash, salt) {
    if (typeof salt !== 'undefined' && salt !== null) {
      user.passwordSalt = salt
    }
    user.passwordHash = hash
    saveUser(user)
  }

  $scope.save = function (user, password) {
    if (password) {
      const h = getHashAndSalt(password)
      user.passwordAlgorithm = h.algorithm
      setHashAndSave(user, h.hash, h.salt, password)
    }
  }

  /****************************************************************/
  /**   These are the functions for the Profile save process     **/
  /****************************************************************/

  /*******************************************************************************/
  /**   These are the general functions for the SetPassword form validation     **/
  /*******************************************************************************/

  $scope.validateFormSetPassword = function () {
    // reset hasErrors alert object
    Alerting.AlertReset('hasErrors')
    Alerting.AlertReset('top')

    // clear timeout if it has been set
    $timeout.cancel($scope.clearValidation)

    $scope.ngError = {}
    $scope.ngError.hasErrors = false

    // name validation
    if (!$scope.user.firstname) {
      $scope.ngError.firstname = true
      $scope.ngError.hasErrors = true
    }

    // MSISDN validation
    if ($scope.user.msisdn && !isValidMSISDN($scope.user.msisdn)) {
      $scope.ngError.msisdn = true
      $scope.ngError.hasErrors = true
    }

    // domain validation
    if (!$scope.user.surname) {
      $scope.ngError.surname = true
      $scope.ngError.hasErrors = true
    }

    // password validation
    if ($scope.temp.password) {
      if (!$scope.temp.passwordConfirm || $scope.temp.password !== $scope.temp.passwordConfirm) {
        $scope.ngError.passwordConfirm = true
        $scope.ngError.hasErrors = true
      }
    } else {
      $scope.ngError.password = true
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

  $scope.submitFormSetPassword = function () {
    // validate the form first to check for any errors
    $scope.validateFormSetPassword()
    // save the users password if no errors are present
    if ($scope.ngError.hasErrors === false) {
      $scope.save($scope.user, $scope.temp.password)
    }
  }

  /*******************************************************************************/
  /**   These are the general functions for the SetPassword form validation     **/
  /*******************************************************************************/
}
