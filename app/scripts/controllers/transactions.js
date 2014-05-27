'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionsCtrl', function ($scope, $location, Api) {
    $scope.transactions = Api.Transactions.query();

	//Refresh transactions list
	$scope.refreshTransactionsList = function () { 
		$scope.transactions = Api.Transactions.query();
		$scope.$apply();
	}

	//location provider - load transaction details
	$scope.viewTransactionDetails = function (path) { 
		$location.path(path);
	}

  });