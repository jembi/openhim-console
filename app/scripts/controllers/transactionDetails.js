'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionDetailsCtrl', function ($scope, $modal, $location, $routeParams, Api) {

    //get the Data for the supplied ID and store in 'transactionsDetails' object
    $scope.transactionDetails = Api.Transactions.get({ transactionId: $routeParams.transactionId });

    /*------------------------Transactions List and Detail view functions----------------------------*/
    //setup filter options
    $scope.returnFilterObject = function(){
      var filtersObject = {};
      
      filtersObject.filterPage = 0;
      filtersObject.filterLimit = 9999999;
      filtersObject.parentID = $routeParams.transactionId;
      return filtersObject;
    };

    //Refresh transactions list
    $scope.fetchChildTransactions = function () {

      Api.Transactions.query( $scope.returnFilterObject(), function (values) {
        // on success
        $scope.childTransactions = values;
      },
      function (err) {
        $scope.returnError(err.status);
      });

    };
    //run the transaction list view for the first time
    $scope.fetchChildTransactions();


    //location provider - load transaction details
    $scope.viewTransactionDetails = function (path) {
      //do transactions details redirection when clicked on TD
      $location.path(path);
    };
    /*------------------------Transactions List and Detail view functions----------------------------*/


    /*------------------------Transactions ReRun Functions----------------------------*/
    $scope.confirmRerunTransactions = function(){
      
      var transactionsSelected = [$scope.transactionDetails._id];
      $modal.open({
        templateUrl: 'views/transactionsmodal.html',
        controller: 'TransactionsModalCtrl',
        resolve: {
          transactionsSelected: function () {
            return transactionsSelected;
          }
        }

      });

    };
    /*------------------------Transactions ReRun Functions----------------------------*/

  });
