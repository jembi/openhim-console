'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionsCtrl', function ($scope, $location, Api) {

  	//return results for the first page (20 results)
  	$scope.showpage = 0;
  	$scope.showlimit = 5;

  	//setup filter options
	$scope.returnFilterObject = function(){
		var filterStatus = jQuery("#filterStatus").val();
		var filterEndpoint = jQuery("#filterEndpoint").val();
		var filterDateStart = jQuery("#filterDateStart").val();
		var filterDateEnd = jQuery("#filterDateEnd").val();
		var filterShowPage = $scope.showpage;
		var filterShowLimit = $scope.showlimit;
		

		return {'filterStatus': filterStatus, 
				'filterEndpoint': filterEndpoint, 
				'filterDateStart': filterDateStart, 
				'filterDateEnd': filterDateEnd, 
				'filterShowPage': filterShowPage, 
				'filterShowLimit': filterShowLimit};
	}

	//location provider - load transaction details
	$scope.viewTransactionDetails = function (path) { 
		$location.path(path);
	}

	//Refresh transactions list
	$scope.refreshTransactionsList = function () { 
		//reset the showpage filter to start at 0
		$scope.showpage = 0;
		//Show the load more button again if hidden
		jQuery('#loadMoreTransactions').show();
		//close message box if it is visible
		$scope.alerts = '';

		Api.Transactions.query( $scope.returnFilterObject(), function (values) {
			// on success
			$scope.transactions = values;

			if( values.length < $scope.showlimit ){
				jQuery('#loadMoreTransactions').hide();

				if( values.length == 0 ){
					$scope.alerts = [{ type: '', msg: 'There are no transactions for the current filters' }];
				}
				
			}

		},
		function () {
			// on error - Hide load more button and show error message
			jQuery('#loadMoreTransactions').hide();
			$scope.alerts = [{ type: 'danger', msg: 'The request could not connect to the API server. Please contact server administrator' }];
		});

		//$scope.$apply();
						
	}
	//run the transaction list view for the first time
	$scope.refreshTransactionsList();

	//Refresh transactions list
	$scope.loadMoreTransactions = function () { 
		$scope.showpage++;

		Api.Transactions.query( $scope.returnFilterObject(), function (values) {
			// on success
			$scope.transactions = $scope.transactions.concat(values);

			if( values.length < $scope.showlimit ){
				jQuery('#loadMoreTransactions').hide();
				$scope.alerts = [{ type: '', msg: 'There are no more transactions to retrieve' }];
			}

		},
		function () {
			// on error - Hide load more button and show error message
			jQuery('#loadMoreTransactions').hide();
			$scope.alerts = [{ type: 'danger', msg: 'The request could not connect to the API server. Please contact server administrator' }];
		});

		//$scope.$apply();

	}

	$scope.closeMsg = function(index) {
		$scope.alerts = '';
	}

  });