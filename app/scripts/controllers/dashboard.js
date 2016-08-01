'use strict';
/* global moment:false */


angular.module('openhimConsoleApp')
  .controller('DashboardCtrl', function ($scope, $modal, $location, $interval, Api, Alerting, Metrics) {

    var noDataErrorMsg = 'There has been no transactions received for the queried timeframe';


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
      // do API call here to pull load metrics
      Api.MetricsTimeseries.query({
        type: $scope.selectedDateType.type,
        startDate: moment($scope.selectedDateType.from).format(),
        endDate: moment($scope.selectedDateType.until).format()
      }, loadMetricsSuccess, loadMetricsError);
    }


    function updateStatusBarChart(metrics) {
      // set scope variable for amount of active channels
      $scope.activeChannels = metrics.length;

      var channelsMap;

      // create channelsMap for status name reference
      Api.Channels.query(function(channels){
        channelsMap = {};
        angular.forEach(channels, function(channel){
          channelsMap[channel._id] = channel.name;
        });

        // define varables for graph data set
        var channelGraphStack;
        var statusData = [];
        var statusKeys = [];
        var statusLabels = [];
        var statusColors = [];

        // loop through each channels found in result and construct graph objects
        for (var i=0; i<metrics.length; i++) {
          channelGraphStack = {};

          // create a link object for when the user clicks on the bar
          channelGraphStack.link = 'channels/'+metrics[i]._id.channelID;
          channelGraphStack.channel = channelsMap[metrics[i]._id.channelID];

          channelGraphStack.processing = metrics[i].processing;

          // only add these if it isnt yet present
          if (statusKeys.indexOf('processing') === -1) {
            statusKeys.push('processing');
            statusLabels.push('Processing');
            statusColors.push('#777777');
          }

          channelGraphStack.failed = metrics[i].failed;

          // only add these if it isnt yet present
          if (statusKeys.indexOf('failed') === -1) {
            statusKeys.push('failed');
            statusLabels.push('Failed');
            statusColors.push('#d9534f');
          }

          channelGraphStack.completed = metrics[i].completed;

          // only add these if it isnt yet present
          if (statusKeys.indexOf('completed') === -1) {
            statusKeys.push('completed');
            statusLabels.push('Completed');
            statusColors.push('#f0ad4e');
          }

          channelGraphStack.completedWErrors = metrics[i].completedWErrors;

          if (statusKeys.indexOf('completedWErrors') === -1) {
            statusKeys.push('completedWErrors');
            statusLabels.push('Completed With Errors');
            statusColors.push('#5bc0de');
          }

          channelGraphStack.successful = metrics[i].successful;

          if (statusKeys.indexOf('successful') === -1) {
            statusKeys.push('successful');
            statusLabels.push('Successful');
            statusColors.push('#5cb85c');
          }

          statusData.push(channelGraphStack);
        }

        $scope.statusData = {data: statusData, xkey: 'channel', ykeys: statusKeys, labels: statusLabels, colors: statusColors, stacked: true};
      },
      function(err){
        Alerting.AlertAddMsg('status', 'danger', 'Channel Load Error: ' + err.status + ' ' + err.data);
      });

    }

    function statusMetricsSuccess (metrics) {
      if (metrics.length === 0) {
        Alerting.AlertAddMsg('status', 'warning', noDataErrorMsg);
      } else {
        updateStatusBarChart(metrics);
      }
    }

    function statusMetricsError(err) {
      // add warning message when unable to get data
      Alerting.AlertAddMsg('status', 'danger', 'Transaction Load Error: ' + err.status + ' ' + err.data);
    }

    function updateStatusMetrics() {
      // do API call here to pull load metrics
      Api.MetricsChannels.query({
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
