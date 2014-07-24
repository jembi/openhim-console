'use strict';
/* global jQuery:false */

angular.module('openhimWebui2App')
  .controller('TransactionsCtrl', function ($scope, $modal, $location, Api) {



    $scope.transactionsSelected = [];

    //return results for the first page (20 results)
    $scope.showpage = 0;
    $scope.showlimit = 10;
    $scope.filterStatus = '';
    $scope.filterEndpoint = '';
    $scope.filterDateStart = '';
    $scope.filterDateEnd = '';

    /*------------------------Transactions List and Detail view functions----------------------------*/
    //setup filter options
    $scope.returnFilterObject = function(){
      var filtersObject = {};
      var startDate, endDate;

      var filterStatus = $scope.filterStatus;
      var filterEndpoint = $scope.filterEndpoint;
      var filterDateStart = $scope.filterDateStart;
      var filterDateEnd = $scope.filterDateEnd;

      if(filterStatus){ filtersObject.status = filterStatus; }
      if(filterEndpoint){ filtersObject.endpoint = filterEndpoint; }
      if(filterDateStart && filterDateEnd){
        startDate = new Date( filterDateStart ).toISOString();
        endDate = new Date( filterDateEnd );
        endDate.setDate(endDate.getDate() + 1);
        endDate = endDate.toISOString();

        filtersObject.startDate = startDate;
        filtersObject.endDate = endDate;
      }
      filtersObject.filterPage = $scope.showpage;
      filtersObject.filterLimit = $scope.showlimit;

      return filtersObject;
    };

    //Refresh transactions list
    $scope.refreshTransactionsList = function () {
      //reset the showpage filter to start at 0
      $scope.showpage = 0;
      //close message box if it is visible
      $scope.alerts = '';

      Api.Transactions.query( $scope.returnFilterObject(), function (values) {
        // on success
        $scope.transactions = values;

        if( values.length < $scope.showlimit ){
          jQuery('#loadMoreTransactions').hide();

          if( values.length === 0 ){
            $scope.alerts = [{ type: 'warning', msg: 'There are no transactions for the current filters' }];
          }

        }else{
          //Show the load more button
          jQuery('#loadMoreTransactions').show();
        }

        //make sure newly added transactions are checked as well
        $scope.resetCheckedItems();

      },
      function (err) {
        // on error - Hide load more button and show error message
        jQuery('#loadMoreTransactions').hide();
        $scope.returnError(err.status);
      });

    };
    //run the transaction list view for the first time
    $scope.refreshTransactionsList();

    //Refresh transactions list
    $scope.loadMoreTransactions = function () {
      $scope.showpage++;

      Api.Transactions.query( $scope.returnFilterObject(), function (values) {
        //on success
        $scope.transactions = $scope.transactions.concat(values);
        //remove any duplicates objects found in the transactions scope
        $scope.transactions = jQuery.unique($scope.transactions);

        if( values.length < $scope.showlimit ){
          jQuery('#loadMoreTransactions').hide();
          $scope.alerts = [{ type: 'warning', msg: 'There are no more transactions to retrieve' }];
        }

        //make sure newly added transactions are checked as well
        $scope.toggleCheckedAll();

      },
      function (err) {
        // on error - Hide load more button and show error message
        jQuery('#loadMoreTransactions').hide();
        $scope.returnError(err.status);
      });

    };

    //location provider - load transaction details
    $scope.viewTransactionDetails = function (path, $event) {
      //do transactions details redirection when clicked on TD
      if( $event.target.tagName === 'TD' ){
        $location.path(path);
      }
    };
    /*------------------------Transactions List and Detail view functions----------------------------*/


    /*------------------------Error Codes functions----------------------------*/
    //close the alert box
    $scope.closeMsg = function() { $scope.alerts = ''; };

    //Function to generate server response errors
    $scope.returnError = function(errCode){
      switch (errCode){
        case 401:
          $scope.alerts = [{ type: 'danger', msg: 'Authentication is required to connect to the server. Please contact the server administrator' }];
          break;
        case 403:
          $scope.alerts = [{ type: 'danger', msg: 'The request has been forbidden by the server. Please contact the server administrator' }];
          break;
        case 404:
          $scope.alerts = [{ type: 'danger', msg: 'The request could not connect to the API server. Please contact the server administrator' }];
          break;
      }
    };
    /*------------------------Error Codes functions----------------------------*/

    

    /*------------------------Transactions ReRun Functions----------------------------*/
    $scope.confirmRerunTransactions = function(){
      
      var transactionsSelected = $scope.transactionsSelected;
      $modal.open({
        templateUrl: 'views/transactionsmodal.html',
        controller: 'TransactionsModalCtrl',
        scope: $scope,
        resolve: {
          transactionsSelected: function () {
            return transactionsSelected;
          }
        }

      });

    };

    $scope.toggleCheckedAll = function () {
      //if checked for all
      if( $scope.checkAll === true ){
        $scope.transactionsSelected = [];
        angular.forEach($scope.transactions, function(transaction){
          //only allow original transactions to be rerun - Check that parentID doesnt exist
          if( !transaction.parentID ){
            $scope.transactionsSelected.push(transaction._id);
          }
        });
      }else{
        $scope.resetCheckedItems();
      }
    };

    $scope.toggleTransactionSelection = function(transactionID) {
      var idx = $scope.transactionsSelected.indexOf(transactionID);

      // is currently selected
      if (idx > -1) {
        $scope.transactionsSelected.splice(idx, 1);
      }else {
        // is newly selected
        $scope.transactionsSelected.push(transactionID);
      }
    };

    $scope.resetCheckedItems = function(){
      $scope.transactionsSelected = [];
      $scope.checkAll = false;
    };

    $scope.$on('transactionRerunSuccess', function() {
      $scope.refreshTransactionsList();
    });
    /*------------------------Transactions ReRun Functions----------------------------*/




      $scope.alerting = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
      ];

      $scope.addAlert = function() {
        $scope.alerting.push({msg: 'Another alert!'});
      };

      $scope.closeAlert = function(index) {
        $scope.alerting.splice(index, 1);
      };



  });