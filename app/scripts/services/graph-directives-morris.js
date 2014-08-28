'use strict';

angular.module('openhimWebui2App')
  .directive('morrisLineChart', function($parse, $window){
    return{
      restrict:'EA',
      link: function(scope, elem, attrs){
        var exp = $parse(attrs.data);
        var data = exp(scope);
        var element = attrs.element;
        var xkey = attrs.xkey;
        var ykeys = attrs.ykeys;
        var labels = attrs.labels;
        var postunits = attrs.postunits;

        if(!postunits){
          postunits = '';
        }

        // on data change either create graph or update values
        scope.$watchCollection(exp, function(newVal, oldVal){

          var data = newVal;
          
          if (scope.morrisLineChart){
            scope.morrisLineChart.setData(data);
          }else{
            // Morris Bar Chart
            scope.morrisLineChart = new Morris.Line({
              element: element,
              data: data,
              xkey: 'date',
              ykeys: ['value'],
              labels: ['Load'],
              postUnits: " "+postunits,
              resize: true
            });
          }
        });
      }
    }
  })
  .directive('morrisBarChart', function($parse, $window){
    return{
      restrict:'EA',
      link: function(scope, elem, attrs){
        var exp = $parse(attrs.data);
        var data = exp(scope);
        var element = attrs.element;
        var xkey = attrs.xkey;
        var ykeys = attrs.ykeys;
        var labels = attrs.labels;
        var postunits = attrs.postunits;

        if(!postunits){
          postunits = '';
        }

        // on data change either create graph or update values
        scope.$watchCollection(exp, function(newVal, oldVal){

          var data = newVal;
          
          if (scope.morrisLineChart){
            scope.morrisLineChart.setData(data);
          }else{
            // Morris Bar Chart
            scope.morrisLineChart = new Morris.Line({
              element: element,
              data: data,
              xkey: 'date',
              ykeys: ['value'],
              labels: ['Load'],
              postUnits: " "+postunits,
              resize: true
            });
          }
        });
      }
    }
  })
  .directive('morrisDonutChart', function($parse, $window){
    return{
      restrict:'EA',
      link: function(scope, elem, attrs){
        /*var expData = $parse(attrs.data);
        var data = expData(scope);*/
        console.log(attrs.data)
        var exp = $parse(attrs.data);
        console.log(exp)
        var data = exp(scope);

        var element = attrs.element;

        var expColours = $parse(attrs.colours);
        var colours = expColours(scope);

        console.log(data);
        console.log(element);
        console.log(colours);

        // on data change either create graph or update values
        scope.$watchCollection(expData, function(newVal, oldVal){

          var data = newVal;
          
          if (scope.morrisDonutChart){
            scope.morrisDonutChart.setData(data);
          }else{

            // Morris Donut Chart
            scope.morrisDonutChart = new Morris.Donut({
              element: 'status-donut',
              data: data,
              colors: colours,
              resize: true,
              formatter: function (y) { return y + '%'; }
            });

          }
        });
      }
    }
  });