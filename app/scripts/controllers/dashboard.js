'use strict';
/* global moment:false */


angular.module('openhimWebui2App')
  .controller('DashboardCtrl', function ($scope, $modal, $location, $interval, Api, Alerting) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    var dashboardInterval = $interval(function() {
      //$scope.getTransactionLoadMetrics();
      $scope.getLoadMetrics();
      $scope.getTimeMetrics();
      $scope.getStatusMetrics();
    }, 5000);

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/




    /*********************************************************/
    /**         Transaction Load Metric Functions           **/
    /*********************************************************/

    $scope.updateTransactionLoadLineChart = function(loadResults){
      var value;
      var hour;
      var transactionLoadData = [];
      $scope.loadTotal = 0;

      for ( var i=1; i<=moment().add(1, 'hours').format('H'); i++ ){
        value = 0;
        // needs to be in date format
        hour = moment().format('YYYY-MM-DD')+' '+i+':00:00';
        for ( var x=0; x<loadResults.length; x++ ){
          var date = loadResults[x].timestamp;

          // check if the result has value for current hour in the loop
          // add one hour to simulate transactions for the end of the hour and not in the hour
          if ( moment( date ).add(1, 'hours').format('H') === moment( hour, 'YYYY-MM-DD H' ).format('H') ){
            value = loadResults[x].load;
          }
        }

        $scope.loadTotal += value;
        transactionLoadData.push({ hour: hour, value: value });
      }

      $scope.transactionLoadData = {data: transactionLoadData, xkey: 'hour', ykeys: ['value'], labels: ['Load'], postunits: ' per hour'};
    };

    $scope.loadMetricsSuccess = function(loadResults){
      if ( loadResults.length === 0 ){
        Alerting.AlertAddMsg('load', 'warning', 'There has been no transactions received for today');
      }else{
        $scope.updateTransactionLoadLineChart(loadResults);
      }
    };

    $scope.loadMetricsError = function(err){
      // add warning message when unable to get data
      Alerting.AlertAddMsg('load', 'danger', 'Transaction Load Error: ' + err.status + ' ' + err.data);
    };

    $scope.getLoadMetrics = function(){
      // reset any load metric alert warnings
      Alerting.AlertReset('load');

      var startDate = moment().startOf('day').toDate();
      var endDate = moment().startOf('hour').add(1, 'hours').toDate();

      // do API call here to pull load metrics
      Api.Metrics.query({
        startDate: startDate,
        endDate: endDate
      }, $scope.loadMetricsSuccess, $scope.loadMetricsError);
    };

    $scope.getLoadMetrics();

    /*********************************************************/
    /**         Transaction Load Metric Functions           **/
    /*********************************************************/



    /******************************************************************/
    /**         Transaction Response Time Metric Functions           **/
    /******************************************************************/

    $scope.updateResponseTimeLineChart = function(timeResults){
      var value = 0;
      var hour;
      var avgResponseTimeTotal = 0;
      var responseTimeData = [];
      $scope.avgResponseTime = 0;

      for ( var i=1; i<=moment().add(1, 'hours').format('H'); i++ ){
        value = 0;
        // needs to be in date format
        hour = moment().format('YYYY-MM-DD')+' '+i+':00';
        for ( var x=0; x<timeResults.length; x++ ){
          var date = timeResults[x].timestamp;
          // check if the result has value for current hour in the loop
          if ( moment( date ).add(1, 'hours').format('H') === moment( hour, 'YYYY-MM-DD H' ).format('H') ){
            value = timeResults[x].avgResp;
            avgResponseTimeTotal += value;
          }
        }

        $scope.avgResponseTime += value;
        responseTimeData.push({ hour: hour, value: value.toFixed(2) });
      }

      $scope.avgResponseTime = (avgResponseTimeTotal / timeResults.length).toFixed(2);

      // set data for morris graph to create/update
      $scope.transactionResponseTimeData = {data: responseTimeData, xkey: 'hour', ykeys: ['value'], labels: ['Load'], postunits: ' ms'};

    };

    $scope.timeMetricsSuccess = function(timeResults){
      if ( timeResults.length === 0 ){
        Alerting.AlertAddMsg('responseTime', 'warning', 'There has been no transactions received for today');
      }else{
        $scope.updateResponseTimeLineChart(timeResults);
      }
    };

    $scope.timeMetricsError = function(err){
      // add warning message when unable to get data
      Alerting.AlertAddMsg('responseTime', 'danger', 'Transaction Response Time Error: ' + err.status + ' ' + err.data);
    };

    $scope.getTimeMetrics = function(){
      // reset any load metric alert warnings
      Alerting.AlertReset('responseTime');

      var startDate = moment().startOf('day').toDate();
      var endDate = moment().startOf('hour').add(1, 'hours').toDate();

      // do API call here to pull load metrics
      Api.Metrics.query({
        startDate: startDate,
        endDate: endDate
      }, $scope.timeMetricsSuccess, $scope.timeMetricsError);
    };

    $scope.getTimeMetrics();

    /******************************************************************/
    /**         Transaction Response Time Metric Functions           **/
    /******************************************************************/






    /********************************************************************/
    /**         Channel Transactions Status Metric Functions           **/
    /********************************************************************/

    $scope.updateStatusBarChart = function(statusResults){

      // set scope variable for amount of active channels
      $scope.activeChannels = statusResults.length;

      var channelsMap;

      // create channelsMap for status name reference
      Api.Channels.query(function(channels){
        channelsMap = {};
        angular.forEach(channels, function(channel){
          channelsMap[channel._id] = channel.name;
        });

        // define varables for graph data set
        var objectData;
        var statusData = [];
        var statusKeys = [];
        var statusLabels = [];
        var statusColors = [];

        // loop through each channels found in result and construct graph objects
        for ( var i=0; i<statusResults.length; i++ ){

          objectData = {};

          // create a link object for when the user clicks on the bar
          objectData.link = 'channels/'+statusResults[i]._id.channelID;
          objectData.channel = channelsMap[statusResults[i]._id.channelID];

          // check if Processing status has any records
          if ( statusResults[i].processing !== 0 ){
            objectData.processing = statusResults[i].processing;

            // only add these if it isnt yet present
            if ( statusKeys.indexOf('processing') === -1 ){
              statusKeys.push('processing');
              statusLabels.push('Processing');
              statusColors.push('#777777');
            }
          }

          // check if Failed status has any records
          if ( statusResults[i].failed !== 0 ){
            objectData.failed = statusResults[i].failed;

            // only add these if it isnt yet present
            if ( statusKeys.indexOf('failed') === -1 ){
              statusKeys.push('failed');
              statusLabels.push('Failed');
              statusColors.push('#d9534f');
            }
          }

          // check if Completed status has any records
          if ( statusResults[i].completed !== 0 ){
            objectData.completed = statusResults[i].completed;

            // only add these if it isnt yet present
            if ( statusKeys.indexOf('completed') === -1 ){
              statusKeys.push('completed');
              statusLabels.push('Completed');
              statusColors.push('#f0ad4e');
            }
          }

          // check if Completed with error(s) status has any records
          if ( statusResults[i].completedWErrors !== 0 ){
            objectData.completedWErrors = statusResults[i].completedWErrors;

            // only add these if it isnt yet present
            if ( statusKeys.indexOf('completedWErrors') === -1 ){
              statusKeys.push('completedWErrors');
              statusLabels.push('Completed With Errors');
              statusColors.push('#5bc0de');
            }
          }

          // check if Successful status has any records
          if ( statusResults[i].successful !== 0 ){
            objectData.successful = statusResults[i].successful;

            // only add these if it isnt yet present
            if ( statusKeys.indexOf('successful') === -1 ){
              statusKeys.push('successful');
              statusLabels.push('Successful');
              statusColors.push('#5cb85c');
            }
          }

          // push objectData to main statusData object
          statusData.push(objectData);

        }

        $scope.statusData = {data: statusData, xkey: 'channel', ykeys: statusKeys, labels: statusLabels, colors: statusColors, stacked: true,};

      },
      function(err){
        Alerting.AlertAddMsg('status', 'danger', 'Channel Load Error: ' + err.status + ' ' + err.data);
      });

    };

    $scope.statusMetricsSuccess = function(statusResults){
      if ( statusResults.length === 0 ){
        Alerting.AlertAddMsg('status', 'warning', 'There has been no transactions received for today');
      }else{
        $scope.updateStatusBarChart(statusResults);
      }
    };

    $scope.statusMetricsError = function(err){
      // add warning message when unable to get data
      Alerting.AlertAddMsg('status', 'danger', 'Transaction Load Error: ' + err.status + ' ' + err.data);
    };

    $scope.getStatusMetrics = function(){
      // reset any load metric alert warnings
      Alerting.AlertReset('status');

      var startDate = moment().startOf('day').toDate();
      var endDate = moment().startOf('hour').add(1, 'hours').toDate();

      // do API call here to pull load metrics
      Api.MetricsStatus.query({
        startDate: startDate,
        endDate: endDate
      }, $scope.statusMetricsSuccess, $scope.statusMetricsError);
    };

    // do the inital load of the transaction status metrics
    $scope.getStatusMetrics();

    /********************************************************************/
    /**         Channel Transactions Status Metric Functions           **/
    /********************************************************************/


    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      if (angular.isDefined(dashboardInterval)) {
        $interval.cancel(dashboardInterval);
        dashboardInterval = undefined;
      }
    });


  });
