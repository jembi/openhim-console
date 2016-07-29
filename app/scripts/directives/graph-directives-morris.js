'use strict';
/* global viewPage: false */
/* global Morris:false */

angular.module('openhimConsoleApp')
  .directive('morrisLineChart', function($parse){
    return{
      restrict:'EA',
      link: function(scope, elem, attrs){
        var element = attrs.id;
        var exp = $parse(attrs.data);

        scope.$watchCollection(exp, function(data){
          elem.empty();
          if (data) {
            scope.morrisLineChart = new Morris.Line({
              element: element,
              data: data.data,
              xkey: data.xkey,
              ykeys: data.ykeys,
              labels: data.labels,
              postUnits: data.postunits,
              resize: true
            });
          }
        });
      }
    };
  })
  .directive('morrisBarChart', function($parse){
    return{
      restrict:'EA',
      link: function(scope, elem, attrs){
        var element = attrs.id;
        var exp = $parse(attrs.data);

        scope.$watchCollection(exp, function(data){
          elem.empty();
          if (data) {
            scope.morrisBarChart = new Morris.Bar({
              element: element,
              data: data.data,
              xkey: data.xkey,
              ykeys: data.ykeys,
              labels: data.labels,
              barColors: data.colors,
              stacked: data.stacked,
              barRatio: 0.4,
              xLabelMargin: 10,
              resize: true,
              hideHover: 'auto'
            }).on('click', function(i, row){
              if ( row.link ){
                // on status click direct user to channel metrics page
                viewPage(row.link);
              }
            });
          }
        });
      }
    };
  })
  .directive('morrisDonutChart', function($parse){
    return{
      restrict:'EA',
      link: function(scope, elem, attrs){
        var element = attrs.id;
        var exp = $parse(attrs.data);

        scope.$watchCollection(exp, function(data){
          elem.empty();
          if (data) {
            scope.morrisDonutChart = new Morris.Donut({
              element: element,
              data: data.data,
              colors: data.colors,
              resize: true,
              formatter: function (y) { return y + '%'; }
            });
          }
        });
      }
    };
  });
