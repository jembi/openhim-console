'use strict'
import * as defaultConfig from '../config/default.json'

var app = angular.module('openhimConsoleApp');

// function to boostrap the app manually - used to first get config data before angular initializes
(function () {
  function fetchData () {
    var initInjector = angular.injector(['ng'])
    var $http = initInjector.get('$http')

    return $http.get('config/default.json').then(function (response) {
      app.constant('config', response.data)
    }, function () {
			// Handle error case
      app.constant('config', defaultConfig)
    })
  }

  function bootstrapApplication () {
    angular.element(document).ready(function () {
      angular.bootstrap(document, ['openhimConsoleApp'])
    })
  }

	// request config data and bootstrap on success
  fetchData().then(bootstrapApplication)
}())

app.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):/)
}])

app.config(function ($routeProvider) {
  $routeProvider
		.when('/', {
  template: require('../views/dashboard.html'),
  controller: 'DashboardCtrl'
})
		.when('/channels', {
  template: require('../views/channels.html'),
  controller: 'ChannelsCtrl'
})
		.when('/channels/:channelId', {
  template: require('../views/channelMonitoring.html'),
  controller: 'ChannelMonitoringCtrl'
})
		.when('/clients', {
  template: require('../views/clients.html'),
  controller: 'ClientsCtrl'
})
		.when('/monitoring', {
  template: require('../views/monitoring.html'),
  controller: 'MonitoringCtrl'
})
		.when('/users', {
  template: require('../views/users.html'),
  controller: 'UsersCtrl'
})
		.when('/config', {
  template: require('../views/config.html'),
  controller: 'ConfigCtrl'
})
		.when('/transactions', {
  template: require('../views/transactions.html'),
  controller: 'TransactionsCtrl'
})
		.when('/transactions/:transactionId', {
  template: require('../views/transactionDetails.html'),
  controller: 'TransactionDetailsCtrl'
})
		.when('/tasks', {
  template: require('../views/tasks.html'),
  controller: 'TasksCtrl'
})
		.when('/tasks/:taskId', {
  template: require('../views/taskDetails.html'),
  controller: 'TaskDetailsCtrl'
})
		.when('/groups', {
  template: require('../views/contactGroups.html'),
  controller: 'ContactGroupsCtrl'
})
		.when('/login', {
  template: require('../views/login.html'),
  controller: 'LoginCtrl'
})
		.when('/profile', {
  template: require('../views/profile.html'),
  controller: 'ProfileCtrl'
})
		.when('/mediators', {
  template: require('../views/mediators.html'),
  controller: 'MediatorsCtrl'
})
		.when('/mediators/:urn', {
  template: require('../views/mediatorDetails.html'),
  controller: 'MediatorDetailsCtrl'
})
		.when('/logout', {
  template: require('../views/login.html'),
  controller: 'LoginCtrl'
})
		.when('/visualizer', {
  template: require('../views/visualizer.html'),
  controller: 'VisualizerCtrl'
})
		.when('/forgot-password', {
  template: require('../views/forgotPassword.html'),
  controller: 'ForgotPasswordCtrl'
})
		.when('/set-password/:token', {
  template: require('../views/setPassword.html'),
  controller: 'SetPasswordCtrl'
})
		.when('/certificates', {
  template: require('../views/certificates.html'),
  controller: 'CertificatesCtrl'
})
		.when('/export-import', {
  template: require('../views/exportImport.html'),
  controller: 'ExportImportCtrl'
})
		.when('/audits', {
  template: require('../views/audits.html'),
  controller: 'AuditsCtrl'
})
		.when('/audits/:auditId', {
  template: require('../views/auditDetails.html'),
  controller: 'AuditDetailsCtrl'
})
		.when('/logs', {
  template: require('../views/logs.html'),
  controller: 'LogsCtrl'
})
		.when('/about', {
  template: require('../views/about.html'),
  controller: 'AboutCtrl'
})
		.otherwise({
  redirectTo: '/'
})
})

