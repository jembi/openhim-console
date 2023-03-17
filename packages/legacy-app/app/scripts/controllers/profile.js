import { isValidMSISDN, getHashAndSalt } from '../utils'

export function ProfileCtrl ($http, $scope, $timeout, Api, login, Alerting) {
  /****************************************************************/
  /**   These are the functions for the Profile initial load     **/
  /****************************************************************/

  let consoleSession = localStorage.getItem('consoleSession')
  consoleSession = JSON.parse(consoleSession)
  $scope.consoleSession = consoleSession

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

  Api.Mediators.query(function (mediators) {
    $scope.mediators = mediators
  }, function () { /* server error - could not connect to API to get mediators */ })

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

  const querySuccess = function (user) {
    $scope.user = user

    // check visualizer settings properties exist
    if (!$scope.user.settings) {
      $scope.user.settings = {}
    }

    if (!$scope.user.settings.list) {
      $scope.user.settings.list = {}
    }

    const isUsingOldVisualizerSettings = $scope.user.settings.visualizer &&
      $scope.user.settings.visualizer.endpoints && !$scope.user.settings.visualizer.mediators

    if (!$scope.user.settings.visualizer || isUsingOldVisualizerSettings) {
      if (!isUsingOldVisualizerSettings) {
        $scope.user.settings.visualizer = {}

        // load default visualizer config for user with no visualizer settings

        $http.get('config/visualizer.json').then(function (visualizerConfig) {
          angular.extend($scope.user.settings.visualizer, angular.copy(visualizerConfig))
        })
      } else {
        // migrate settings
        $scope.user.settings.visualizer.channels = []
        $scope.user.settings.visualizer.mediators = []
        $scope.user.settings.visualizer.time.minDisplayPeriod = 100

        angular.forEach($scope.user.settings.visualizer.endpoints, function (endpoint) {
          $scope.user.settings.visualizer.channels.push({
            eventType: 'channel',
            eventName: endpoint.event.replace('channel-', ''),
            display: endpoint.desc
          })
        })
        delete $scope.user.settings.visualizer.endpoints

        angular.forEach($scope.user.settings.visualizer.components, function (component) {
          const split = component.event.split('-')
          if (split.length > 1) {
            component.eventType = split[0]
            component.eventName = split[1]
          } else {
            component.eventType = 'channel'
            component.eventName = component.event
          }
          component.display = component.desc
          delete component.event
          delete component.desc
        })
      }
    }
  }

  const queryError = function (err) {
    // on error - add server error alert
    Alerting.AlertAddServerMsg(err.status)
  }

  // do the initial request
  Api.Users.get({ email: $scope.consoleSession.sessionUser }, querySuccess, queryError)

  /****************************************************************/
  /**   These are the functions for the Profile initial load     **/
  /****************************************************************/

  /****************************************************************/
  /**   These are the functions for the Profile save process     **/
  /****************************************************************/

  const error = function (err) {
    // add the error message
    Alerting.AlertReset()
    Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving your details: #' + err.status + ' - ' + err.data)
  }

  const success = function (user, password) {
    // update consoleSession with new userSettings
    $scope.consoleSession.sessionUserSettings = user.settings
    localStorage.setItem('consoleSession', JSON.stringify($scope.consoleSession))

    // add the success message
    if (password !== '') {
      // re-login with new credentials
      login.login($scope.consoleSession.sessionUser, password, function (loggedIn) {
        if (loggedIn) {
          Api.Users.get({ email: $scope.consoleSession.sessionUser }, querySuccess, queryError)
        } else {
          error()
        }
      })
    } else {
      Api.Users.get({ email: $scope.consoleSession.sessionUser }, querySuccess, queryError)
    }

    Alerting.AlertReset()
    Alerting.AlertAddMsg('top', 'success', 'Your user details have been updated succesfully.')
  }

  const saveUser = function (user, password) {
    const userObject = angular.copy(user)
    user.$update({}, function () {
      success(userObject, password)

      // rootScope function to scroll to top
      $scope.goToTop()
    })
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

  /****************************************************************/
  /**   These are the functions for the Profile save process     **/
  /****************************************************************/

  /*******************************************/
  /**   Settings - Visualizer Functions     **/
  /*******************************************/

  // setup visualizer object
  $scope.visualizer = {}

  $scope.addSelectedChannel = function () {
    $scope.user.settings.visualizer.channels.push({ eventType: 'channel', eventName: $scope.visualizer.addSelectChannel.name, display: $scope.visualizer.addSelectChannel.name })
    $scope.visualizer.addSelectChannel = null
  }

  $scope.addSelectedMediator = function () {
    $scope.user.settings.visualizer.mediators.push({ mediator: $scope.visualizer.addSelectMediator.urn, name: $scope.visualizer.addSelectMediator.name, display: $scope.visualizer.addSelectMediator.name })
    $scope.visualizer.addSelectMediator = null
  }

  $scope.addComponent = function () {
    if ($scope.visualizer.addComponent.eventType) {
      $scope.user.settings.visualizer.components.push({ eventType: $scope.visualizer.addComponent.eventType, eventName: $scope.visualizer.addComponent.eventName, display: $scope.visualizer.addComponent.display })
      $scope.visualizer.addComponent.eventType = ''
      $scope.visualizer.addComponent.eventName = ''
      $scope.visualizer.addComponent.display = ''
    }
  }

  $scope.removeComponent = function (index) {
    $scope.user.settings.visualizer.components.splice(index, 1)
  }

  $scope.removeChannel = function (index) {
    $scope.user.settings.visualizer.channels.splice(index, 1)
  }

  $scope.removeMediator = function (index) {
    $scope.user.settings.visualizer.mediators.splice(index, 1)
  }

  /*******************************************/
  /**   Settings - Visualizer Functions     **/
  /*******************************************/

  /***************************************************************************/
  /**   These are the general functions for the Profile form validation     **/
  /***************************************************************************/

  $scope.validateFormProfile = function () {
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
    if ($scope.userGroupAdmin && $scope.user.groups.length === 0) {
      $scope.ngError.groups = true
      $scope.ngError.hasErrors = true
    }

    // password validation
    if ($scope.temp.password) {
      if (!$scope.temp.passwordConfirm || $scope.temp.password !== $scope.temp.passwordConfirm) {
        $scope.ngError.passwordConfirm = true
        $scope.ngError.hasErrors = true
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

  $scope.submitFormProfile = function () {
    // validate the form first to check for any errors
    $scope.validateFormProfile()
    // save the user object if no errors are present
    if ($scope.ngError.hasErrors === false) {
      $scope.save($scope.user, $scope.temp.password)
    }
  }

  /**************************************************************************/
  /**   These are the general functions for the Client form validation     **/
  /**************************************************************************/
}
