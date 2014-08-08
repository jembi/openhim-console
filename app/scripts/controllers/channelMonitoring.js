'use strict';

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
    }
    
    var updateStatusBarChart = function(status){
      var barData = [
        {status: 'Processing', total: status.processing},
        {status: 'Failed', total: status.failed},
        {status: 'Successful', total: status.successful},            
        {status: 'Completed', total: status.completed},            
        {status: 'Completed with error(s)', total: status.completedWErrors}
      ];

      // if HTML in element then barChart already created - set new data
      if (jQuery("#status-bar").html().length > 0){
        $scope.barChart.setData(barData);  
      }else{
        createBarChart(barData);
      }
    };

    var updateStatusDonutChart = function(status){
      var donutData = [
        {label: 'Processing', value: status.processingPercent },
        {label: 'Failed', value: status.failedPercent },
        {label: 'Successful', value: status.successfulPercent },            
        {label: 'Completed', value: status.completedPercent },
        {label: 'Completed with error(s)', value: status.completedWErrorsPercent }
      ];

      // if HTML in element then donutChart already created - set new data
      if (jQuery("#status-donut").html().length > 0){
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
        hideHover: 'auto',
        barColors: ['#3d88ba']
      });
    }

    var createDonutChart = function(donutData){
      // Morris Donut Chart
      $scope.donutChart = new Morris.Donut({
        element: 'status-donut',
        data: donutData,
        colors: ['#5cb85c', '#777777', '#d9534f', '#5bc0de', '#f0ad4e'],
        formatter: function (y) { return y + '%' }
      });
    }

    // do the inital load of the transaction status metrics
    $scope.getStatusMetrics();

    /***********************************************************/
    /**         Transaction Status Metric Functions           **/
    /***********************************************************/

    

    /*********************************************************/
    /**         Transaction Load Metric Functions           **/
    /*********************************************************/    

    $scope.getLoadMetrics = function(){
      // do API call here to pull channel status metrics
      /* SIMULATED STATUS VALUES */
      var load = {};
      load.day7 = Math.floor((Math.random() * 5000) + 1);
      load.day6 = Math.floor((Math.random() * 5000) + 1);
      load.day5 = Math.floor((Math.random() * 5000) + 1);
      load.day4 = Math.floor((Math.random() * 5000) + 1);
      load.day3 = Math.floor((Math.random() * 5000) + 1);
      load.day2 = Math.floor((Math.random() * 5000) + 1);
      load.day1 = Math.floor((Math.random() * 5000) + 1);
      /* SIMULATED STATUS VALUES */

      updateLoadLineChart(load);
    }
    
    var updateLoadLineChart = function(load){

      var day7 = moment().subtract(6, 'd').format('YYYY-MM-DD');
      var day6 = moment().subtract(5, 'd').format('YYYY-MM-DD');
      var day5 = moment().subtract(4, 'd').format('YYYY-MM-DD');
      var day4 = moment().subtract(3, 'd').format('YYYY-MM-DD');
      var day3 = moment().subtract(2, 'd').format('YYYY-MM-DD');
      var day2 = moment().subtract(1, 'd').format('YYYY-MM-DD');
      var day1 = moment().format('YYYY-MM-DD');


      var lineData = [
        {"date": "2014-08-01", "load": load.day7},
        {"date": "2014-08-02", "load": load.day6},
        {"date": "2014-08-03", "load": load.day5},
        {"date": "2014-08-04", "load": load.day4},
        {"date": "2014-08-05", "load": load.day3},
        {"date": "2014-08-06", "load": load.day2},
        {"date": "2014-08-07", "load": load.day1}
      ];

      // if HTML in element then barChart already created - set new data
      if (jQuery("#load-graph").html().length > 0){
        $scope.lineChart.setData(lineData);  
      }else{
        createLineChart(lineData);
      }
    };

    var createLineChart = function(lineData){
      // Morris Bar Chart
      $scope.lineChart = new Morris.Line({
        element: 'load-graph',
        data: lineData,
        xkey: 'date',
        ykeys: ['load'],
        labels: ['Load']
      });
    }

    // do the inital load of the transaction status metrics
    $scope.getLoadMetrics();

    /*********************************************************/
    /**         Transaction Load Metric Functions           **/
    /*********************************************************/

  });
