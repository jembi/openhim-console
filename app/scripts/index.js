import 'babel-polyfill'
import 'angular'
import 'angular-cookies'
import 'angular-resource'
import 'angular-sanitize'
import 'angular-route'
import 'angular-ui-bootstrap'
import 'angular-highlightjs'
import 'angular-file-upload'
import 'angular-bootstrap-colorpicker'
import '@kariudo/angular-fullscreen'

import { datetimepicker } from './external/angular-bootstrap-datetimepicker-directive'
import { angularTaglist } from './external/angular-taglist-directive'

import * as controllers from './controllers'
import * as directives from './directives'
import * as services from './services'

import * as defaultConfig from '../config/default.json'

import 'bootstrap/dist/css/bootstrap.css'
import 'morris.js/morris.css'
import 'highlight.js/styles/default.css'
import '../styles/main.css'
import 'highlight.js/styles/github.css'
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'
import 'angular-bootstrap-colorpicker/css/colorpicker.css'

export const app = angular
  .module('openhimConsoleApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'hljs',
    'angularFileUpload',
    'colorpicker.module',
    datetimepicker,
    angularTaglist,
    'FBAngular'
  ])

for (const controller in controllers) {
  app.controller(controller, controllers[controller])
}

for (const directive in directives) {
  app.directive(directive, directives[directive])
}

for (const service in services) {
  app.factory(service, services[service])
}

app.run(function ($rootScope) {
  // register listener to watch route changes
  $rootScope.$on('$routeChangeStart', function () {
    // reset the alert object for each route changed
    $rootScope.alerts = {}
  })
})

app.config(function ($httpProvider, $compileProvider) {
  $httpProvider.interceptors.push('Authinterceptor')
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):/)
})

app.run(function ($rootScope, $location, $anchorScroll, Alerting, config) {
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
})

app.run(function ($rootScope, $location, $anchorScroll, $window) {
  $rootScope.$on('$routeChangeStart', function () {
    /* ----- Set Referring URL ----- */

    let paramsString = ''
    let curRoute

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
    let consoleSession = localStorage.getItem('consoleSession')
    consoleSession = JSON.parse(consoleSession)

    // check if session exists
    if (consoleSession) {
      // set the nav menu to show
      $rootScope.navMenuVisible = true

      // check if session has expired
      let currentTime = new Date()
      currentTime = currentTime.toISOString()
      if (currentTime >= consoleSession.expires) {
        localStorage.removeItem('consoleSession')

        // session expired - user needs to log in
        $window.location = '#/login'
      } else {
        // session still active - update expires time
        currentTime = new Date()
        // add 2hours onto timestamp (2hours persistence time)
        let expireTime = new Date(currentTime.getTime() + (2 * 1000 * 60 * 60))
        // get sessionID
        let sessionID = consoleSession.sessionID
        let sessionUser = consoleSession.sessionUser
        let sessionUserGroups = consoleSession.sessionUserGroups
        let sessionUserSettings = consoleSession.sessionUserSettings

        // create session object
        let consoleSessionObject = {
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
})

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

function main () {
  const initInjector = angular.injector(['ng'])
  const $http = initInjector.get('$http')
  return $http.get('config/default.json')
    .then(res => res.data, () => defaultConfig)
    .then(data => {
      app.constant('config', data)
      angular.element(document).ready(function () {
        angular.bootstrap(document, ['openhimConsoleApp'])
      })
    })
}

if (module.parent == null) {
  main()
}
