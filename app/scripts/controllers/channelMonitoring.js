import moment from 'moment'

export function ChannelMonitoringCtrl ($scope, $uibModal, $interval, $location, $routeParams, Api, Alerting, Metrics) {
  let noDataErrorMsg = 'There has been no transactions received for the queried timeframe'

  let channelSuccess = function (channel) {
    $scope.channel = channel
  }

  let channelError = function (err) {
		// on error - add server error alert
    Alerting.AlertAddServerMsg(err.status)
  }

	// get the Data for the supplied ID and store in 'transactionsDetails' object
  Api.Channels.get({ channelId: $routeParams.channelId }, channelSuccess, channelError)

  $scope.selectedDateType = {
    period: '1d'
  }

  let dashboardInterval = $interval(function () {
    $scope.updateMetrics()
  }, 5000)

  function loadMetricsSuccess (metrics) {
    if (metrics.length === 0) {
      Alerting.AlertAddMsg('load', 'warning', noDataErrorMsg)
      Alerting.AlertAddMsg('responseTime', 'warning', noDataErrorMsg)
    } else {
      let round = function (d) {
        return (d).toFixed(2)
      }
      $scope.transactionLoadData = Metrics.buildLineChartData($scope.selectedDateType, metrics, 'total', 'Transactions')
      $scope.transactionResponseTimeData = Metrics.buildLineChartData($scope.selectedDateType, metrics, 'avgResp', 'Response Time (ms)', round)
    }
  }

  function loadMetricsError (err) {
		// add warning message when unable to get data
    Alerting.AlertAddMsg('load', 'danger', 'Transaction Load Error: ' + err.status + ' ' + err.data)
    Alerting.AlertAddMsg('responseTime', 'danger', 'Transaction Load Error: ' + err.status + ' ' + err.data)
  }

  function updateTimeseriesMetrics () {
    Api.MetricsTimeseriesChannel.query({
      type: $scope.selectedDateType.type,
      channelId: $routeParams.channelId,
      startDate: moment($scope.selectedDateType.from).format(),
      endDate: moment($scope.selectedDateType.until).format()
    }, loadMetricsSuccess, loadMetricsError)
  }

  let updateChannelsBarChart = function (channelsData) {
		// construct channels bar object for morris
    let channelsBarData = []
    for (let i = 0; i < channelsData.length; i++) {
      channelsBarData.push({ label: channelsData[i].label, value: channelsData[i].value })
    }
    $scope.channelsBarData = { data: channelsBarData, xkey: 'label', ykeys: ['value'], labels: ['Total'] }
  }

  let updateChannelsDonutChart = function (channelsData) {
    let channelsDonutData = []
    let channelsDonutColors = []
    for (let i = 0; i < channelsData.length; i++) {
      channelsDonutData.push({ label: channelsData[i].label, value: channelsData[i].percent })
      channelsDonutColors.push(channelsData[i].color)
    }
    $scope.channelsDonutData = { data: channelsDonutData, colors: channelsDonutColors }
  }

  let channelsMetricsSuccess = function (channelsResults) {
    if (channelsResults.length === 0) {
      Alerting.AlertAddMsg('status', 'warning', noDataErrorMsg)
    } else {
      let channelsData = []
      let totalTransactions = 0
      let value, percent

      totalTransactions += parseInt(channelsResults[0].processing)
      totalTransactions += parseInt(channelsResults[0].failed)
      totalTransactions += parseInt(channelsResults[0].completed)
      totalTransactions += parseInt(channelsResults[0].completedWErrors)
      totalTransactions += parseInt(channelsResults[0].successful)

      if (parseInt(channelsResults[0].processing) !== 0) {
        value = parseInt(channelsResults[0].processing)
        percent = (100 / totalTransactions * value).toFixed(2)
        channelsData.push({ label: 'Processing', value: value, percent: percent, color: '#777777' })
      }

      if (parseInt(channelsResults[0].failed) !== 0) {
        value = parseInt(channelsResults[0].failed)
        percent = (100 / totalTransactions * value).toFixed(2)
        channelsData.push({ label: 'Failed', value: value, percent: percent, color: '#d9534f' })
      }

      if (parseInt(channelsResults[0].completed) !== 0) {
        value = parseInt(channelsResults[0].completed)
        percent = (100 / totalTransactions * value).toFixed(2)
        channelsData.push({ label: 'Completed', value: value, percent: percent, color: '#f0ad4e' })
      }

      if (parseInt(channelsResults[0].completedWErrors) !== 0) {
        value = parseInt(channelsResults[0].completedWErrors)
        percent = (100 / totalTransactions * value).toFixed(2)
        channelsData.push({ label: 'Completed With Error (s)', value: value, percent: percent, color: '#5bc0de' })
      }

      if (parseInt(channelsResults[0].successful) !== 0) {
        value = parseInt(channelsResults[0].successful)
        percent = (100 / totalTransactions * value).toFixed(2)
        channelsData.push({ label: 'Successful', value: value, percent: percent, color: '#5cb85c' })
      }

      updateChannelsBarChart(channelsData)
      updateChannelsDonutChart(channelsData)
    }
  }

  let channelsMetricsError = function (err) {
		// add warning message when unable to get data
    Alerting.AlertAddMsg('status', 'danger', 'Transaction Channels Error: ' + err.status + ' ' + err.data)
  }

  function updateChannelsMetrics () {
    Api.MetricsChannels.query({
      channelId: $routeParams.channelId,
      startDate: moment($scope.selectedDateType.from).format(),
      endDate: moment($scope.selectedDateType.until).format()
    }, channelsMetricsSuccess, channelsMetricsError)
  }

  $scope.updateMetrics = function () {
    Alerting.AlertReset('load')
    Alerting.AlertReset('responseTime')
    Alerting.AlertReset('status')

    Metrics.refreshDatesForSelectedPeriod($scope.selectedDateType)
    updateTimeseriesMetrics()
    updateChannelsMetrics()
  }

  $scope.updateMetrics()

  $scope.$on('$destroy', function () {
		// Make sure that the interval is destroyed too
    if (angular.isDefined(dashboardInterval)) {
      $interval.cancel(dashboardInterval)
      dashboardInterval = undefined
    }
  })
}
