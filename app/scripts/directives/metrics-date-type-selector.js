'use strict';
/* global moment:false */

angular.module('openhimConsoleApp')
  .directive('metricsDateTypeSelector', function () {
    return {
      restrict:'EA',
      templateUrl:'views/partials/metrics-date-type-selector.html',
      scope: {
        selected: '=',
        onChange: '=?'
      },
      link: function(scope){
        if (!scope.onChange) {
          scope.onChange = function(){};
        }

        scope.customDateBreakdownChange = function() {
          var from = moment(scope.selected.from);
          var until = moment(scope.selected.until);

          var diff = function(unit) {
            return Math.abs(from.diff(until, unit));
          };

          var maxBreakdown = 120;

          if (from.isAfter(until)) {
            scope.selected.from = scope.selected.until;
          } else if (scope.selected.type === 'minute' && diff('minutes') > maxBreakdown) {
            scope.selected.type = 'hour';
          } else if (scope.selected.type === 'hour' && diff('hours') > maxBreakdown) {
            scope.selected.type = 'day';
          } else if (scope.selected.type === 'day' && diff('days') > maxBreakdown) {
            scope.selected.type = 'month';
          } else if (scope.selected.type === 'month' && diff('months') > maxBreakdown) {
            scope.selected.type = 'year';
          }

          scope.onChange();
        };
      }
    };
  });
