'use strict';

var app = angular.module('openhimWebui2App');

/********************************************************************************************/
/*	Setup of App Constants - (Global Variables)												*/
/********************************************************************************************/
app.constant('TITLE', 'OpenHIM Admin Console');
app.constant('FOOTERTITLE', 'OpenHIM Administration Console');
app.constant('FOOTERPOWEREDBY', '<a href="http://openhim.org/" target="_blank">Powered by OpenHIM</a>');

app.constant('HOST', 'openhim-preprod.jembi.org');
app.constant('PORT', 8080);



/********************************************************************************************/
/*	This is the AppConfig controllers														*/
/*	This controller encapsulates all other controllers										*/
/*	Default applications settings are initialzed here - Assign global variable to scope		*/
/********************************************************************************************/
app.controller('AppConfigCtrl', function($scope, Alerting, TITLE, FOOTERTITLE, FOOTERPOWEREDBY) {
  $scope.appTitle = TITLE;
  $scope.appFooterTitle = FOOTERTITLE;
  $scope.appFooterPoweredBy = FOOTERPOWEREDBY;

  // invoke Alerting factory to create all alert messages
  Alerting.AlertValidationMsgs();

});
