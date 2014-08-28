'use strict';
/* global jQuery:false */
/* global Morris:false */
/* global moment:false */


angular.module('openhimWebui2App')
  .controller('ChannelMonitoringCtrl', function ($scope, $modal, $interval, $location, $routeParams, Api, Alerting) {

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

    var updateLoadLineChart = function(loadResults){
      /* DEFAULT LOAD OBJECT */
      $scope.transactionLoadData = [
        { date: moment().subtract(6, 'd').format('YYYY-MM-DD'), value: 0 },
        { date: moment().subtract(5, 'd').format('YYYY-MM-DD'), value: 0 },
        { date: moment().subtract(4, 'd').format('YYYY-MM-DD'), value: 0 },
        { date: moment().subtract(3, 'd').format('YYYY-MM-DD'), value: 0 },
        { date: moment().subtract(2, 'd').format('YYYY-MM-DD'), value: 0 },
        { date: moment().subtract(1, 'd').format('YYYY-MM-DD'), value: 0 },
        { date: moment().format('YYYY-MM-DD'), value: 0 }
      ];
      $scope.loadTotal = 0;
      /* DEFAULT LOAD OBJECT */

      var dateFormat, date;

      // construct the transactionLoadData if API success
      for (var i = 0; i < loadResults.length; i++) {
        dateFormat = loadResults[i].timestamp;
        date = moment(dateFormat).format('YYYY-MM-DD');

        // check if date is equal to date in object and update load total
        for (var x = 0; x < $scope.transactionLoadData.length; x++) {
          if( $scope.transactionLoadData[x].date === date ){
            $scope.transactionLoadData[x].value = loadResults[i].load;
            // add to load total
            $scope.loadTotal += loadResults[i].load;
          }
        }
      }      
    };    

    $scope.loadMetricsSuccess = function(loadResults){
      if ( loadResults.length === 0 ){
        Alerting.AlertAddMsg('load', 'warning', 'There were no transactions found for the past week');
      }else{
        updateLoadLineChart(loadResults);
      }
    };

    $scope.loadMetricsError = function(err){
      // add warning message when unable to get data
      Alerting.AlertAddMsg('load', 'danger', 'Transaction Load Error: ' + err.status + ' ' + err.data);
    };

    $scope.getLoadMetrics = function(){
      // reset any load metric alert warnings
      Alerting.AlertReset('load');

      // do API call here to pull channel load metrics
      Api.Metrics.query({
        type: 'day',
        channelId : $routeParams.channelId,
        startDate: moment().subtract(1,'weeks').toDate(),
        endDate: moment().toDate()
      }, $scope.loadMetricsSuccess, $scope.loadMetricsError);
    };

    // do the inital load of the transaction status metrics
    $scope.getLoadMetrics();


    /*********************************************************/
    /**         Transaction Load Metric Functions           **/
    /*********************************************************/



    /******************************************************************/
    /**         Transaction Response Time Metric Functions           **/
    /******************************************************************/
    
    var updateResponseTimeLineChart = function(timeResults){

      /* DEFAULT LOAD OBJECT */
      $scope.transactionTimeData = [
        { date: moment().subtract(6, 'd').format('YYYY-MM-DD'), value: 0 },
        { date: moment().subtract(5, 'd').format('YYYY-MM-DD'), value: 0 },
        { date: moment().subtract(4, 'd').format('YYYY-MM-DD'), value: 0 },
        { date: moment().subtract(3, 'd').format('YYYY-MM-DD'), value: 0 },
        { date: moment().subtract(2, 'd').format('YYYY-MM-DD'), value: 0 },
        { date: moment().subtract(1, 'd').format('YYYY-MM-DD'), value: 0 },
        { date: moment().format('YYYY-MM-DD'), value: 0 }
      ];
      $scope.avgResponseTime = 0;
      /* DEFAULT LOAD OBJECT */

      var dateFormat, date;
      var avgResponseTimeTotal = 0;

      // construct the loadData if API success
      for (var i = 0; i < timeResults.length; i++) {
        dateFormat = timeResults[i].timestamp;
        date = moment(dateFormat).format('YYYY-MM-DD');

        // check if date is equal to date in object and update load total
        for (var x = 0; x < $scope.transactionTimeData.length; x++) {
          if( $scope.transactionTimeData[x].date === date ){
            $scope.transactionTimeData[x].value = timeResults[i].avgResp.toFixed(2);
            // add to load total
            avgResponseTimeTotal += parseFloat(timeResults[i].avgResp);
          }
        }
      }
      $scope.avgResponseTime = (avgResponseTimeTotal / timeResults.length).toFixed(2);
    };

    $scope.timeMetricsSuccess = function(timeResults){
      if ( timeResults.length === 0 ){
        Alerting.AlertAddMsg('responseTime', 'warning', 'There were no transactions found for the past week');
      }else{
        updateResponseTimeLineChart(timeResults);
      }
    };

    $scope.timeMetricsError = function(err){
      // add warning message when unable to get data
      Alerting.AlertAddMsg('responseTime', 'danger', 'Transaction Response Time Error: ' + err.status + ' ' + err.data);
    };

    $scope.getTimeMetrics = function(){
      // reset any time metric alert warnings
      Alerting.AlertReset('responseTime');

      // do API call here to pull channel time metrics
      Api.Metrics.query({
        type: 'day',
        channelId : $routeParams.channelId,
        startDate: moment().subtract(1,'weeks').toDate(),
        endDate: moment().toDate()
      }, $scope.timeMetricsSuccess, $scope.timeMetricsError);
    };

    // do the inital load of the transaction time metrics
    $scope.getTimeMetrics();

    /******************************************************************/
    /**         Transaction Response Time Metric Functions           **/
    /******************************************************************/






















    /***********************************************************/
    /**         Transaction Status Metric Functions           **/
    /***********************************************************/
    
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

    /*var createBarChart = function(statusBarData){
      // check if graph element exist before creating
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
          barColors: ['#3d88ba'],
          hoverCallback: function (index, options, content) {
            $scope.statusDonutChart.select(index);
            return content;
          }
        });
      }
    };*/

    var updateStatusDonutChart = function(statusData){
      $scope.statusDonutData = [];
      $scope.statusDonutColors = [];
      for (var i = 0; i < statusData.length; i++) {
        $scope.statusDonutData.push({ label: statusData[i].label, value: statusData[i].percent });
        $scope.statusDonutColors.push(statusData[i].color);
      }

      console.log($scope.statusDonutColors)

    };

    /***********************************************************/
    /**         Transaction Status Metric Functions           **/
    /***********************************************************/



    /*********************************************************/
    /**         Transaction Status Metric REQUEST           **/
    /*********************************************************/

    $scope.getStatusMetrics = function(){

      // reset any load metric alert warnings
      Alerting.AlertReset('status');

      var startDate = moment().subtract(1, 'd').startOf('day').toDate();
      var endDate = moment().subtract(1, 'd').endOf('day').toDate();
      Api.Metrics.query({
        type: 'status',
        channelId : $routeParams.channelId,
        startDate: startDate,
        endDate: endDate
      }, $scope.statusMetricsSuccess, $scope.statusMetricsError);

    };

    $scope.statusMetricsSuccess = function(statusResults){

      if ( statusResults.length === 0 ){
        Alerting.AlertAddMsg('status', 'warning', 'There were no transactions found for the past day');
      }else{

        var statusData = [];
        var totalTransactions = 0;
        var value, percent;

        // loop through array to calculate how many records there are to work out percentage
        for ( var i=0; i<statusResults.length; i++ ){
          totalTransactions += statusResults[i].load;
        }
        
        // loop through array again to which statuses to add and what the percentages are
        for ( var x=0; x<statusResults.length; x++ ){

          value = statusResults[x].load;
          percent = (100 / totalTransactions * value).toFixed(2);

          switch ( statusResults[x]._id.status ) {
            case 'Processing':
              statusData.push({ label: 'Processing', value: value, percent: percent, color: '#777777' });
              break;
            case 'Failed':
              statusData.push({ label: 'Failed', value: value, percent: percent, color: '#d9534f' });
              break;
            case 'Completed':
              statusData.push({ label: 'Completed', value: value, percent: percent, color: '#f0ad4e' });
              break;
            case 'Completed with Error(s)':
              statusData.push({ label: 'Completed with Error(s)', value: value, percent: percent, color: '#5bc0de' });
              break;
            case 'Successful':
              statusData.push({ label: 'Successful', value: value, percent: percent, color: '#5cb85c' });
              break;
          }

        }

        //updateStatusBarChart(statusData);
        updateStatusDonutChart(statusData);

      }

    };

    $scope.statusMetricsError = function(err){
      // add warning message when unable to get data
      Alerting.AlertAddMsg('status', 'danger', 'Transaction Status Error: ' + err.status + ' ' + err.data);
    };

    // do the inital load of the transaction status metrics
    $scope.getStatusMetrics();

    /*********************************************************/
    /**         Transaction Status Metric REQUEST           **/
    /*********************************************************/

  });