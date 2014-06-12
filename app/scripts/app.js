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
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/channels', {
        templateUrl: 'views/channels.html',
        controller: 'ChannelsCtrl'
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
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/logout', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run( function($rootScope, $location, $window) {

    /*------------------------------CHECK USER SESSION---------------------------------*/
    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function() {

      // Retrieve the session from storage
      var consoleSession = localStorage.getItem("consoleSession");
      consoleSession = JSON.parse(consoleSession);

      //check if session exists
      if( consoleSession ){

        //check if session has expired
        var currentTime = new Date();
        currentTime = currentTime.toISOString();
        if( currentTime >= consoleSession.expires ){
          localStorage.removeItem("consoleSession");

          //session expired - user needs to log in
          $window.location = '#/login';
        }else{

          //session still active - update expires time
          var currentTime = new Date();
          //add 2hours onto timestamp (2hours persistence time)
          var expireTime = new Date(currentTime.getTime() + (2*1000*60*60));
          //get sessionID
          var sessionID = consoleSession.sessionID;

          //create session object
          var consoleSession = { "sessionID": sessionID, "expires": expireTime };

          // Put updated object into storage
          localStorage.setItem('consoleSession', JSON.stringify( consoleSession ));

        }

      }else{
        //No session - user needs to log in
        $window.location = '#/login';
      }

    });
    /*------------------------------CHECK USER SESSION---------------------------------*/

  });
