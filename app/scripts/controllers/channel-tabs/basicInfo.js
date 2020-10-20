import { getTimeForTimezone, getTimezoneOffset } from '../../utils'

export function channelBasicInfoCtrl ($scope, $timeout, $interval, Api, Notify, Alerting) {
  const updateTime = function (timezone) {
    $scope.aboutInfo.serverTime = getTimeForTimezone(timezone)
  }

  const success = function (result) {
    $scope.aboutInfo = result
    $scope.aboutInfo.serverTimezoneOffset = getTimezoneOffset(result.serverTimezone)
    updateTime(result.serverTimezone)
    $scope.clock = $interval(function () {
      updateTime(result.serverTimezone)
    }, 1000)
  }

  const error = function (err) {
    Alerting.AlertAddServerMsg(err.status)
  }

  Api.About.get(success, error)

  const setUrlPattern = function () {
    $scope.channel.$promise.then(function () {
      // check if urlPattern has regex delimiters
      const urlPatternLength = $scope.channel.urlPattern.length
      if ($scope.channel.urlPattern.indexOf('^') === 0 && $scope.channel.urlPattern.indexOf('$') === urlPatternLength - 1) {
        const urlPattern = $scope.channel.urlPattern
        // remove delimiters
        $scope.channel.urlPattern = urlPattern.slice(1, -1)
      } else {
        // update checkbox if no regex delimiters
        $scope.urlPattern.regex = false
      }
    })
  }

  // Mannually Trigger Polling Channels
  $scope.manuallyTriggerChannel = function () {
    Alerting.AlertReset('manualTrigger')
    Api.TriggerPollingChannels.save({ channelId: $scope.channel._id }, { _id: $scope.channel._id }, function () {
      Alerting.AlertAddMsg('manualTrigger', 'success', 'Channel Triggered')
      $timeout(function () {
        Alerting.AlertReset('manualTrigger')
      }, 5000)
    })
  }

  // if update/channelDuplicate is true
  if ($scope.update || $scope.channelDuplicate) {
    setUrlPattern()
  } else {
    // set default options if new channel
    $scope.channel.type = 'http'
    $scope.channel.authType = 'private'
    $scope.channel.status = 'enabled'
  }

  $scope.$on('$destroy', function () {
    if (angular.isDefined($scope.clock)) {
      $interval.cancel($scope.clock)
    }
  })
}
