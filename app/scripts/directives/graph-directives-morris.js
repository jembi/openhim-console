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

        // on data change either create graph or update values
        scope.$watchCollection(exp, function(newVal){
          var data = newVal;
          
          // if data exist
          if ( data ){
            // if morris bar chart exist then update it
            if (scope.morrisLineChart){
              scope.morrisLineChart.setData(data.data);
            }else{
              // create Morris Line Chart if it doesnt yet exist
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

        // on data change either create graph or update values
        scope.$watchCollection(exp, function(newVal){
          var data = newVal;

          // if data exist
          if ( data ){
            // if morris bar chart exist then update it
            if (scope.morrisBarChart){
              scope.morrisBarChart.setData(data.data);
            }else{
              // create Morris Bar Chart if it doesnt yet exist
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

        // on data change either create graph or update values
        scope.$watchCollection(exp, function(newVal){
          var data = newVal;
          
          // if data exist yet
          if ( data ){
            // if morris donut chart exist then update it
            if (scope.morrisDonutChart){
              scope.morrisDonutChart.setData(data.data);
            }else{
              // create Morris Donut Chart if it doesnt yet exist
              scope.morrisDonutChart = new Morris.Donut({
                element: element,
                data: data.data,
                colors: data.colors,
                resize: true,
                formatter: function (y) { return y + '%'; }
              });
            }
          }
        });
      }
    };
  });