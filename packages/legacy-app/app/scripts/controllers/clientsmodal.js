import * as CryptoJS from 'crypto-js'
import { v4 as uuidV4 } from 'uuid'

export function ClientsModalCtrl ($rootScope, $scope, $uibModalInstance, $timeout, Api, Notify, Alerting, client) {
  /***************************************************************/
  /**   These are the functions for the Client initial load     **/
  /***************************************************************/

  // object to store temp values like password (not associated with schema object)
  $scope.temp = {}

  $scope.roles = {}
  $scope.formData = {}
  $scope.formData.assigned = {}
  $scope.formData.newClientRole = null

  Api.AuthenticationTypes.query(function (authTypes) {
    $scope.authTypes = authTypes
  })

  const checkAssignedRoles = function () {
    for (let i = 0; i < $scope.client.roles.length; i++) {
      $scope.formData.assigned[$scope.client.roles[i]] = true
    }
  }

  $scope.$watch('client', function () {
    Api.Roles.query(function (roles) {
      $scope.roles = roles
    })
  })

  const removeRole = function (roleName) {
    let index = -1
    for (let i = 0; i < $scope.client.roles.length; i++) {
      if ($scope.client.roles[i] === roleName) {
        index = i
        break
      }
    }
    $scope.client.roles.splice(index, 1)
  }

  $scope.toggleAssignedRoles = function (role) {
    if ($scope.formData.assigned[role]) {
      $scope.formData.assigned[role] = false
      removeRole(role)
    } else {
      $scope.formData.assigned[role] = true
      $scope.client.roles.push(role)
    }
  }

  const isDuplicateRole = function (role) {
    let isDuplicate = false
    for (let i = 0; i < $scope.roles.length; i++) {
      if ($scope.roles[i].name === role) {
        isDuplicate = true
      }
    }
    return isDuplicate
  }

  Api.Clients.query(function (clients) {
    $scope.clients = clients
  })

  const isClient = function (role) {
    let isClient = false
    for (let i = 0; i < $scope.clients.length; i++) {
      if ($scope.clients[i].clientID === role) {
        isClient = true
      }
    }
    return isClient
  }

  $scope.createNewRole = function () {
    const newRole = $scope.formData.newClientRole
    if (newRole) {
      if (isDuplicateRole(newRole) || isClient(newRole)) {
        $scope.formData.duplicateNewRole = true
      } else {
        $scope.formData.duplicateNewRole = false
        $scope.client.roles.push(newRole)
        $scope.roles.push({ name: newRole })
        $scope.formData.assigned[newRole] = true
        $scope.formData.newClientRole = null
      }
    }
  }

  $scope.generateUuid = function () {
    $scope.client.customTokenID = uuidV4()
  }

  $scope.removeCustomToken = function () {
    $scope.client.customTokenSet = false
    $scope.client.customTokenID = null
  }

  $scope.removeBasicAuth = function () {
    $scope.client.passwordHash = null
    $scope.client.passwordSalt = null
  }

  // fetch the keystore for cert dropdown
  Api.Keystore.query({ type: 'ca' }, function (certs) {
    $scope.certs = certs
  })

  // if client exist then update true
  if (client) {
    $scope.update = true
    $scope.client = angular.copy(client)
    checkAssignedRoles()
  } else {
    $scope.update = false
    $scope.client = new Api.Clients()
    $scope.client.roles = []
  }

  /***************************************************************/
  /**   These are the functions for the Client initial load     **/
  /***************************************************************/

  /**************************************************************/
  /**   These are the functions for the Client Modal Popup     **/
  /**************************************************************/

  const notifyUser = function () {
    // reset backing object and refresh clients list
    Notify.notify('clientsChanged')
    Notify.notify('rolesChanged')
    $uibModalInstance.close()
  }

  const success = function () {
    // add the success message
    Alerting.AlertAddMsg('client', 'success', 'The client has been saved successfully')
    notifyUser()
  }

  const error = function (err) {
    // add the success message
    Alerting.AlertAddMsg('client', 'danger', 'An error has occurred while saving the clients\' details: #' + err.status + ' - ' + err.data)
    notifyUser()
  }

  const saveClient = function (client) {
    // set backup client object to check if cert has changed
    $scope.clientBackup = angular.copy(client)
    if ($scope.update) {
      client.$update(success, error)
    } else {
      client.$save({ clientId: '' }, success, error)
    }
  }

  const setHashAndSave = function (client, hash, salt) {
    if (typeof salt !== 'undefined' && salt !== null) {
      client.passwordSalt = salt
    }
    client.passwordHash = hash
    saveClient(client)
  }

  const hashSHA512 = function (client, password) {
    const salt = CryptoJS.lib.WordArray.random(16).toString()
    const sha512 = CryptoJS.algo.SHA512.create()
    sha512.update(password)
    sha512.update(salt)
    const hash = sha512.finalize()
    client.passwordAlgorithm = 'sha512'
    setHashAndSave(client, hash.toString(CryptoJS.enc.Hex), salt)
  }

  $scope.save = function (client, password) {
    if (password) {
      hashSHA512(client, password)
    } else {
      saveClient(client)
    }
  }

  /**************************************************************/
  /**   These are the functions for the Client Modal Popup     **/
  /**************************************************************/

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }

  /**************************************************************************/
  /**   These are the general functions for the Client form validation     **/
  /**************************************************************************/

  $scope.validateFormClients = function () {
    // reset hasErrors alert object
    Alerting.AlertReset('hasErrors')

    // clear timeout if it has been set
    $timeout.cancel($scope.clearValidation)

    $scope.ngError = {}
    $scope.ngError.hasErrors = false

    // clientID validation
    if (!$scope.client.clientID) {
      $scope.ngError.clientID = true
      $scope.ngError.hasErrors = true
      $scope.ngError.clientBasicInfoTab = true
    }

    // name validation
    if (!$scope.client.name) {
      $scope.ngError.name = true
      $scope.ngError.hasErrors = true
      $scope.ngError.clientBasicInfoTab = true
    }

    // roles validation
    if (!$scope.client.roles || $scope.client.roles.length === 0) {
      $scope.ngError.roles = true
      $scope.ngError.hasErrors = true
      $scope.ngError.clientBasicInfoTab = true
    }

    // password/certificate validation (new user)
    if ($scope.update === false) {
      if (
        !$scope.client.certFingerprint &&
        !$scope.temp.password &&
        !$scope.client.customTokenID &&
        $scope.authTypes.indexOf('jwt-auth') == -1
      ) {
        $scope.ngError.certFingerprint = true
        $scope.ngError.customTokenID = true
        $scope.ngError.password = true
        $scope.ngError.hasErrors = true
        $scope.ngError.clientAuthenticationTab = true
      }
    } else {
      if (
        !$scope.client.certFingerprint &&
        !$scope.temp.password &&
        !$scope.client.passwordHash &&
        !($scope.client.customTokenID || $scope.client.customTokenSet) &&
        $scope.authTypes.indexOf('jwt-auth') == -1
      ) {
        $scope.ngError.certFingerprint = true
        $scope.ngError.customTokenID = true
        $scope.ngError.password = true
        $scope.ngError.hasErrors = true
        $scope.ngError.clientAuthenticationTab = true
      }
    }

    // password validation
    if ($scope.temp.password) {
      if (!$scope.temp.passwordConfirm || $scope.temp.password !== $scope.temp.passwordConfirm) {
        $scope.ngError.passwordConfirm = true
        $scope.ngError.hasErrors = true
        $scope.ngError.clientAuthenticationTab = true
      }
    }

    if ($scope.ngError.hasErrors) {
      $scope.clearValidation = $timeout(function () {
        // clear errors after 5 seconds
        $scope.ngError = {}
        Alerting.AlertReset('hasErrors')
      }, 5000)
      Alerting.AlertAddMsg('hasErrors', 'danger', $scope.validationFormErrorsMsg)
    }
  }

  $scope.submitFormClients = function () {
    // validate the form first to check for any errors
    $scope.validateFormClients()
    // save the client object if no errors are present
    if ($scope.ngError.hasErrors === false) {
      $scope.save($scope.client, $scope.temp.password)
    }
  }

  /**************************************************************************/
  /**   These are the general functions for the Client form validation     **/
  /**************************************************************************/
}
