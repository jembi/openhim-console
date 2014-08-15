'use strict';
/* global jQuery:false */
/* global Morris:false */
/* global moment:false */


angular.module('openhimWebui2App')
  .controller('DashboardCtrl', function ($scope, $modal, $location, $routeParams, Api, Alerting) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    // Anything needed here?

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/



    /******************************************************************/
    /**         Transaction Response Time Metric Functions           **/
    /******************************************************************/

    $scope.getTransactionLoadMetrics = function(){
      // do API call here to pull channel response metrics
      /* SIMULATED RESPONSE TIME VALUES */
      var value = 0;
      $scope.loadTotal = 0;
      var transactionLoadData = [];
      for ( var i=1; i<=24; i++ ){
      	value = Math.floor((Math.random() * 15) + 1);
      	$scope.loadTotal += value;
      	transactionLoadData.push({ hour: moment().format('YYYY-MM-DD')+' '+i+':00', value: value });
      }
      /* SIMULATED RESPONSE TIME VALUES */

      updateTransactionLoadLineChart(transactionLoadData);
    };
    
    var updateTransactionLoadLineChart = function(transactionLoadData){
      // if chart object exist then set new data
      if ($scope.transactionLoadLineChart){
        $scope.transactionLoadLineChart.setData(transactionLoadData);
      }else{
        createTransactionLoadLineChart(transactionLoadData);
      }
    };

    var createTransactionLoadLineChart = function(lineChartData){
      // check if graph element exist before creating
      if ( jQuery('#transaction-load-graph:visible').length ){
        // Morris Bar Chart
        $scope.transactionLoadLineChart = new Morris.Line({
          element: 'transaction-load-graph',
          data: lineChartData,
          xkey: 'hour',
          ykeys: ['value'],
          labels: ['value'],
          postUnits: ' per hour',
          resize: true
        });
      }
    };

    // do the inital load of the transaction status metrics
    $scope.getTransactionLoadMetrics();

    /******************************************************************/
    /**         Transaction Response Time Metric Functions           **/
    /******************************************************************/



    /******************************************************************/
    /**         Transaction Response Time Metric Functions           **/
    /******************************************************************/

    $scope.getStatusMetrics = function(){
      // do API call here to pull channel response metrics

      /* SIMULATED STATUS VALUES */
      var statusData = [];
      var processing, failed, completed, completedWErrors, successful;

      var channels = ['Channel 1', 'Channel 2', 'Channel 3', 'Channel 4', 'Channel 5'];
      for ( var i=0; i<channels.length; i++ ){

      	processing = Math.floor((Math.random() * 5000) + 1); 
      	failed = Math.floor((Math.random() * 5000) + 1);
      	completed = Math.floor((Math.random() * 5000) + 1);
      	completedWErrors = Math.floor((Math.random() * 5000) + 1);
      	successful = Math.floor((Math.random() * 5000) + 1);

      	statusData.push({ channelLink: '53ed85c12fa9fcd14667bf71', channel: channels[i], processing: processing, failed: failed, completed: completed, completedWErrors: completedWErrors, successful: successful });
      }

      var statusKeys = ['processing', 'failed', 'completed', 'completedWErrors', 'successful'];
      var statusLabels = ['Processing', 'Failed', 'Completed', 'Completed With Errors', 'Successful'];
      var statusColors = ['#777777', '#d9534f', '#f0ad4e', '#5bc0de', '#5cb85c'];
      /* SIMULATED STATUS VALUES */


      updateStatusBarChart(statusData, statusKeys, statusLabels, statusColors);
    };
    
    var updateStatusBarChart = function(statusData, statusKeys, statusLabels, statusColors){
      // if chart object exist then set new data
      if ($scope.statusBarChart){
        $scope.statusBarChart.setData(statusData, statusKeys, statusLabels, statusColors);
      }else{
        createStatusBarChart(statusData, statusKeys, statusLabels, statusColors);
      }
    };

    var createStatusBarChart = function(statusData, statusKeys, statusLabels, statusColors){
      // check if graph element exist before creating
      if ( jQuery('#response-time-graph:visible').length ){
        
      	$scope.statusBarChart = Morris.Bar({
				  element: 'transaction-status-graph',
				  data: statusData,
				  xkey: 'channel',
				  ykeys: statusKeys,
				  stacked: true,
				  hideHover: 'auto',
				  labels: statusLabels,
				  barColors: statusColors
				}).on('click', function(i, row){
				  console.log(i, row);
				});

      }
    };

    // do the inital load of the transaction status metrics
    $scope.getStatusMetrics();

		/******************************************************************/
    /**         Transaction Response Time Metric Functions           **/
    /******************************************************************/
    


    /******************************************************************/
    /**         Transaction Response Time Metric Functions           **/
    /******************************************************************/

    $scope.getResponseTimeMetrics = function(){
      // do API call here to pull channel response metrics
      /* SIMULATED RESPONSE TIME VALUES */
      var responseTimeData = [];
      for ( var i=1; i<=24; i++ ){
      	responseTimeData.push({ hour: moment().format('YYYY-MM-DD')+' '+i+':00', value: Math.floor((Math.random() * 15) + 1) });
      }

      /* SIMULATED RESPONSE TIME VALUES */

      updateResponseTimeLineChart(responseTimeData);
    };
    
    var updateResponseTimeLineChart = function(responseTimeData){
      // if chart object exist then set new data
      if ($scope.responseTimeLineChart){
        $scope.responseTimeLineChart.setData(responseTimeData);
      }else{
        createResponseTimeLineChart(responseTimeData);
      }
    };

    var createResponseTimeLineChart = function(lineChartData){
      // check if graph element exist before creating
      if ( jQuery('#response-time-graph:visible').length ){
        // Morris Bar Chart
        $scope.responseTimeLineChart = new Morris.Line({
          element: 'response-time-graph',
          data: lineChartData,
          xkey: 'hour',
          ykeys: ['value'],
          labels: ['value'],
          postUnits: ' ms',
          resize: true
        });
      }
    };

    // do the inital load of the transaction status metrics
    $scope.getResponseTimeMetrics();

    /******************************************************************/
    /**         Transaction Response Time Metric Functions           **/
    /******************************************************************/

  });