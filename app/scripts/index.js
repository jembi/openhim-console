import 'babel-polyfill'
import 'bootstrap'
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
import ngFileUpload from 'ng-file-upload'

import { moduleName } from './external/angular-bootstrap-datetimepicker-directive'
import { angularTaglist } from './external/angular-taglist-directive'

import * as controllers from './controllers'
import * as directives from './directives'
import * as services from './services'
import * as views from '../views'
import { objectVisitor, camelcaseToHtmlAttr } from './utils'

import * as defaultConfig from '../config/default.json'

import 'bootstrap/dist/css/bootstrap.css'
import '~/styles/main.css'
import '~/styles/morris.css'
import 'highlight.js/styles/default.css'
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
  for (const viewVisit of objectVisitor(views)) {
    const viewPath = viewVisit.path.map(camelcaseToHtmlAttr).join('/')
    $templateCache.put(`views/${viewPath}.html`, viewVisit.value)
  }
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
    let curRoute = $location.path()

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
        $location.path('/login')
      }
    }
  })
})

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      template: views.dashboard,
      controller: controllers.DashboardCtrl
    })
    .when('/channels', {
      template: views.channels,
      controller: controllers.ChannelsCtrl
    })
    .when('/channels/:channelId', {
      template: views.channelMonitoring,
      controller: controllers.ChannelMonitoringCtrl
    })
    .when('/clients', {
      template: views.clients,
      controller: controllers.ClientsCtrl
    })
    .when('/monitoring', {
      template: views.monitoring,
      controller: controllers.MonitoringCtrl
    })
    .when('/users', {
      template: views.users,
      controller: controllers.UsersCtrl
    })
    .when('/config', {
      template: views.config,
      controller: controllers.ConfigCtrl
    })
    .when('/transactions', {
      template: views.transactions,
      controller: controllers.TransactionsCtrl
    })
    .when('/transactions/:transactionId', {
      template: views.transactionDetails,
      controller: controllers.TransactionDetailsCtrl
    })
    .when('/tasks', {
      template: views.tasks,
      controller: controllers.TasksCtrl
    })
    .when('/tasks/:taskId', {
      template: views.taskDetails,
      controller: controllers.TaskDetailsCtrl
    })
    .when('/groups', {
      template: views.contactGroups,
      controller: controllers.ContactGroupsCtrl
    })
    .when('/login', {
      template: views.login,
      controller: controllers.LoginCtrl
    })
    .when('/profile', {
      template: views.profile,
      controller: controllers.ProfileCtrl
    })
    .when('/mediators', {
      template: views.mediators,
      controller: controllers.MediatorsCtrl
    })
    .when('/mediators/:urn', {
      template: views.mediatorDetails,
      controller: controllers.MediatorDetailsCtrl
    })
    .when('/logout', {
      template: views.login,
      controller: controllers.LoginCtrl
    })
    .when('/visualizer', {
      template: views.visualizer,
      controller: controllers.VisualizerCtrl
    })
    .when('/forgot-password', {
      template: views.forgotPassword,
      controller: controllers.ForgotPasswordCtrl
    })
    .when('/set-password/:token', {
      template: views.setPassword,
      controller: controllers.SetPasswordCtrl
    })
    .when('/certificates', {
      template: views.certificates,
      controller: controllers.CertificatesCtrl
    })
    .when('/export-import', {
      template: views.exportImport,
      controller: controllers.ExportImportCtrl
    })
    .when('/audits', {
      template: views.audits,
      controller: controllers.AuditsCtrl
    })
    .when('/audits/:auditId', {
      template: views.auditDetails,
      controller: controllers.AuditDetailsCtrl
    })
    .when('/logs', {
      template: views.logs,
      controller: controllers.LogsCtrl
    })
    .when('/about', {
      template: views.about,
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
