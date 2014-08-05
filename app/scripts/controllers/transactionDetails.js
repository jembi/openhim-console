'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionDetailsCtrl', function ($scope, $modal, $location, $routeParams, Api, Alerting) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    var querySuccess = function(transactionDetails){
      $scope.transactionDetails = transactionDetails;
      
      // get the channel object for the transactions details page
      $scope.channel = Api.Channels.get({ channelId: transactionDetails.channelID });

      // get the client object for the transactions details page
      $scope.client = Api.Clients.get({ clientId: transactionDetails.clientID });

    };

    var queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    //get the Data for the supplied ID and store in 'transactionsDetails' object
    Api.Transactions.get({ transactionId: $routeParams.transactionId }, querySuccess, queryError);

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/



    /*******************************************************************/
    /**         Transactions List and Detail view functions           **/
    /*******************************************************************/

    //setup filter options
    $scope.returnFilterObject = function(){
      var filtersObject = {};
      
      filtersObject.filterPage = 0;
      filtersObject.filterLimit = 0;
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

    /*******************************************************************/
    /**         Transactions List and Detail view functions           **/
    /*******************************************************************/



    /****************************************************************/
    /**               Transactions ReRun Functions                 **/
    /****************************************************************/

    $scope.confirmRerunTransactions = function(){
      var transactionsSelected = [$scope.transactionDetails._id];
      var rerunTransactionsSelected = 0;

      if ($scope.transactionDetails.parentID){
        rerunTransactionsSelected = 1;
      }
      
      $modal.open({
        templateUrl: 'views/transactionsRerunModal.html',
        controller: 'TransactionsRerunModalCtrl',
        resolve: {
          transactionsSelected: function () {
            return transactionsSelected;
          },
          rerunTransactionsSelected: function () {
            return rerunTransactionsSelected;
          }
        }
      });
    };

    /****************************************************************/
    /**               Transactions ReRun Functions                 **/
    /****************************************************************/



    /*********************************************************************/
    /**               Transactions View Route Functions                 **/
    /*********************************************************************/

    $scope.viewRouteDetails = function(route){
      $modal.open({
        templateUrl: 'views/transactionsRouteModal.html',
        controller: 'TransactionsRouteModalCtrl',
        resolve: {
          route: function () {
            return route;
          }
        }
      });
    };

    /*********************************************************************/
    /**               Transactions View Route Functions                 **/
    /*********************************************************************/

  });
