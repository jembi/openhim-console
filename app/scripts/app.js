'use strict';

angular
  .module('openhimWebui2App', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'angular_taglist_directive',
    'xeditable',
    'hljs'
  ])
  .config(function ($routeProvider) {
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
      .otherwise({
        redirectTo: '/'
      });
  })
  .run( function($rootScope, $http, $location, $window, $anchorScroll, Alerting) {


    /*--------------------------LOAD APP CONFIG VARIABLES--------------------------*/
    // load default config settings
    $http.get('config/default.json').success(function( config ) {

      // setup server config
      $rootScope.protocol = config.protocol;
      $rootScope.host = config.host;
      $rootScope.port = config.port;

      // setup title and links config
      $rootScope.appTitle = config.title;
      $rootScope.appFooterTitle = config.footerTitle;
      $rootScope.appFooterPoweredBy = config.footerPoweredBy;
      $rootScope.loginBanner = config.loginBanner;

    });

    // invoke Alerting factory to create all alert messages
    Alerting.AlertValidationMsgs();
    /*--------------------------LOAD APP CONFIG VARIABLES--------------------------*/


    $rootScope.goToTop = function() {
      $anchorScroll();
    };


    /*------------------------------CHECK USER SESSION---------------------------------*/
    // register listener to watch route changes
    $rootScope.$on( '$routeChangeStart', function() {

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
