'use strict';

// Common directive for Focus

angular.module('openhimWebui2App').directive('focus', function($timeout) {
    return {
      scope : {
        trigger : '@focus'
      },
      link : function(scope, element) {
        scope.$watch('trigger', function(value) {

          console.log( value )

          if (value === "true") {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
      }
    };
  }); 