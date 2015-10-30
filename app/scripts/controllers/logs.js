'use strict';
/* global moment: false */

angular.module('openhimConsoleApp')
  .controller('LogsCtrl', function ($scope, Api) {
    function formatLog(log) {
      return new moment(log.timestamp).format('YYYY-MM-D HH:mm:ss.SSS') + ' - ' + log.level + ': [' + log.label + '] ' + log.message + '\n';
    }

    var lastFetch;
    $scope.params = { level: 'info', from: '', until: '' };
    $scope.logs = '';
    $scope.autoupdate = true;
    $scope.tailLogs = true;

    // fetch initial logs
    $scope.fetchNewLogs = function () {
      $scope.logs = '';
      lastFetch = new Date();

      var fromDate, untilDate;
      if ($scope.params.from.length > 0) {
        fromDate = moment($scope.params.from).format();
      }
      if ($scope.params.until.length > 0) {
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
      if ($scope.params.from || $scope.params.until) {
        $scope.autoupdate = false;
        $scope.tailLogs = false;
      } else {
        $scope.autoupdate = true;
      }
      Api.Logs.query(localParam, function (results) {
        results.forEach(function (log) {
          $scope.logs += formatLog(log);
        });
      });
    };

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

    $scope.fetchNewLogs();

    setInterval(function() {
      if ($scope.autoupdate) {
        fetchMoreLogs();
      }
    }, 1000);

    $scope.scrollToBottom = function() {
      if ($scope.tailLogs) {
        var textarea = document.getElementById('textarea');
        textarea.scrollTop = textarea.scrollHeight;
      }
    };

    setInterval($scope.scrollToBottom, 50);

    $scope.reset = function() {
      $scope.params.from = '';
      $scope.params.until = '';
      $scope.params.level = 'info';
      $scope.tailLogs = true;
      $scope.fetchNewLogs();
    };

  });