app.run(function ($rootScope, $http, $location, $window, $anchorScroll, Alerting, config) {
	// set uiSettings function to update the 'showTooltips' variable
  $rootScope.uiSettings = {}
  $rootScope.uiSettings.showTooltips = true

  $rootScope.appTitle = config.title
  $rootScope.appFooterTitle = config.footerTitle
  $rootScope.appFooterPoweredBy = config.footerPoweredBy
  $rootScope.footerConsoleVersion = null
  $rootScope.footerCoreVersion = null
  $rootScope.loginBanner = config.loginBanner

	// invoke Alerting factory to create all alert messages
  Alerting.AlertValidationMsgs()

  $rootScope.goToTop = function () {
    $anchorScroll()
  }

	/* ------------------------------CHECK USER SESSION--------------------------------- */
	// register listener to watch route changes
  $rootScope.$on('$routeChangeStart', function () {
		/* ----- Set Referring URL ----- */

    var paramsString = ''
    var curRoute

		// set previous route value
    curRoute = $location.path()

		// check if parameters exist
    if (Object.keys($location.search()).length > 0) {
      angular.forEach($location.search(), function (value, key) {
        paramsString += '&' + key + '=' + value
      })

			// remove first &amp from string
      paramsString = paramsString.substring(1)

			// add start of query params ( ? )
      paramsString = '?' + paramsString
    }

		// success redirect happens on login.js controller - ignore these routes
    if (curRoute !== '/' && curRoute.indexOf('/login') === -1 && curRoute !== '/logout' && curRoute.indexOf('/forgot-password') === -1 && curRoute.indexOf('/set-password') === -1) {
      $rootScope.referringURL = curRoute + paramsString
    }

		/* ----- Set Referring URL ----- */

		// scroll page to top - start fresh
    $anchorScroll()

		// set nav menu view to false
    $rootScope.navMenuVisible = false

		// Retrieve the session from storage
    var consoleSession = localStorage.getItem('consoleSession')
    consoleSession = JSON.parse(consoleSession)

		// check if session exists
    if (consoleSession) {
			// set the nav menu to show
      $rootScope.navMenuVisible = true

			// check if session has expired
      var currentTime = new Date()
      currentTime = currentTime.toISOString()
      if (currentTime >= consoleSession.expires) {
        localStorage.removeItem('consoleSession')

				// session expired - user needs to log in
        $window.location = '#/login'
      } else {
				// session still active - update expires time
        currentTime = new Date()
				// add 2hours onto timestamp (2hours persistence time)
        var expireTime = new Date(currentTime.getTime() + (2 * 1000 * 60 * 60))
				// get sessionID
        var sessionID = consoleSession.sessionID
        var sessionUser = consoleSession.sessionUser
        var sessionUserGroups = consoleSession.sessionUserGroups
        var sessionUserSettings = consoleSession.sessionUserSettings

				// create session object
        var consoleSessionObject = {
          'sessionID': sessionID,
          'sessionUser': sessionUser,
          'sessionUserGroups': sessionUserGroups,
          'sessionUserSettings': sessionUserSettings,
          'expires': expireTime
        }

				// Put updated object into storage
        localStorage.setItem('consoleSession', JSON.stringify(consoleSessionObject))
        $rootScope.sessionUser = sessionUser
        $rootScope.passwordHash = $rootScope.passwordHash || false

        if (sessionUserSettings && sessionUserSettings.general) {
          $rootScope.uiSettings.showTooltips = sessionUserSettings.general.showTooltips
        }

				// Check logged in users' group permission and set userGroupAdmin to true if user is a admin
        if (sessionUserGroups.indexOf('admin') >= 0) {
          $rootScope.userGroupAdmin = true
        } else {
          $rootScope.userGroupAdmin = false
        }
      }
    } else {
      const page = $location.path() === '/' ? $location.hash() : $location.path()
			// if not 'set-password' page
      if (page.indexOf('set-password') !== 1 && page.indexOf('forgot-password') !== 1 && page.indexOf('login') !== 1) {
				// No session - user needs to log in
        $window.location = '#/login'
      }
    }
  })
	/* ------------------------------CHECK USER SESSION--------------------------------- */
})
