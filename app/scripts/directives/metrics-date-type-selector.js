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

        scope.custom = false;
        scope.period = '1d';

        scope.changePeriod = function() {
          if (scope.period === '1h') {
            scope.selected.from = moment().startOf('hour').toDate();
            scope.selected.until = moment().endOf('hour').toDate();
            scope.selected.type = 'minute';
            scope.custom = false;
          } else if (scope.period === '1d') {
            scope.selected.from = moment().startOf('day').toDate();
            scope.selected.until = moment().endOf('day').toDate();
            scope.selected.type = 'hour';
            scope.custom = false;
          } else if (scope.period === '1w') {
            scope.selected.from = moment().startOf('week').toDate();
            scope.selected.until = moment().endOf('week').toDate();
            scope.selected.type = 'day';
            scope.custom = false;
          } else if (scope.period === '1m') {
            scope.selected.from = moment().startOf('month').toDate();
            scope.selected.until = moment().endOf('month').toDate();
            scope.selected.type = 'day';
            scope.custom = false;
          } else if (scope.period === '1y') {
            scope.selected.from = moment().startOf('year').toDate();
            scope.selected.until = moment().endOf('year').toDate();
            scope.selected.type = 'month';
            scope.custom = false;
          } else if (scope.period === '5y') {
            scope.selected.from = moment().subtract(5, 'years').startOf('year').toDate();
            scope.selected.until = moment().endOf('year').toDate();
            scope.selected.type = 'month';
            scope.custom = false;
          } else {
            scope.custom = true;
          }
          scope.onChange();
        };
      }
    };
  });
