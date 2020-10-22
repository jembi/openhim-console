import * as defaultConfig from '../config/default.json'

const app = angular.module('openhimConsoleApp');

// function to boostrap the app manually - used to first get config data before angular initializes
(function () {
  function fetchData () {
    const initInjector = angular.injector(['ng'])
    const $http = initInjector.get('$http')

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

  /* ------------------------------CHECK USER SESSION--------------------------------- */
})
