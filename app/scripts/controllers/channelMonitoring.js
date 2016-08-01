'use strict';
/* global moment:false */


angular.module('openhimConsoleApp')
  .controller('ChannelMonitoringCtrl', function ($scope, $modal, $interval, $location, $routeParams, Api, Alerting, Metrics) {

    var noDataErrorMsg = 'There has been no transactions received for the queried timeframe';

    var channelSuccess = function(channel){
      $scope.channel = channel;
    };

    var channelError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    //get the Data for the supplied ID and store in 'transactionsDetails' object
    Api.Channels.get({ channelId: $routeParams.channelId }, channelSuccess, channelError);

    $scope.selectedDateType = {
      period: '1d'
    };

    var dashboardInterval = $interval(function() {
      $scope.updateMetrics();
    }, 5000);


    function loadMetricsSuccess(metrics) {
      if (metrics.length === 0) {
        Alerting.AlertAddMsg('load', 'warning', noDataErrorMsg);
        Alerting.AlertAddMsg('responseTime', 'warning', noDataErrorMsg);
      } else {
        var round = function (d) {
          return (d).toFixed(2);
        };
        $scope.transactionLoadData = Metrics.buildLineChartData($scope.selectedDateType, metrics, 'total', 'per ' + $scope.selectedDateType.type);
        $scope.transactionResponseTimeData = Metrics.buildLineChartData($scope.selectedDateType, metrics, 'avgResp', 'ms', round);
      }
    }

    function loadMetricsError(err) {
      // add warning message when unable to get data
      Alerting.AlertAddMsg('load', 'danger', 'Transaction Load Error: ' + err.status + ' ' + err.data);
      Alerting.AlertAddMsg('responseTime', 'danger', 'Transaction Load Error: ' + err.status + ' ' + err.data);
    }

    function updateTimeseriesMetrics() {
      Api.MetricsTimeseriesChannel.query({
        type: $scope.selectedDateType.type,
        channelId : $routeParams.channelId,
        startDate: moment($scope.selectedDateType.from).format(),
        endDate: moment($scope.selectedDateType.until).format()
      }, loadMetricsSuccess, loadMetricsError);
    }



    var updateStatusBarChart = function(statusData){
      // construct status bar object for morris
      var statusBarData = [];
      for (var i = 0; i < statusData.length; i++) {
        statusBarData.push({ label: statusData[i].label, value: statusData[i].value });
      }
      $scope.statusBarData = {data: statusBarData, xkey: 'label', ykeys: ['value'], labels: ['Total']};
    };

    var updateStatusDonutChart = function(statusData){
      var statusDonutData = [];
      var statusDonutColors = [];
      for (var i = 0; i < statusData.length; i++) {
        statusDonutData.push({ label: statusData[i].label, value: statusData[i].percent });
        statusDonutColors.push(statusData[i].color);
      }
      $scope.statusDonutData = {data: statusDonutData, colors: statusDonutColors};
    };

    var statusMetricsSuccess = function(statusResults){

      if ( statusResults.length === 0 ){
        Alerting.AlertAddMsg('status', 'warning', noDataErrorMsg);
      }else{

        var statusData = [];
        var totalTransactions = 0;
        var value, percent;

        totalTransactions += parseInt( statusResults[0].processing );
        totalTransactions += parseInt( statusResults[0].failed );
        totalTransactions += parseInt( statusResults[0].completed );
        totalTransactions += parseInt( statusResults[0].completedWErrors );
        totalTransactions += parseInt( statusResults[0].successful );

        if (parseInt( statusResults[0].processing ) !== 0){
          value = parseInt( statusResults[0].processing );
          percent = (100 / totalTransactions * value).toFixed(2);
          statusData.push({ label: 'Processing', value: value, percent: percent, color: '#777777' });
        }

        if (parseInt( statusResults[0].failed ) !== 0){
          value = parseInt( statusResults[0].failed );
          percent = (100 / totalTransactions * value).toFixed(2);
          statusData.push({ label: 'Failed', value: value, percent: percent, color: '#d9534f' });
        }

        if (parseInt( statusResults[0].completed ) !== 0){
          value = parseInt( statusResults[0].completed );
          percent = (100 / totalTransactions * value).toFixed(2);
          statusData.push({ label: 'Completed', value: value, percent: percent, color: '#f0ad4e' });
        }

        if (parseInt( statusResults[0].completedWErrors ) !== 0){
          value = parseInt( statusResults[0].completedWErrors );
          percent = (100 / totalTransactions * value).toFixed(2);
          statusData.push({ label: 'Completed With Error (s)', value: value, percent: percent, color: '#5bc0de' });
        }

        if ( parseInt( statusResults[0].successful ) !== 0 ){
          value = parseInt( statusResults[0].successful );
          percent = (100 / totalTransactions * value).toFixed(2);
          statusData.push({ label: 'Successful', value: value, percent: percent, color: '#5cb85c' });
        }

        updateStatusBarChart(statusData);
        updateStatusDonutChart(statusData);

      }

    };

    var statusMetricsError = function(err){
      // add warning message when unable to get data
      Alerting.AlertAddMsg('status', 'danger', 'Transaction Status Error: ' + err.status + ' ' + err.data);
    };

    function updateStatusMetrics() {
      Api.MetricsChannels.query({
        channelId : $routeParams.channelId,
        startDate: moment($scope.selectedDateType.from).format(),
        endDate: moment($scope.selectedDateType.until).format()
      }, statusMetricsSuccess, statusMetricsError);
    }



    $scope.updateMetrics = function() {
      Alerting.AlertReset('load');
      Alerting.AlertReset('responseTime');
      Alerting.AlertReset('status');

      Metrics.refreshDatesForSelectedPeriod($scope.selectedDateType);
      updateTimeseriesMetrics();
      updateStatusMetrics();
    };

    $scope.updateMetrics();


    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      if (angular.isDefined(dashboardInterval)) {
        $interval.cancel(dashboardInterval);
        dashboardInterval = undefined;
      }
    });

  });
