'use strict';

var app = angular
  .module('openhimConsoleApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'angular_taglist_directive',
    'hljs',
    'angularFileUpload',
    'datetimepicker'
  ]);

// function to boostrap the app manually - used to first get config data before angular initializes
(function() {

  function fetchData() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    return $http.get('config/default.json').then(function(response) {
      app.constant('config', response.data);
    }, function() {
      // Handle error case
      app.constant('config', 'No Config Loaded');
    });
  }

  function bootstrapApplication() {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['openhimConsoleApp']);
    });
  }

  // request config data and bootstrap on success
  fetchData().then(bootstrapApplication);

}());


app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):/);
}]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl'
    })
    .when('/channels', {
      templateUrl: 'views/channels.html',
      controller: 'ChannelsCtrl'
    })
    .when('/channels/:channelId', {
      templateUrl: 'views/channelMonitoring.html',
      controller: 'ChannelMonitoringCtrl'
    })
    .when('/clients', {
      templateUrl: 'views/clients.html',
      controller: 'ClientsCtrl'
    })
    .when('/monitoring', {
      templateUrl: 'views/monitoring.html',
      controller: 'MonitoringCtrl'
    })
    .when('/users', {
      templateUrl: 'views/users.html',
      controller: 'UsersCtrl'
    })
    .when('/config', {
      templateUrl: 'views/config.html',
      controller: 'ConfigCtrl'
    })
    .when('/transactions', {
      templateUrl: 'views/transactions.html',
      controller: 'TransactionsCtrl'
    })
    .when('/transactions/:transactionId', {
      templateUrl: 'views/transactionDetails.html',
      controller: 'TransactionDetailsCtrl'
    })
    .when('/tasks', {
      templateUrl: 'views/tasks.html',
      controller: 'TasksCtrl'
    })
    .when('/tasks/:taskId', {
      templateUrl: 'views/taskDetails.html',
      controller: 'TaskDetailsCtrl'
    })
    .when('/groups', {
      templateUrl: 'views/contactGroups.html',
      controller: 'ContactGroupsCtrl'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileCtrl'
    })
    .when('/mediators', {
      templateUrl: 'views/mediators.html',
      controller: 'MediatorsCtrl'
    })
    .when('/mediators/:urn', {
      templateUrl: 'views/mediatorDetails.html',
      controller: 'MediatorDetailsCtrl'
    })
    .when('/logout', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/visualizer', {
      templateUrl: 'views/visualizer.html',
      controller: 'VisualizerCtrl'
    })
    .when('/set-password/:token', {
      templateUrl: 'views/setPassword.html',
      controller: 'SetPasswordCtrl'
    })
    .when('/certificates', {
      templateUrl: 'views/certificates.html',
      controller: 'CertificatesCtrl'
    })
    .when('/export-import', {
      templateUrl: 'views/exportImport.html',
      controller: 'ExportImportCtrl'
    })
    .when('/audits', {
      templateUrl: 'views/audits.html',
      controller: 'AuditsCtrl'
    })
    .when('/audits/:auditId', {
      templateUrl: 'views/auditDetails.html',
      controller: 'AuditDetailsCtrl'
    })
    .when('/logs', {
      templateUrl: 'views/logs.html',
      controller: 'LogsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.run( function($rootScope, $http, $location, $window, $anchorScroll, Alerting, config) {

  // set uiSettings function to update the 'showTooltips' variable
  $rootScope.uiSettings = {};
  $rootScope.uiSettings.showTooltips = true;

  $rootScope.appTitle = config.title;
  $rootScope.appFooterTitle = config.footerTitle;
  $rootScope.appFooterPoweredBy = config.footerPoweredBy;
  $rootScope.loginBanner = config.loginBanner;

  // invoke Alerting factory to create all alert messages
  Alerting.AlertValidationMsgs();


  $rootScope.goToTop = function() {
    $anchorScroll();
  };


  /*------------------------------CHECK USER SESSION---------------------------------*/
  // register listener to watch route changes
  $rootScope.$on( '$routeChangeStart', function() {

    /* ----- Set Referring URL ----- */

    var paramsString = '';
    var curRoute;

    // set previous route value
    curRoute = $location.path();

    // check if parameters exist
    if ( Object.keys( $location.search() ).length > 0 ){
      angular.forEach($location.search(), function(value, key) {
        paramsString += '&'+key+'='+value;
      });

      // remove first &amp from string
      paramsString = paramsString.substring(1);

      // add start of query params ( ? )
      paramsString = '?' + paramsString;
    }

    // success redirect happens on login.js controller - ignore current login route
    if ( curRoute !== '/login' && curRoute !== '/logout' ){
      $rootScope.referringURL = curRoute + paramsString;
    }

    /* ----- Set Referring URL ----- */


    // scroll page to top - start fresh
    $anchorScroll();

    //set nav menu view to false
    $rootScope.navMenuVisible = false;

    // Retrieve the session from storage
    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);

    //check if session exists
    if( consoleSession ){

      //set the nav menu to show
      $rootScope.navMenuVisible = true;

      //check if session has expired
      var currentTime = new Date();
      currentTime = currentTime.toISOString();
      if( currentTime >= consoleSession.expires ){
        localStorage.removeItem('consoleSession');

        //session expired - user needs to log in
        $window.location = '#/login';
      }else{

        //session still active - update expires time
        currentTime = new Date();
        //add 2hours onto timestamp (2hours persistence time)
        var expireTime = new Date(currentTime.getTime() + (2*1000*60*60));
        //get sessionID
        var sessionID = consoleSession.sessionID;
        var sessionUser = consoleSession.sessionUser;
        var sessionUserGroups = consoleSession.sessionUserGroups;
        var sessionUserSettings = consoleSession.sessionUserSettings;

        //create session object
        var consoleSessionObject = { 'sessionID': sessionID,
                                      'sessionUser': sessionUser,
                                      'sessionUserGroups': sessionUserGroups,
                                      'sessionUserSettings': sessionUserSettings,
                                      'expires': expireTime };

        // Put updated object into storage
        localStorage.setItem('consoleSession', JSON.stringify( consoleSessionObject ));
        $rootScope.sessionUser = sessionUser;
        $rootScope.passwordHash = $rootScope.passwordHash || false;

        if ( sessionUserSettings && sessionUserSettings.general ){
          $rootScope.uiSettings.showTooltips = sessionUserSettings.general.showTooltips;
        }

        // Check logged in users' group permission and set userGroupAdmin to true if user is a admin
        if (sessionUserGroups.indexOf('admin') >= 0) {
          $rootScope.userGroupAdmin = true;
        } else {
          $rootScope.userGroupAdmin = false;
        }

      }

    }else{

      //if not 'set-password' page
      if ( $location.path().indexOf('set-password') !== 1 ){
        //No session - user needs to log in
        $window.location = '#/login';
      }

    }

  });
  /*------------------------------CHECK USER SESSION---------------------------------*/

});
