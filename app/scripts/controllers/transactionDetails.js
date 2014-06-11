'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionDetailsCtrl', function ($scope, $routeParams, Api) {

    //get the Data for the supplied ID and store in 'transactionsDetails' object
    $scope.transactionDetails = Api.Transactions.get({ transactionId: $routeParams.transactionId });

  });
