import { getHashAndSalt } from '../utils'

export function LoginCtrl ($scope, login, $window, $location, $timeout, $rootScope, Alerting, Api, config) {
  $scope.config = config
  $scope.emailFocus = true
  $scope.passwordFocus = false
  $scope.rootPasswordReset = false
  $scope.resetSuccess = false

  // if url "#/logout" is returned then destroy the session
  if (/\/logout$/i.test($window.location.hash)) {
    localStorage.removeItem('consoleSession')
    $rootScope.sessionUser = null
    $rootScope.navMenuVisible = false
  }

  $scope.loginEmail = ''
  $scope.loginPassword = ''
  $scope.linkUserEmail = ''

  $scope.$watch('loginEmail', function (newVal, oldVal) {
    if (newVal || newVal !== oldVal) {
      $scope.linkUserEmail = '?email=' + newVal
    }
  })

  if ($location.search().email) {
    $scope.loginEmail = $location.search().email
    $scope.emailFocus = false
    $scope.passwordFocus = true
  }

  $scope.validateLogin = function () {
    // reset alert object
    Alerting.AlertReset()
    const loginEmail = $scope.loginEmail
    const loginPassword = $scope.loginPassword

    if (!loginEmail || !loginPassword) {
      Alerting.AlertAddMsg('login', 'danger', 'Please provide your login credentials')
    } else {
      // reset alert to show processing message
      Alerting.AlertReset()
      Alerting.AlertAddMsg('login', 'warning', 'Busy checking your credentials...')
      $scope.coreConnectionError = false

      // check login credentials and create session if valid
      $scope.checkLoginCredentials(loginEmail, loginPassword)
    }
  }

  $scope.checkLoginCredentials = function (loginEmail, loginPassword) {
    login.login(loginEmail, loginPassword, function (result) {
      // reset alert object
      Alerting.AlertReset()
      if (result === 'Authentication Success') {
        // check if root and default root password
        if (loginEmail === 'root@openhim.org' && loginPassword === 'openhim-password') {
          // reset root password
          $scope.rootPasswordReset = true
        } else {
          // Create the session for the logged in user
          $scope.createUserSession(loginEmail)

          // redirect user to referringURL
          if ($rootScope.referringURL) {
            $window.location = '#!' + $rootScope.referringURL
          } else { // default redirect to transactions page
            $window.location = '#!/transactions'
          }
        }
      } else {
        if (result === 'Internal Server Error') {
          $scope.coreConnectionError = true
        } else {
          Alerting.AlertAddMsg('login', 'danger', 'The supplied credentials were incorrect. Please try again')
        }
      }
    })
  }

  $scope.resetRootPassword = function () {
    Alerting.AlertReset()

    // validate not empty fields
    if (!$scope.password || !$scope.passwordConfirm) {
      Alerting.AlertAddMsg('login', 'danger', 'Please provide both password fields')
      return
    } else {
      // validate passwords match
      if ($scope.password !== $scope.passwordConfirm) {
        Alerting.AlertAddMsg('login', 'danger', 'The supplied passwords do not match')
        return
      }

      // check password isnt same as the current one
      if ($scope.password === 'openhim-password') {
        Alerting.AlertAddMsg('login', 'danger', 'The supplied password is the same as the current one')
        return
      }
    }

    const password = angular.copy($scope.password)

    // do the initial request
    Api.Users.get({ email: 'root@openhim.org' }, function (user) {
      const h = getHashAndSalt(password)
      user.passwordAlgorithm = h.algorithm

      if (typeof h.salt !== 'undefined' && h.salt !== null) {
        user.passwordSalt = h.salt
      }
      user.passwordHash = h.hash

      // save the new root password
      user.$update({}, function () {
        // re-login with new credentials
        login.login('root@openhim.org', password, function (loggedIn) {
          if (loggedIn) {
            // Create the session for the logged in user
            $scope.createUserSession('root@openhim.org')

            $scope.password = ''
            $scope.passwordConfirm = ''

            $scope.resetSuccess = true

            Alerting.AlertAddMsg('login', 'success', 'Root Password Successfully Reset.')
            Alerting.AlertAddMsg('login', 'success', 'You will be redirected to the \'Transactions\' page shortly.')
            $timeout(function () {
              // redirect user to landing page (transactions)
              $window.location = '#/transactions'
            }, 5000)
          } else {
            // add the error message
            Alerting.AlertAddServerMsg()
          }
        })
      }, function () {
        Alerting.AlertAddServerMsg()
      })
    }, function () {
      Alerting.AlertAddServerMsg()
    })
  }

  $scope.createUserSession = function (loginEmail) {
    // check if email supplied
    if (!loginEmail) {
      return 'No Email supplied!'
    } else {
      /* ------------------Set sessionID and expire timestamp------------------ */

      // get the logged in user details
      const userProfile = login.getLoggedInUser()
      // check if userProfile exists
      if (!userProfile.groups) {
        return 'Logged in user could not be found!'
      } else {
        const currentTime = new Date()
        // add 2hours onto timestamp (2hours persistence time)
        const expireTime = new Date(currentTime.getTime() + (2 * 1000 * 60 * 60))
        // generate random sessionID
        const sessionID = Math.random().toString(36).slice(2).toUpperCase()

        const sessionUserGroups = userProfile.groups
        const sessionUserSettings = userProfile.settings

        // create session object
        const consoleSessionObject = {
          sessionID: sessionID,
          sessionUser: loginEmail,
          sessionUserGroups: sessionUserGroups,
          sessionUserSettings: sessionUserSettings,
          expires: expireTime
        }

        // Put the object into storage
        localStorage.setItem('consoleSession', JSON.stringify(consoleSessionObject))
      }

      /* ------------------Set sessionID and expire timestamp------------------ */
    }
  }
}
