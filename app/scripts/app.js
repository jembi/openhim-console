'use strict';

angular
  .module('openhimWebui2App', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'angular_taglist_directive'
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
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/logout', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run( function($rootScope, $location, $window, $anchorScroll) {

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

          //create session object
          var consoleSessionObject = { 'sessionID': sessionID, 'sessionUser': sessionUser, 'sessionUserGroups': sessionUserGroups, 'expires': expireTime };

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
        //No session - user needs to log in
        $window.location = '#/login';
      }

    });
    /*------------------------------CHECK USER SESSION---------------------------------*/

  });
