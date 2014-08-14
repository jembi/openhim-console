'use strict';
/* global jQuery:false */
/* global Morris:false */
/* global moment:false */


angular.module('openhimWebui2App')
  .controller('DashboardCtrl', function ($scope, $modal, $location, $routeParams, Api, Alerting) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/



    

    /***********************************************************/
    /**         Transaction Status Metric Functions           **/
    /***********************************************************/

    $scope.getStatusMetrics = function(){
      // do API call here to pull channel status metrics
      /* SIMULATED STATUS VALUES */
      var statusData = [];
      var total = 450;
      var value;

      if ( 1 === 1 ){
        value = 40;
        statusData.push({ label: 'Processing', value: value });
      }

      if ( 1 === 1 ){
        value = 95;
        statusData.push({ label: 'Failed', value: value });
      }
      
      if ( 1 === 1 ){
        value = 40;
        statusData.push({ label: 'Completed', value: value });
      }

      if ( 1 === 1 ){
        value = 25;
        statusData.push({ label: 'Completed with Error(s)', value: value });
      }

      if ( 1 === 1 ){
        value = 250;
        statusData.push({ label: 'Successful', value: value });
      }
      /* SIMULATED STATUS VALUES */

      updateStatusBarChart(statusData);
    };
    
    var updateStatusBarChart = function(statusData){
      // construct status bar object for morris
      var statusBarData = [];
      for (var i = 0; i < statusData.length; i++) {
        statusBarData.push({ label: statusData[i].label, value: statusData[i].value });
      }

      // if chart object exist then set new data
      if ($scope.statusBarChart){
        $scope.statusBarChart.setData(statusBarData);
      }else{
        createBarChart(statusBarData);
      }
    };

    var createBarChart = function(statusBarData){
      // check if graph element exist before creating


      $scope.morrisChart = Morris.Bar({
			  element: 'bar-example',
			  data: [
			    { y: '2006', a: 100, b: 90 },
			    { y: '2007', a: 75,  b: 65 },
			    { y: '2008', a: 50,  b: 40 },
			    { y: '2009', a: 75,  b: 65 },
			    { y: '2010', a: 50,  b: 40 },
			    { y: '2011', a: 75,  b: 65 },
			    { y: '2012', a: 100, b: 90 }
			  ],
			  xkey: 'y',
			  ykeys: ['a', 'b'],
			  stacked: true,
			  labels: ['Series A', 'Series B'],
			  barColors: ['#d9534f', '#5cb85c']
			});


      if ( jQuery('#status-bar:visible').length ){
        // Morris Bar Chart
        $scope.statusBarChart = new Morris.Bar({
          element: 'status-bar',
          data: statusBarData,
          xkey: 'label',
          ykeys: ['value'],
          labels: ['Total'],
          barRatio: 0.4,
          xLabelMargin: 10,
          resize: true,
          hideHover: 'auto',
          barColors: ['#3d88ba']
        });
      }
    };

    // do the inital load of the transaction status metrics
    $scope.getStatusMetrics();

    /***********************************************************/
    /**         Transaction Status Metric Functions           **/
    /***********************************************************/

  });