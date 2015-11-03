'use strict';
/* global moment: false */

angular.module('openhimConsoleApp')
  .controller('LogsCtrl', function ($scope, $location, Api) {
    function formatLog(log) {
      return new moment(log.timestamp).format('YYYY-MM-D HH:mm:ss.SSS') + ' - ' + log.level + ': [' + log.label + '] ' + log.message + '\n';
    }

    var lastFetch;
    var locParams = $location.search();
    $scope.params = angular.equals({}, locParams) ? { level: 'info' } : locParams;
    $scope.logs = '';

    if ($scope.params.from || $scope.params.until) {
      $scope.autoupdate = false;
      $scope.tailLogs = false;
    } else {
      $scope.autoupdate = true;
      $scope.tailLogs = true;
    }

    // fetch initial logs
    $scope.logs = '';
    lastFetch = new Date();

    var fromDate, untilDate;
    if ($scope.params.from && $scope.params.from.length > 0) {
      fromDate = moment($scope.params.from).format();
    }
    if ($scope.params.until && $scope.params.until.length > 0) {
      untilDate = moment($scope.params.until).format();
    }

    var localParam = {
      from: fromDate,
      until: untilDate,
      level: $scope.params.level
    };
    if (!$scope.params.until) {
      localParam.until = lastFetch.toISOString();
    }
    Api.Logs.query(localParam, function (results) {
      results.forEach(function (log) {
        $scope.logs += formatLog(log);
      });
    });

    function fetchMoreLogs() {
      var now = new Date();
      var localParam = {
        from: new Date(lastFetch).toISOString(),
        until: now.toISOString(),
        level: $scope.params.level
      };
      lastFetch = now;
      Api.Logs.query(localParam, function (results) {
        results.forEach(function (log) {
          $scope.logs += formatLog(log);
        });
      });
    }

    var autoUpdateInterval = setInterval(function() {
      if ($scope.autoupdate) {
        fetchMoreLogs();
      }
    }, 1000);

    var scrollInterval = setInterval(function () {
      if ($scope.tailLogs === true) {
        var textarea = document.getElementById('textarea');
        // scroll to bottom
        textarea.scrollTop = textarea.scrollHeight;
      }
    }, 50);

    $scope.reload = function () {
      // sync params with location, this reloads the controller
      $location.search($scope.params);
    };

    $scope.$on('$locationChangeStart', function () {
      // clear existing intervals whenever the location is changed
      clearInterval(autoUpdateInterval);
      clearInterval(scrollInterval);
    });

    $scope.reset = function() {
      delete $scope.params.from;
      delete $scope.params.until;
      $scope.params.level = 'info';
      $scope.reload();
    };

  });
