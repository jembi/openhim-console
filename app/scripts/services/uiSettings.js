'use strict';

angular.module('openhimConsoleApp')
  .factory('uiSettings', function ($rootScope) {

    var uiSettingsManager = {};

    // get user session settings
    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);

    // set default ui settings
    $rootScope.uiSettings = {};
    $rootScope.uiSettings.showTooltips = true;


    if ( consoleSession && consoleSession.sessionUserSettings.general ){
      if ( consoleSession.sessionUserSettings.general.showTooltips ){
        $rootScope.uiSettings.showTooltips = consoleSession.sessionUserSettings.general.showTooltips;
      }
    }    

    uiSettingsManager.update = function( property, value ) {
      $rootScope.uiSettings[property] = value;
    };

    return uiSettingsManager;

  });