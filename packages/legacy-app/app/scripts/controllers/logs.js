import moment from 'moment'

export function LogsCtrl ($scope, $location, Api) {
  function formatLog (log) {
    return moment(log.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS') + ' - ' + log.level + ': [' + log.label + '] ' + log.message + '\n'
  }

  let lastFetch
  const locParams = $location.search()
  $scope.params = angular.equals({}, locParams) ? { level: 'info' } : locParams
  $scope.logs = ''
  let linesAdded = 0

  if ($scope.params.from || $scope.params.until) {
    $scope.autoupdate = false
    $scope.tailLogs = false
  } else {
    $scope.autoupdate = true
    $scope.tailLogs = true
  }

  // fetch initial logs
  $scope.logs = ''
  lastFetch = new Date()

  let fromDate, untilDate
  if ($scope.params.from && $scope.params.from.length > 0) {
    fromDate = moment($scope.params.from).format()
  }
  if ($scope.params.until && $scope.params.until.length > 0) {
    untilDate = moment($scope.params.until).format()
  }

  const localParam = {
    from: fromDate,
    until: untilDate,
    level: $scope.params.level
  }
  if (!$scope.params.until) {
    localParam.until = lastFetch.toISOString()
  }
  Api.Logs.query(localParam, function (results) {
    results.forEach(function (log) {
      $scope.logs += formatLog(log)
    })
  })

  function fetchMoreLogs () {
    const now = new Date()
    const localParam = {
      from: new Date(lastFetch).toISOString(),
      until: now.toISOString(),
      level: $scope.params.level
    }
    lastFetch = now
    Api.Logs.query(localParam, function (results) {
      results.forEach(function (log) {
        $scope.logs += formatLog(log)
        linesAdded++
        if (linesAdded > 10000) {
          // Prevent logs string from growing too much, remove from front
          $scope.logs = $scope.logs.substring($scope.logs.indexOf('\n') + 1)
        }
      })
    })
  }

  const autoUpdateInterval = setInterval(function () {
    if ($scope.autoupdate) {
      fetchMoreLogs()
    }
  }, 1000)

  const scrollInterval = setInterval(function () {
    if ($scope.tailLogs === true) {
      const textarea = document.getElementById('textarea')
      // scroll to bottom
      textarea.scrollTop = textarea.scrollHeight
    }
  }, 50)

  $scope.reload = function () {
    // sync params with location, this reloads the controller
    $location.search($scope.params)
  }

  $scope.$on('$locationChangeStart', function () {
    // clear existing intervals whenever the location is changed
    clearInterval(autoUpdateInterval)
    clearInterval(scrollInterval)
  })

  $scope.reset = function () {
    delete $scope.params.from
    delete $scope.params.until
    $scope.params.level = 'info'
    $scope.reload()
  }
}
