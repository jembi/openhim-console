'use strict';

angular.module('openhimWebui2App')
	.controller('AppConfigCtrl', function ($rootScope) {

		$rootScope.CONFIG = {};

		/*--------------------------------------------*/
		/*--------- CONFIG FOR APP VARIABLES ----------/
		/*--------------------------------------------*/

		$rootScope.CONFIG.APP = {};
	  $rootScope.CONFIG.APP.TITLE = 'OpenHIM Admin Console';
	  $rootScope.CONFIG.APP.FOOTERTITLE = 'OpenHIM Administration Console';

	  /*--------------------------------------------*/
		/*--------- CONFIG FOR APP VARIABLES ----------/
		/*--------------------------------------------*/



		/*---------------------------------------------------*/
		/*--------- CONFIG FOR API SERVER VARIABLES ----------/
		/*---------------------------------------------------*/

	  $rootScope.CONFIG.API = {};
	  $rootScope.CONFIG.API.HOST = 'openhim-preprod.jembi.org';
	  $rootScope.CONFIG.API.PORT = 8080;

	  /*---------------------------------------------------*/
		/*--------- CONFIG FOR API SERVER VARIABLES ----------/
		/*---------------------------------------------------*/

	});