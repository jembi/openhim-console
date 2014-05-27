'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionDetailsCtrl', function ($scope, $routeParams, Api) {

    //get the Data for the supplied ID and store in 'transactionsDetails' object
    $scope.transactionDetails = Api.Transactions.get({ transactionId: $routeParams.transactionId });



    $scope.rerunEditTransaction = function(transactionDetails) {
      alert( 'Function to Re-run and edit Transaction' );
    };

    $scope.reviewedTransaction = function(transactionDetails) {
      alert( 'Function to mark Transaction as reviewed' );
    };

    $scope.flagTransaction = function(transactionDetails) {
      alert( 'Function to Flag Transaction' );
    };

  });
