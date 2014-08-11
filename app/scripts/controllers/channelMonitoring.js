'use strict';
/* global jQuery:false */
/* global Morris:false */
/* global moment:false */


angular.module('openhimWebui2App')
  .controller('ChannelMonitoringCtrl', function ($scope, $modal, $location, $routeParams, Api, Alerting) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    var channelSuccess = function(channel){
      $scope.channel = channel;
    };

    var channelError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    //get the Data for the supplied ID and store in 'transactionsDetails' object
    Api.Channels.get({ channelId: $routeParams.channelId }, channelSuccess, channelError);

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/



    /*********************************************************/
    /**         Transaction Load Metric Functions           **/
    /*********************************************************/

    $scope.getLoadMetrics = function(){
      // do API call here to pull channel load metrics
      /* SIMULATED STATUS VALUES */
      var loadData = {};
      loadData.day7 = { date: moment().subtract(6, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      loadData.day6 = { date: moment().subtract(5, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      loadData.day5 = { date: moment().subtract(4, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      loadData.day4 = { date: moment().subtract(3, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      loadData.day3 = { date: moment().subtract(2, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      loadData.day2 = { date: moment().subtract(1, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      loadData.day1 = { date: moment().format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      console.log(loadData);
      /* SIMULATED STATUS VALUES */

      updateLoadLineChart(loadData);
    };
    
    var updateLoadLineChart = function(loadData){
      var lineChartData = [
        { 'date': loadData.day7.date, 'value': loadData.day7.value },
        { 'date': loadData.day6.date, 'value': loadData.day6.value },
        { 'date': loadData.day5.date, 'value': loadData.day5.value },
        { 'date': loadData.day4.date, 'value': loadData.day4.value },
        { 'date': loadData.day3.date, 'value': loadData.day3.value },
        { 'date': loadData.day2.date, 'value': loadData.day2.value },
        { 'date': loadData.day1.date, 'value': loadData.day1.value }
      ];

      // if HTML in element then barChart already created - set new data
      if (jQuery('#load-graph').html().length > 0){
        $scope.lineChart.setData(lineChartData);
      }else{
        createLoadLineChart(lineChartData);
      }
    };

    var createLoadLineChart = function(lineChartData){
      // Morris Bar Chart
      $scope.lineChart = new Morris.Line({
        element: 'load-graph',
        data: lineChartData,
        xkey: 'date',
        ykeys: ['value'],
        labels: ['Load'],
        resize: true
      });
    };

    // do the inital load of the transaction status metrics
    $scope.getLoadMetrics();

    /*********************************************************/
    /**         Transaction Load Metric Functions           **/
    /*********************************************************/



    /******************************************************************/
    /**         Transaction Response Time Metric Functions           **/
    /******************************************************************/

    $scope.getResponseTimeMetrics = function(){
      // do API call here to pull channel response metrics
      /* SIMULATED STATUS VALUES */
      var responseTimeData = {};
      responseTimeData.day7 = { date: moment().subtract(6, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      responseTimeData.day6 = { date: moment().subtract(5, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      responseTimeData.day5 = { date: moment().subtract(4, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      responseTimeData.day4 = { date: moment().subtract(3, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      responseTimeData.day3 = { date: moment().subtract(2, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      responseTimeData.day2 = { date: moment().subtract(1, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      responseTimeData.day1 = { date: moment().format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) };
      /* SIMULATED STATUS VALUES */

      updateResponseTimeLineChart(responseTimeData);
    };
    
    var updateResponseTimeLineChart = function(responseTimeData){      
      var lineChartData = [
        { 'date': responseTimeData.day7.date, 'value': responseTimeData.day7.value },
        { 'date': responseTimeData.day6.date, 'value': responseTimeData.day6.value },
        { 'date': responseTimeData.day5.date, 'value': responseTimeData.day5.value },
        { 'date': responseTimeData.day4.date, 'value': responseTimeData.day4.value },
        { 'date': responseTimeData.day3.date, 'value': responseTimeData.day3.value },
        { 'date': responseTimeData.day2.date, 'value': responseTimeData.day2.value },
        { 'date': responseTimeData.day1.date, 'value': responseTimeData.day1.value }
      ];

      // if HTML in element then barChart already created - set new data
      if (jQuery('#response-time-graph').html().length > 0){
        $scope.responseTimeLineChart.setData(lineChartData);
      }else{
        createResponseTimeLineChart(lineChartData);
      }
    };

    var createResponseTimeLineChart = function(lineChartData){
      // Morris Bar Chart
      $scope.responseTimeLineChart = new Morris.Line({
        element: 'response-time-graph',
        data: lineChartData,
        xkey: 'date',
        ykeys: ['value'],
        labels: ['Load'],
        postUnits: ' ms',
        resize: true
      });
    };

    // do the inital load of the transaction status metrics
    $scope.getResponseTimeMetrics();

    /******************************************************************/
    /**         Transaction Response Time Metric Functions           **/
    /******************************************************************/



    /***********************************************************/
    /**         Transaction Status Metric Functions           **/
    /***********************************************************/

    $scope.getStatusMetrics = function(){
      // do API call here to pull channel status metrics
      /* SIMULATED STATUS VALUES */
      var status = {};
      status.processing = Math.floor((Math.random() * 1000) + 1);
      status.failed = Math.floor((Math.random() * 1000) + 1);
      status.completed = Math.floor((Math.random() * 1000) + 1);
      status.successful = Math.floor((Math.random() * 1000) + 1);
      status.completedWErrors = Math.floor((Math.random() * 1000) + 1);

      var total = status.processing + status.failed + status.completed + status.successful + status.completedWErrors;

      status.processingPercent = Math.floor(100 / total * status.processing);
      status.failedPercent = Math.floor(100 / total * status.failed);
      status.completedPercent = Math.floor(100 / total * status.completed);
      status.successfulPercent = Math.floor(100 / total * status.successful);
      status.completedWErrorsPercent = Math.floor(100 / total * status.completedWErrors);
      /* SIMULATED STATUS VALUES */

      updateStatusBarChart(status);
      updateStatusDonutChart(status);
    };
    
    var updateStatusBarChart = function(status){
      var barData = [
        { status: 'Processing', total: status.processing },
        { status: 'Failed', total: status.failed },
        { status: 'Completed', total: status.completed },
        { status: 'Completed with error(s)', total: status.completedWErrors },
        { status: 'Successful', total: status.successful }
      ];

      // if HTML in element then barChart already created - set new data
      if (jQuery('#status-bar').html().length > 0){
        $scope.barChart.setData(barData);
      }else{
        createBarChart(barData);
      }
    };

    var updateStatusDonutChart = function(status){
      var donutData = [
        { label: 'Processing', value: status.processingPercent },
        { label: 'Failed', value: status.failedPercent },        
        { label: 'Completed', value: status.completedPercent },
        { label: 'Completed with error(s)', value: status.completedWErrorsPercent },
        { label: 'Successful', value: status.successfulPercent }
      ];

      // if HTML in element then donutChart already created - set new data
      if (jQuery('#status-donut').html().length > 0){
        $scope.donutChart.setData(donutData);
      }else{
        createDonutChart(donutData);
      }
    };

    var createBarChart = function(barData){
      // Morris Bar Chart
      $scope.barChart = new Morris.Bar({
        element: 'status-bar',
        data: barData,
        xkey: 'status',
        ykeys: ['total'],
        labels: ['Total'],
        barRatio: 0.4,
        xLabelMargin: 10,
        resize: true,
        hideHover: 'auto',
        barColors: ['#3d88ba']
      });
    };

    var createDonutChart = function(donutData){
      // Morris Donut Chart
      $scope.donutChart = new Morris.Donut({
        element: 'status-donut',
        data: donutData,
        colors: ['#777777', '#d9534f', '#f0ad4e', '#5bc0de', '#5cb85c'],
        resize: true,
        formatter: function (y) { return y + '%'; }
      });
    };

    // do the inital load of the transaction status metrics
    $scope.getStatusMetrics();

    /***********************************************************/
    /**         Transaction Status Metric Functions           **/
    /***********************************************************/

  });
