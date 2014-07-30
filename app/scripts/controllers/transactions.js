'use strict';
/* global jQuery:false */

angular.module('openhimWebui2App')
  .controller('TransactionsCtrl', function ($scope, $modal, $location, Api, Alerting) {

    // get the channels for the transactions filter dropdown
    $scope.channels = Api.Channels.query(function(){
      $scope.channelsMap = {};
      angular.forEach($scope.channels, function(channel){
        $scope.channelsMap[channel._id] = channel.name;
      });
    },
    function(){
      // server error - could not connect to API to get channels
    });

    $scope.transactionsSelected = [];

    //return results for the first page (20 results)
    $scope.showpage = 0;
    $scope.showlimit = 10;
    $scope.filterStatus = '';
    $scope.filterChannel = '';
    $scope.filterDateStart = '';
    $scope.filterDateEnd = '';

    /*------------------------Transactions List and Detail view functions----------------------------*/
    //setup filter options
    $scope.returnFilterObject = function(){
      var filtersObject = {};
      var startDate, endDate;

      var filterStatus = $scope.filterStatus;
      var filterChannel = $scope.filterChannel;
      var filterDateStart = $scope.filterDateStart;
      var filterDateEnd = $scope.filterDateEnd;

      if(filterStatus){ filtersObject.status = filterStatus; }
      if(filterChannel){ filtersObject.channelID = filterChannel; }
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

    var refreshSuccess = function (transactions){
      // on success
      $scope.transactions = transactions;

      if( transactions.length < $scope.showlimit ){
        jQuery('#loadMoreTransactions').hide();

        if( transactions.length === 0 ){
          Alerting.AlertAddMsg('bottom', 'warning', 'There are no transactions for the current filters');
        }

      }else{
        //Show the load more button
        jQuery('#loadMoreTransactions').show();
      }

      //make sure newly added transactions are checked as well
      $scope.resetCheckedItems();
    };

    var refreshError = function(err){
      // on error - Hide load more button and show error message
        jQuery('#loadMoreTransactions').hide();
        Alerting.AlertAddServerMsg(err.status);
    };

    //Refresh transactions list
    $scope.refreshTransactionsList = function () {
      $scope.transactions = null;
      Alerting.AlertReset();

      //reset the showpage filter to start at 0
      $scope.showpage = 0;

      Api.Transactions.query( $scope.returnFilterObject(), refreshSuccess, refreshError);

    };
    //run the transaction list view for the first time
    $scope.refreshTransactionsList();

    //Refresh transactions list
    $scope.loadMoreTransactions = function () {
      $scope.busyLoadingMore = true;
      Alerting.AlertReset();

      $scope.showpage++;
      Api.Transactions.query( $scope.returnFilterObject(), loadMoreSuccess, loadMoreError);
    };

    var loadMoreSuccess = function (transactions){
      //on success
      $scope.transactions = $scope.transactions.concat(transactions);
      //remove any duplicates objects found in the transactions scope
      $scope.transactions = jQuery.unique($scope.transactions);

      if( transactions.length < $scope.showlimit ){
        jQuery('#loadMoreTransactions').hide();
        Alerting.AlertAddMsg('bottom', 'warning', 'There are no more transactions to retrieve');
      }

      //make sure newly added transactions are checked as well
      $scope.toggleCheckedAll();
      $scope.busyLoadingMore = false;
    };

    var loadMoreError = function(err){
      // on error - Hide load more button and show error message
      jQuery('#loadMoreTransactions').hide();
      Alerting.AlertAddServerMsg(err.status);
    };

    //location provider - load transaction details
    $scope.viewTransactionDetails = function (path, $event) {
      //do transactions details redirection when clicked on TD
      if( $event.target.tagName === 'TD' ){
        $location.path(path);
      }
    };
    
    //Clear filter data end refresh transactions scope
    $scope.clearFilters = function () {
      $scope.filterStatus = '';
      $scope.filterChannel = '';
      $scope.filterDateStart = '';
      $scope.filterDateEnd = '';

      //run the transaction list view after filters been cleared
      $scope.refreshTransactionsList();
    };
    /*------------------------Transactions List and Detail view functions----------------------------*/


    /*------------------------Transactions ReRun Functions----------------------------*/
    $scope.confirmRerunTransactions = function(){
      Alerting.AlertReset();
      
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

  });