'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionsCtrl', function ($scope, Api) {
    $scope.transactions = Api.Transactions.query();
  });
