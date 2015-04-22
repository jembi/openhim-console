'use strict';

angular.module('openhimConsoleApp')
  .factory('uiSettings', function ($rootScope) {

    var uiSettingsManager = {};

    // get user session settings
    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);

    var generalSettings = {};
    if ( consoleSession && consoleSession.sessionUserSettings.general ){
      generalSettings.showTooltips = consoleSession.sessionUserSettings.general.showTooltips;
    }else{
      generalSettings.showTooltips = true;
    }

    // set default ui settings
    $rootScope.uiSettings = {};
    $rootScope.uiSettings.showTooltips = generalSettings.showTooltips;

    uiSettingsManager.update = function( property, value ) {
      $rootScope.uiSettings[property] = value;
    };

    return uiSettingsManager;

  });