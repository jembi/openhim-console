'use strict';
// Visualizer Directive

angular.module('openhimConsoleApp')
  .directive('metricsDateTypeSelector', function () {
    return {
      restrict:'EA',
      templateUrl:'views/partials/metrics-date-type-selector.html',
      scope: {
        selected: '=',
        onChange: '='
      },
      link: function(scope){
        if (!scope.onChange) {
          scope.onChange = function(){};
        }
      }
    };
  });
