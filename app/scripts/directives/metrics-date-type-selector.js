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
        scope.optionsEnabled = {
          minute: true,
          hour: true,
          day: true,
          week: true,
          month: true,
          year: true
        };

        if (!scope.onChange) {
          scope.onChange = function(){};
        }

        function processOptions() {
          var from = moment(scope.selected.from);
          var until = moment(scope.selected.until);

          var diff = function(unit) {
            return Math.abs(from.diff(until, unit));
          };

          var maxBreakdown = 120;

          if (from.isAfter(until)) {
            scope.selected.from = scope.selected.until;
          }

          scope.optionsEnabled.minute = true;
          scope.optionsEnabled.hour = true;
          scope.optionsEnabled.day = true;
          scope.optionsEnabled.week = true;
          scope.optionsEnabled.month = true;
          scope.optionsEnabled.year = true;

          if (diff('minutes') > maxBreakdown) {
            scope.optionsEnabled.minute = false;
            if (scope.selected.type === 'minute') {
              scope.selected.type = 'hour';
            }
          }
          if (diff('hours') > maxBreakdown) {
            scope.optionsEnabled.hour = false;
            if (scope.selected.type === 'hour') {
              scope.selected.type = 'day';
            }
          }
          if (diff('days') > maxBreakdown) {
            scope.optionsEnabled.day = false;
            if (scope.selected.type === 'day') {
              scope.selected.type = 'week';
            }
          }
          if (diff('weeks') > maxBreakdown) {
            scope.optionsEnabled.week = false;
            if (scope.selected.type === 'week') {
              scope.selected.type = 'month';
            }
          }
          if (diff('months') > maxBreakdown) {
            scope.optionsEnabled.month = false;
            if (scope.selected.type === 'month') {
              scope.selected.type = 'year';
            }
          }
        }

        scope.customDateBreakdownChange = function() {
          processOptions();
          scope.onChange();
        };

        // process for initial values
        processOptions();
      }
    };
  });
