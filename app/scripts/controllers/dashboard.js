'use strict';
/* global jQuery:false */
/* global Morris:false */
/* global moment:false */


angular.module('openhimWebui2App')
	.controller('DashboardCtrl', function ($scope, $modal, $location, $interval, Api, Alerting) {

		/***************************************************/
		/**         Initial page load functions           **/
		/***************************************************/

		// Anything needed here?

		var dashboardInterval = $interval(function() {
			//$scope.getTransactionLoadMetrics();
			$scope.getLoadTimeMetrics();
			$scope.getStatusMetrics();
		}, 5000);


		//location provider - load transaction details
		$scope.viewChannelDetails = function (path) {
			var url = window.location.href+path;
			window.location = url;
		};

		/***************************************************/
		/**         Initial page load functions           **/
		/***************************************************/



		/*********************************************************/
		/**         Transaction Load Metric Functions           **/
		/*********************************************************/

		$scope.updateTransactionLoadLineChart = function(loadTimeResults){

			var value = 0;
			var hour;
			var transactionLoadData = [];
			$scope.loadTotal = 0;
			for ( var i=1; i<=moment().add(1, 'hours').format('H'); i++ ){

				value = 0;
				// needs to be in date format
				hour = moment().format('YYYY-MM-DD')+' '+i+':00';
				for ( var x=0; x<loadTimeResults.length; x++ ){
					var date = new Date( loadTimeResults[x].timestamp );

					// check if the result has value for current hour in the loop
					// add one hour to simulate transactions for the end of the hour and not in the hour
					if ( moment(date).add(1, 'hours').format('H') === moment(hour).format('H') ){
						value = loadTimeResults[x].load;
					}
				}

				$scope.loadTotal += value;
				transactionLoadData.push({ hour: hour, value: value });
			}

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

		/*********************************************************/
		/**         Transaction Load Metric Functions           **/
		/*********************************************************/



		/******************************************************************/
		/**         Transaction Response Time Metric Functions           **/
		/******************************************************************/

		$scope.updateResponseTimeLineChart = function(loadTimeResults){

			var value = 0;
			var hour;
			var avgResponseTimeTotal = 0;
			var responseTimeData = [];
			$scope.avgResponseTime = 0;
			
			for ( var i=1; i<=moment().add(1, 'hours').format('H'); i++ ){

				value = 0;
				// needs to be in date format
				hour = moment().format('YYYY-MM-DD')+' '+i+':00';
				for ( var x=0; x<loadTimeResults.length; x++ ){
					var date = new Date( loadTimeResults[x].timestamp );
					// check if the result has value for current hour in the loop
					if ( moment(date).add(1, 'hours').format('H') === moment(hour).format('H') ){
						value = loadTimeResults[x].avgResp;
						avgResponseTimeTotal += value;
					}
				}

				//value = Math.floor((Math.random() * 100) + 1);
				$scope.avgResponseTime += value;
				responseTimeData.push({ hour: hour, value: value.toFixed(2) });
			}

			$scope.avgResponseTime = (avgResponseTimeTotal / loadTimeResults.length).toFixed(2);

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

		/******************************************************************/
		/**         Transaction Response Time Metric Functions           **/
		/******************************************************************/



		/************************************************************/
		/**         Transaction Load/Time Metric REQUEST           **/
		/************************************************************/

		$scope.getLoadTimeMetrics = function(){
			// reset any load metric alert warnings
			Alerting.AlertReset('load');
			Alerting.AlertReset('responseTime');

			var startDate = moment().startOf('day').toDate();
			var endDate = moment().startOf('hour').add(1, 'hours').toDate();

			// do API call here to pull load metrics
			Api.Metrics.query({
				startDate: startDate,
				endDate: endDate
			}, $scope.loadTimeMetricsSuccess, $scope.loadTimeMetricsError);
		};

		$scope.loadTimeMetricsSuccess = function(loadTimeResults){

			if ( loadTimeResults.length === 0 ){
				Alerting.AlertAddMsg('load', 'warning', 'There has been no transactions received for today');
				Alerting.AlertAddMsg('responseTime', 'warning', 'There has been no transactions received for today');
			}else{
				$scope.updateTransactionLoadLineChart(loadTimeResults);
				$scope.updateResponseTimeLineChart(loadTimeResults);
			}

		};

		$scope.loadTimeMetricsError = function(err){
			// add warning message when unable to get data
			Alerting.AlertAddMsg('load', 'danger', 'Transaction Load Error: ' + err.status + ' ' + err.data);
			Alerting.AlertAddMsg('responseTime', 'danger', 'Transaction Response Time Error: ' + err.status + ' ' + err.data);
		};

		$scope.getLoadTimeMetrics();

		/************************************************************/
		/**         Transaction Load/Time Metric REQUEST           **/
		/************************************************************/





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
				var objectData = {};
				var statusData = [];
				var statusKeys = [];
				var statusLabels = [];
				var statusColors = [];

				// loop through each channels found in result and construct graph objects
				for ( var i=0; i<statusResults.length; i++ ){

					objectData.channelLink = statusResults[i]._id.channelID;
					objectData.channel = channelsMap[statusResults[i]._id.channelID];

					// check if Processing status has any records
					if ( statusResults[i]._id.status === 'Processing' ){
						objectData.processing = statusResults[i].transactionCount;
						statusKeys.push('processing');
						statusLabels.push('Processing');
						statusColors.push('#777777');
					}

					// check if Failed status has any records
					if ( statusResults[i]._id.status === 'Failed' ){
						objectData.failed = statusResults[i].transactionCount;
						statusKeys.push('failed');
						statusLabels.push('Failed');
						statusColors.push('#d9534f');
					}

					// check if Completed status has any records
					if ( statusResults[i]._id.status === 'Completed' ){
						objectData.completed = statusResults[i].transactionCount;
						statusKeys.push('completed');
						statusLabels.push('Completed');
						statusColors.push('#f0ad4e');
					}

					// check if Completed with error(s) status has any records
					if ( statusResults[i]._id.status === 'Completed with error(s)' ){
						objectData.completedWErrors = statusResults[i].transactionCount;
						statusKeys.push('completedWErrors');
						statusLabels.push('Completed With Errors');
						statusColors.push('#5bc0de');
					}

					// check if Successful status has any records
					if ( statusResults[i]._id.status === 'Successful' ){
						objectData.successful = statusResults[i].transactionCount;
						statusKeys.push('successful');
						statusLabels.push('Successful');
						statusColors.push('#5cb85c');
					}

					// push objectData to main statusData object
					statusData.push(objectData);

				}

				// if chart object exist then set new data
				if ($scope.statusBarChart){
					$scope.statusBarChart.setData(statusData, statusKeys, statusLabels, statusColors);
				}else{
					createStatusBarChart(statusData, statusKeys, statusLabels, statusColors);
				}

	    },
	    function(){
	      // server error - could not connect to API to get channels
	    });

		};

		var createStatusBarChart = function(statusData, statusKeys, statusLabels, statusColors){
			// check if graph element exist before creating
			if ( jQuery('#response-time-graph:visible').length ){

				// create the status bar graph
				$scope.statusBarChart = Morris.Bar({
					element: 'transaction-status-graph',
					data: statusData,
					xkey: 'channel',
					ykeys: statusKeys,
					stacked: true,
					resize: true,
					hideHover: 'auto',
					labels: statusLabels,
					barColors: statusColors
				}).on('click', function(i, row){
					// on status click direct user to channel metrics page
					$scope.viewChannelDetails('channels/'+row.channelLink);
				});

			}
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