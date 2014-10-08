'use strict';
/* global jQuery:false */
/* global moment:false */

angular.module('openhimWebui2App')
  .controller('TransactionsCtrl', function ($scope, $modal, $location, Api, Alerting) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);
    $scope.consoleSession = consoleSession;

    $scope.checkAll = false;
    $scope.transactionsSelected = [];
    $scope.rerunTransactionsSelected = 0;

    //return results for the first page (10 results)
    $scope.showpage = 0;
    $scope.showlimit = 10;


    // setup default transactions settings
    $scope.settings = {};
    $scope.settings.filter = {};
    $scope.settings.filter.limit = 10;
    $scope.settings.filter.status = '';
    $scope.settings.filter.channel = '';
    $scope.settings.filter.dateStart = '';
    $scope.settings.filter.dateEnd = '';
    $scope.settings.list = {};
    $scope.settings.list.tabview = 'same';
    // setup default transactions settings
    

    // get the user to find user roles
    Api.Users.get({ email: $scope.consoleSession.sessionUser } , function(user){
      // get the channels for the transactions filter dropdown
      $scope.channels = Api.Channels.query(function(){
        $scope.channelsMap = {};
        angular.forEach($scope.channels, function(channel){
          $scope.channelsMap[channel._id] = {};
          $scope.channelsMap[channel._id].name = channel.name;

          if ( user.groups.indexOf('admin') >= 0 ){
            $scope.rerunAllowedAdmin = true;
          }else{
            angular.forEach(user.groups, function(role){
              if ( channel.txRerunAcl.indexOf(role) >= 0 ){
                $scope.channelsMap[channel._id].rerun = true;
              }
            });
          }
        });
      }, function(){ /* server error - could not connect to API to get channels */ });
    }, function(){ /* server error - could not connect to API to get user details */ });

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/



    /*******************************************************************/
    /**         Transactions List and Detail view functions           **/
    /*******************************************************************/

    //setup filter options
    $scope.returnFilterObject = function(){
      var filtersObject = {};
      var startDate, endDate;

      var filterStatus = $scope.settings.filter.status;
      var filterChannel = $scope.settings.filter.channel;
      var filterDateStart = $scope.settings.filter.dateStart;
      var filterDateEnd = $scope.settings.filter.dateEnd;

      if(filterStatus){ filtersObject.status = filterStatus; }
      if(filterChannel){ filtersObject.channelID = filterChannel; }
      if(filterDateStart && filterDateEnd){
        startDate = moment(filterDateStart).format();
        endDate = moment(filterDateEnd).endOf('day').format();

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
      $scope.showlimit = $scope.settings.filter.limit;

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
        var baseUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#/';
        var txUrl = baseUrl + path;
        if ( $scope.settings.list.tabview && $scope.settings.list.tabview === 'new' ){
          window.open(txUrl, '_blank');
        }else{
          $location.path(path);
        }
      }
    };
    
    //Clear filter data end refresh transactions scope
    $scope.clearFilters = function () {
      $scope.settings.filter.limit = 10;
      $scope.settings.filter.status = '';
      $scope.settings.filter.channel = '';
      $scope.settings.filter.dateStart = '';
      $scope.settings.filter.dateEnd = '';
      $scope.settings.list.tabview = 'same';

      //run the transaction list view after filters been cleared
      $scope.refreshTransactionsList();
    };

    /*******************************************************************/
    /**         Transactions List and Detail view functions           **/
    /*******************************************************************/



    /****************************************************/
    /**         Transactions ReRun Functions           **/
    /****************************************************/
    
    $scope.confirmRerunTransactions = function(){
      Alerting.AlertReset();
      
      var transactionsSelected = $scope.transactionsSelected;
      var rerunTransactionsSelected = $scope.rerunTransactionsSelected;
      $modal.open({
        templateUrl: 'views/transactionsRerunModal.html',
        controller: 'TransactionsRerunModalCtrl',
        scope: $scope,
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
    
    $scope.toggleCheckedAll = function () {
      //if checked for all
      if( $scope.checkAll === true ){
        $scope.transactionsSelected = [];
        $scope.rerunTransactionsSelected = 0;
        angular.forEach($scope.transactions, function(transaction){

          // if admin user then all reruns allowed
          if ( $scope.rerunAllowedAdmin === true ){
            $scope.transactionsSelected.push(transaction._id);

            // check if transaction is a rerun
            if (transaction.childIDs){
              if (transaction.childIDs.length > 0){
                $scope.rerunTransactionsSelected++;
              }
            }
          }else{
            // only add transaction if channel Rerun is allowed
            if ( $scope.channelsMap[transaction.channelID].rerun ){
              $scope.transactionsSelected.push(transaction._id);

              // check if transaction is a rerun
              if (transaction.childIDs){
                if (transaction.childIDs.length > 0){
                  $scope.rerunTransactionsSelected++;
                }
              }
            }
          }
        });
      }else{
        $scope.transactionsSelected = [];
        $scope.rerunTransactionsSelected = 0;
      }
    };

    var getObjectById = function(id, myArray) {
      var object = myArray.filter(function(obj) {
        if(obj._id === id) {
          return obj;
        }
      })[0];
      return object;
    };

    $scope.toggleTransactionSelection = function(transactionID) {
      var idx = $scope.transactionsSelected.indexOf(transactionID);
      var transaction = getObjectById(transactionID, $scope.transactions);

      // is currently selected
      if (idx > -1) {
        $scope.transactionsSelected.splice(idx, 1);

        // check if transaction has reruns
        if (transaction.childIDs){
          if (transaction.childIDs.length > 0){
            $scope.rerunTransactionsSelected--;
          }
        }
      }else {
        // is newly selected
        $scope.transactionsSelected.push(transactionID);

        // check if transaction has reruns
        if (transaction.childIDs){
          if (transaction.childIDs.length > 0){
            $scope.rerunTransactionsSelected++;
          }
        }
      }
    };

    $scope.resetCheckedItems = function(){
      $scope.transactionsSelected = [];
      $scope.rerunTransactionsSelected = 0;
      $scope.checkAll = false;
    };

    $scope.$on('transactionRerunSuccess', function() {
      $scope.refreshTransactionsList();
    });
    
    /****************************************************/
    /**         Transactions ReRun Functions           **/
    /****************************************************/

  });