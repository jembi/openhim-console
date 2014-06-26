'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionDetailsCtrl', function ($scope, $modal, $routeParams, Api) {

    //get the Data for the supplied ID and store in 'transactionsDetails' object
    $scope.transactionDetails = Api.Transactions.get({ transactionId: $routeParams.transactionId });

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

    }
    /*------------------------Transactions ReRun Functions----------------------------*/

  });
