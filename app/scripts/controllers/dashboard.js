'use strict';
/* global moment:false */


angular.module('openhimConsoleApp')
  .controller('DashboardCtrl', function ($scope, $modal, $location, $interval, Api, Alerting) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    $scope.selectedDateType = {
      from: moment().startOf('day').toDate(),
      until: moment().endOf('day').toDate(),
      type: 'hour'
    };

    var dashboardInterval = $interval(function() {
      $scope.updateMetrics();
    }, 5000);

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/


    function buildLineChartData(metrics, key, keyUnit) {
      var graphData = [];
      var from = moment($scope.selectedDateType.from);
      var until = moment($scope.selectedDateType.until);
      var unit = $scope.selectedDateType.type + 's';
      var avgResponseTimeTotal = 0;

      $scope.loadTotal = 0;
      $scope.avgResponseTime = 0;

      var diff = Math.abs(from.diff(until, unit));
      for (var i = 0; i <= diff; i++) {
        var timestamp = from.clone().add(i, unit);
        var value = 0;

        for (var j = 0; j < metrics.length; j++) {
          var ts = moment(metrics[j].timestamp);

          if (timestamp.isSame(ts, $scope.selectedDateType.type)) {
            value = metrics[j][key];
            $scope.loadTotal += metrics[j].total;
            avgResponseTimeTotal += metrics[j].avgResp;
          }
        }

        graphData.push({ timestamp: timestamp.format('YYYY-MM-DD HH:mm'), value: value });
      }

      $scope.avgResponseTime = (avgResponseTimeTotal / metrics.length).toFixed(2);
      return {data: graphData, xkey: 'timestamp', ykeys: ['value'], labels: ['Load'], postunits: ' ' + keyUnit};
    }


    $scope.loadMetricsSuccess = function(metrics){
      if ( metrics.length === 0 ){
        Alerting.AlertAddMsg('load', 'warning', 'There has been no transactions received for the queried timeframe');
      }else{
        $scope.transactionLoadData = buildLineChartData(metrics, 'total', 'per ' + $scope.selectedDateType.type);
        $scope.transactionResponseTimeData = buildLineChartData(metrics, 'avgResp', 'ms');
      }
    };

    $scope.loadMetricsError = function(err){
      // add warning message when unable to get data
      Alerting.AlertAddMsg('load', 'danger', 'Transaction Load Error: ' + err.status + ' ' + err.data);
    };

    function updateTimeseriesMetrics() {
      // reset any load metric alert warnings
      Alerting.AlertReset('load');

      // do API call here to pull load metrics
      Api.MetricsTimeseries.query({
        type: $scope.selectedDateType.type,
        startDate: moment($scope.selectedDateType.from).format(),
        endDate: moment($scope.selectedDateType.until).format()
      }, $scope.loadMetricsSuccess, $scope.loadMetricsError);
    }


    $scope.updateStatusBarChart = function(metrics){
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
        for ( var i=0; i<metrics.length; i++ ){
          channelGraphStack = {};

          // create a link object for when the user clicks on the bar
          channelGraphStack.link = 'channels/'+metrics[i]._id.channelID;
          channelGraphStack.channel = channelsMap[metrics[i]._id.channelID];

          channelGraphStack.processing = metrics[i].processing;

          // only add these if it isnt yet present
          if ( statusKeys.indexOf('processing') === -1 ){
            statusKeys.push('processing');
            statusLabels.push('Processing');
            statusColors.push('#777777');
          }

          channelGraphStack.failed = metrics[i].failed;

          // only add these if it isnt yet present
          if ( statusKeys.indexOf('failed') === -1 ){
            statusKeys.push('failed');
            statusLabels.push('Failed');
            statusColors.push('#d9534f');
          }

          channelGraphStack.completed = metrics[i].completed;

          // only add these if it isnt yet present
          if ( statusKeys.indexOf('completed') === -1 ){
            statusKeys.push('completed');
            statusLabels.push('Completed');
            statusColors.push('#f0ad4e');
          }

          channelGraphStack.completedWErrors = metrics[i].completedWErrors;

          if ( statusKeys.indexOf('completedWErrors') === -1 ){
            statusKeys.push('completedWErrors');
            statusLabels.push('Completed With Errors');
            statusColors.push('#5bc0de');
          }

          channelGraphStack.successful = metrics[i].successful;

          if ( statusKeys.indexOf('successful') === -1 ){
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

    };

    $scope.statusMetricsSuccess = function(metrics){
      if ( metrics.length === 0 ){
        Alerting.AlertAddMsg('status', 'warning', 'There has been no transactions received for today');
      }else{
        $scope.updateStatusBarChart(metrics);
      }
    };

    $scope.statusMetricsError = function(err){
      // add warning message when unable to get data
      Alerting.AlertAddMsg('status', 'danger', 'Transaction Load Error: ' + err.status + ' ' + err.data);
    };

    function updateStatusMetrics() {
      // reset any load metric alert warnings
      Alerting.AlertReset('status');

      // do API call here to pull load metrics
      Api.MetricsChannels.query({
        startDate: moment($scope.selectedDateType.from).format(),
        endDate: moment($scope.selectedDateType.until).format()
      }, $scope.statusMetricsSuccess, $scope.statusMetricsError);
    }


    $scope.updateMetrics = function() {
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
