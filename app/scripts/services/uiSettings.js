'use strict';

angular.module('openhimConsoleApp')
  .factory('uiSettings', function () {

    var uiSettings = {};
    var uiSettingsManager = {};

    uiSettingsManager.update = function( property, value ) {
      console.log( property )
      console.log( value )
      uiSettings[property] = value;
    };

    return uiSettingsManager;

  });