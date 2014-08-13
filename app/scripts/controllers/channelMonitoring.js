'use strict';
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
      /* SIMULATED LOAD VALUES */
      var loadData = [
        { date: moment().subtract(6, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) },
        { date: moment().subtract(5, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) },
        { date: moment().subtract(4, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) },
        { date: moment().subtract(3, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) },
        { date: moment().subtract(2, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) },
        { date: moment().subtract(1, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) },
        { date: moment().format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) }
      ];
      /* SIMULATED LOAD VALUES */

      updateLoadLineChart(loadData);
    };
    
    var updateLoadLineChart = function(loadData){
      // if chart object exist then set new data
      if ($scope.loadLineChart){
        $scope.loadLineChart.setData(loadData);
      }else{
        createLoadLineChart(loadData);
      }
    };

    var createLoadLineChart = function(lineChartData){
      // Morris Bar Chart
      $scope.loadLineChart = new Morris.Line({
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
      /* SIMULATED RESPONSE TIME VALUES */
      var responseTimeData = [
        { date: moment().subtract(6, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) },
        { date: moment().subtract(5, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) },
        { date: moment().subtract(4, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) },
        { date: moment().subtract(3, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) },
        { date: moment().subtract(2, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) },
        { date: moment().subtract(1, 'd').format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) },
        { date: moment().format('YYYY-MM-DD'), value: Math.floor((Math.random() * 5000) + 1) }
      ];
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
      var statusData = [];
      var total = 450;
      var value, percent;

      if ( 1 === 1 ){
        value = 40;
        percent = (100 / total * value).toFixed(2);
        statusData.push({ label: 'Processing', value: value, percent: percent, color: '#777777' });
      }

      if ( 1 === 1 ){
        value = 95;
        percent = (100 / total * value).toFixed(2);
        statusData.push({ label: 'Failed', value: value, percent: percent, color: '#d9534f' });
      }
      
      if ( 1 === 1 ){
        value = 40;
        percent = (100 / total * value).toFixed(2);
        statusData.push({ label: 'Completed', value: value, percent: percent, color: '#f0ad4e' });
      }

      if ( 1 === 1 ){
        value = 25;
        percent = (100 / total * value).toFixed(2);
        statusData.push({ label: 'Completed with Error(s)', value: value, percent: percent, color: '#5bc0de' });
      }

      if ( 1 === 1 ){
        value = 250;
        percent = (100 / total * value).toFixed(2);
        statusData.push({ label: 'Successful', value: value, percent: percent, color: '#5cb85c' });
      }
      /* SIMULATED STATUS VALUES */

      updateStatusBarChart(statusData);
      updateStatusDonutChart(statusData);
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

    var updateStatusDonutChart = function(statusData){
      var statusDonutData = [];
      var statusDonutColors = [];
      for (var i = 0; i < statusData.length; i++) {
        statusDonutData.push({ label: statusData[i].label, value: statusData[i].percent });
        statusDonutColors.push(statusData[i].color);
      }

      // if chart object exist then set new data
      if ($scope.statusDonutChart){
        $scope.statusDonutChart.setData(statusDonutData);
      }else{
        createDonutChart(statusDonutData, statusDonutColors);
      }
    };

    var createBarChart = function(statusBarData){
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
        barColors: ['#3d88ba'],
        hoverCallback: function (index, options, content) {
          $scope.statusDonutChart.select(index);
          return content;
        }
      });
    };

    var createDonutChart = function(statusDonutData, statusDonutColors){
      // Morris Donut Chart
      $scope.statusDonutChart = new Morris.Donut({
        element: 'status-donut',
        data: statusDonutData,
        colors: statusDonutColors,
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