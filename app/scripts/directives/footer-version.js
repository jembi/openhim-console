'use strict';

/* global isCoreVersionCompatible:false */

// Common directive for Footer Version
angular.module('openhimConsoleApp')
  .directive('footerVersion', function(Api, config) {
    return {
      template:'<span ng-class="footerVersionsCompatible ? \'\' : \'version-incompatible\'" ng-if="footerConsoleVersion && footerCoreVersion">' +
                  '(Console v{{ footerConsoleVersion }}, Core v{{ footerCoreVersion }})' +
                '</span>',
      scope: false,
      link: function(scope) {
        
        var success = function(result) {
          scope.footerCoreVersion = result.currentCoreVersion;
          scope.footerConsoleVersion = config.version;
          scope.footerVersionsCompatible = isCoreVersionCompatible(config.minimumCoreVersion, scope.footerCoreVersion);
        };
        
        scope.$root.$watch('sessionUser', function(newVal) {
          if(newVal) {
            Api.About.query(success);
          } else {
            scope.footerCoreVersion = null;
            scope.footerConsoleVersion = null;
          }
        });
      }
    };
  });