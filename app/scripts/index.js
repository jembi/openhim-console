import '~/styles/main.css'
import '@babel/polyfill'
import 'angular'
import 'bootstrap'
import 'angular-cookies'
import 'angular-resource'
import 'angular-sanitize'
import 'angular-route'
import 'angular-ui-bootstrap'
import 'angular-highlightjs'
import 'angular-file-upload'
import 'angular-bootstrap-colorpicker'
import '@kariudo/angular-fullscreen'
import ngFileUpload from 'ng-file-upload'

import { moduleName } from './external/angular-bootstrap-datetimepicker-directive'
import { angularTaglist } from './external/angular-taglist-directive'

import * as controllers from './controllers'
import * as directives from './directives'
import * as services from './services'

import * as defaultConfig from '../config/default.json'

export const app = angular
  .module('openhimConsoleApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'hljs',
    ngFileUpload,
    'colorpicker.module',
    moduleName,
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

app.run(function ($templateCache) {
  $templateCache.put('views/partials/audit-filter-settings.html', require('~/views/partials/audit-filter-settings'))
  $templateCache.put('views/partials/audit-operation.html', require('~/views/partials/audit-operation'))
  $templateCache.put('views/partials/channels-tab-basic-info.html', require('~/views/partials/channels-tab-basic-info'))
  $templateCache.put('views/partials/channels-tab-request-matching.html', require('~/views/partials/channels-tab-request-matching'))
  $templateCache.put('views/partials/channels-tab-routes.html', require('~/views/partials/channels-tab-routes'))
  $templateCache.put('views/partials/channels-tab-data-control.html', require('~/views/partials/channels-tab-data-control'))
  $templateCache.put('views/partials/channels-tab-user-access.html', require('~/views/partials/channels-tab-user-access'))
  $templateCache.put('views/partials/channels-tab-alerts.html', require('~/views/partials/channels-tab-alerts'))
  $templateCache.put('views/partials/channels-tab-logs.html', require('~/views/partials/channels-tab-logs'))
  $templateCache.put('views/partials/clients-tab-basic-info.html', require('~/views/partials/clients-tab-basic-info'))
  $templateCache.put('views/partials/clients-tab-authentication.html', require('~/views/partials/clients-tab-authentication.html'))
  $templateCache.put('views/partials/user-settings-tabs.html', require('~/views/partials/user-settings-tabs'))
  $templateCache.put('views/partials/tasks-filter-settings.html', require('~/views/partials/tasks-filter-settings'))
  $templateCache.put('views/partials/transaction-filter-settings.html', require('~/views/partials/transaction-filter-settings'))
  $templateCache.put('views/partials/user-settings-tabs.html', require('~/views/partials/user-settings-tabs'))
  $templateCache.put('views/partials/visualizer-settings.html', require('~/views/partials/visualizer-settings'))
  $templateCache.put('views/sidebar.html', require('~/views/sidebar'))
})

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
    const curRoute = $location.path()

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
        $location.path('/login')
      } else {
        // session still active - update expires time
        currentTime = new Date()
        // add 2hours onto timestamp (2hours persistence time)
        const expireTime = new Date(currentTime.getTime() + (2 * 1000 * 60 * 60))
        // get sessionID
        const sessionID = consoleSession.sessionID
        const sessionUser = consoleSession.sessionUser
        const sessionUserGroups = consoleSession.sessionUserGroups
        const sessionUserSettings = consoleSession.sessionUserSettings

        // create session object
        const consoleSessionObject = {
          sessionID: sessionID,
          sessionUser: sessionUser,
          sessionUserGroups: sessionUserGroups,
          sessionUserSettings: sessionUserSettings,
          expires: expireTime
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
        $location.path('/login')
      }
    }
  })
})

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      template: require('~/views/dashboard'),
      controller: controllers.DashboardCtrl
    })
    .when('/channels', {
      template: require('~/views/channels'),
      controller: controllers.ChannelsCtrl
    })
    .when('/channels/:channelId', {
      template: require('~/views/channelMonitoring'),
      controller: controllers.ChannelMonitoringCtrl
    })
    .when('/clients', {
      template: require('~/views/clients'),
      controller: controllers.ClientsCtrl
    })
    .when('/monitoring', {
      template: require('~/views/monitoring'),
      controller: controllers.MonitoringCtrl
    })
    .when('/users', {
      template: require('~/views/users'),
      controller: controllers.UsersCtrl
    })
    .when('/transactions', {
      template: require('~/views/transactions'),
      controller: controllers.TransactionsCtrl
    })
    .when('/transactions/:transactionId', {
      template: require('~/views/transactionDetails'),
      controller: controllers.TransactionDetailsCtrl
    })
    .when('/tasks', {
      template: require('~/views/tasks'),
      controller: controllers.TasksCtrl
    })
    .when('/tasks/:taskId', {
      template: require('~/views/taskDetails'),
      controller: controllers.TaskDetailsCtrl
    })
    .when('/groups', {
      template: require('~/views/contactGroups'),
      controller: controllers.ContactGroupsCtrl
    })
    .when('/login', {
      template: require('~/views/login'),
      controller: controllers.LoginCtrl
    })
    .when('/profile', {
      template: require('~/views/profile'),
      controller: controllers.ProfileCtrl
    })
    .when('/mediators', {
      template: require('~/views/mediators'),
      controller: controllers.MediatorsCtrl
    })
    .when('/mediators/:urn', {
      template: require('~/views/mediatorDetails'),
      controller: controllers.MediatorDetailsCtrl
    })
    .when('/logout', {
      template: require('~/views/login'),
      controller: controllers.LoginCtrl
    })
    .when('/visualizer', {
      template: require('~/views/visualizer'),
      controller: controllers.VisualizerCtrl
    })
    .when('/forgot-password', {
      template: require('~/views/forgotPassword'),
      controller: controllers.ForgotPasswordCtrl
    })
    .when('/set-password/:token', {
      template: require('~/views/setPassword'),
      controller: controllers.SetPasswordCtrl
    })
    .when('/certificates', {
      template: require('~/views/certificates'),
      controller: controllers.CertificatesCtrl
    })
    .when('/export-import', {
      template: require('~/views/exportImport'),
      controller: controllers.ExportImportCtrl
    })
    .when('/audits', {
      template: require('~/views/audits'),
      controller: controllers.AuditsCtrl
    })
    .when('/audits/:auditId', {
      template: require('~/views/auditDetails'),
      controller: controllers.AuditDetailsCtrl
    })
    .when('/logs', {
      template: require('~/views/logs'),
      controller: controllers.LogsCtrl
    })
    .when('/about', {
      template: require('~/views/about'),
      controller: controllers.AboutCtrl
    })
    .otherwise({
      redirectTo: '/'
    })
})

function main () {
  const initInjector = angular.injector(['ng'])
  const $http = initInjector.get('$http')
  return $http.get('config/default.json')
    .then((response) => {
      app.constant('config', response.data)
    }, () => {
      app.constant('config', defaultConfig)
      console.warn('No config found at "config/default.json" using default')
    })
    .finally(() => {
      angular.element(document).ready(function () {
        angular.bootstrap(document, ['openhimConsoleApp'])
      })
    })
}

if (module.parent == null) {
  main()
}
