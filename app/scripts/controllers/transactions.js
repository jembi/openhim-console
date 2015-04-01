'use strict';
/* global jQuery:false */
/* global moment:false */
/* global valueNotEmpty:false */

angular.module('openhimConsoleApp')
  .controller('TransactionsCtrl', function ($scope, $modal, $location, $timeout, Api, Alerting) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    // set default limit
    var defaultLimit = 20;
    var defaultTabView = 'same';
    $scope.defaultBulkRerunLimit = 10000;
    $scope.loadMoreBtn = false;

    // filters collapsed by default
    $scope.advancedFilters = {};
    $scope.advancedFilters.isCollapsed = true;

    /* setup default filter options */
    $scope.showpage = 0;
    $scope.checkbox = {};
    $scope.checkbox.checkAll = false;
    $scope.transactionsSelected = [];
    $scope.rerunTransactionsSelected = 0;

    // default settings
    $scope.settings = {};
    $scope.settings.list = {};
    $scope.settings.list.tabview = defaultTabView;
    $scope.settings.filter = {};
    $scope.settings.filter.limit = defaultLimit;

    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);
    $scope.consoleSession = consoleSession;
    var userSettings = consoleSession.sessionUserSettings;

    $scope.filters = {};
    $scope.filters.transaction = {};
    $scope.filters.route = {};
    $scope.filters.orchestration = {};

    // check if no parameters exist and user has settings defined
    if ( angular.equals({}, $location.search()) && userSettings ){
      if ( userSettings.filter ){

        if ( userSettings.filter.limit && userSettings.filter.limit !== 0){
          $scope.settings.filter.limit = userSettings.filter.limit;
        }

        $scope.filters.transaction.status = userSettings.filter.status;
        $scope.filters.transaction.channel = userSettings.filter.channel;
        $scope.settings.filter.startDate = '';
        $scope.settings.filter.endDate = '';
      }

      if ( userSettings.list ){
        $scope.settings.list.tabview = userSettings.list.tabview;
      }
    }

    // setup default transaction settings
    if ( $location.search().limit ){ $scope.settings.filter.limit = $location.search().limit; }
    if ( $location.search().startDate ){ $scope.settings.filter.startDate = $location.search().startDate; }
    if ( $location.search().endDate ){ $scope.settings.filter.endDate = $location.search().endDate; }

    // search for transaction filters
    if ( $location.search().txStatus ){ $scope.filters.transaction.status = $location.search().txStatus; }
    if ( $location.search().txChannel ){ $scope.filters.transaction.channel = $location.search().txChannel; }

    if ( $location.search().txStatusCode ){
      $scope.filters.transaction.statusCode = $location.search().txStatusCode;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().txPath ){
      $scope.filters.transaction.path = $location.search().txPath;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().txParamKey ){
      $scope.filters.transaction.requestParamKey = $location.search().txParamKey;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().txParamValue ){
      $scope.filters.transaction.requestParamValue = $location.search().txParamValue;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().txClient ){
      $scope.filters.transaction.client = $location.search().txClient;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().txWasRerun ){
      $scope.filters.transaction.wasRerun = $location.search().txWasRerun;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().txPropertyKey ){
      $scope.filters.transaction.propertyKey = $location.search().txPropertyKey;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().txPropertyValue ){
      $scope.filters.transaction.propertyValue = $location.search().txPropertyValue;
      $scope.advancedFilters.isCollapsed = false;
    }

    // search for route filters
    if ( $location.search().routeStatusCode ){
      $scope.filters.route.statusCode = $location.search().routeStatusCode;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().routePath ){
      $scope.filters.route.path = $location.search().routePath;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().routeParamKey ){
      $scope.filters.route.requestParamKey = $location.search().routeParamKey;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().routeParamValue ){
      $scope.filters.route.requestParamValue = $location.search().routeParamValue;
      $scope.advancedFilters.isCollapsed = false;
    }

    // search for orchestration filters
    if ( $location.search().orchStatusCode ){
      $scope.filters.orchestration.statusCode = $location.search().orchStatusCode;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().orchPath ){
      $scope.filters.orchestration.path = $location.search().orchPath;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().orchParamKey ){
      $scope.filters.orchestration.requestParamKey = $location.search().orchParamKey;
      $scope.advancedFilters.isCollapsed = false;
    }
    if ( $location.search().orchParamValue ){
      $scope.filters.orchestration.requestParamValue = $location.search().orchParamValue;
      $scope.advancedFilters.isCollapsed = false;
    }


    var userGroups = $scope.consoleSession.sessionUserGroups;

    // get the channels for the transactions filter dropdown
    $scope.channels = Api.Channels.query(function(){
      $scope.channelsMap = {};
      angular.forEach($scope.channels, function(channel){
        $scope.channelsMap[channel._id] = {};
        $scope.channelsMap[channel._id].name = channel.name;

        if (typeof channel.status === 'undefined' || channel.status === 'enabled') {
          if ( userGroups.indexOf('admin') >= 0 ){
            $scope.rerunAllowedAdmin = true;
          }else{
            angular.forEach(userGroups, function(role){
              if ( channel.txRerunAcl.indexOf(role) >= 0 ){
                $scope.channelsMap[channel._id].rerun = true;
              }
            });
          }
        }
      });
    }, function(){ /* server error - could not connect to API to get channels */ });

    // clients used for advanced filter dropdown
    $scope.clients = Api.Clients.query();

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/



    /*******************************************************************/
    /**         Transactions List and Detail view functions           **/
    /*******************************************************************/


    //setup filter options
    $scope.returnFilters = function(){

      var filtersObject = {};
      var filterDateStart, filterDateEnd;

      filtersObject.filterPage = $scope.showpage;
      filtersObject.filterLimit = $scope.settings.filter.limit;

      /* ##### construct filters ##### */
      filtersObject.filters = {};

      // date filter
      filterDateStart = $scope.settings.filter.startDate;
      filterDateEnd = $scope.settings.filter.endDate;
      if(filterDateStart && filterDateEnd){
        var startDate = moment(filterDateStart).format();
        var endDate = moment(filterDateEnd).endOf('day').format();
        filtersObject.filters['request.timestamp'] = JSON.stringify( { '$gte': startDate, '$lte': endDate } );
      }

      /* ----- filter by transaction (basic) ----- */
      // add transaction status filter
      var txStatus = $scope.filters.transaction.status;
      if ( valueNotEmpty(txStatus) === true ) {
        filtersObject.filters.status = txStatus;
      }

      var txChannel = $scope.filters.transaction.channel;
      if ( valueNotEmpty(txChannel) === true ) {
        filtersObject.filters.channelID = txChannel;
      }
      /* ----- filter by transaction (basic) ----- */

      /* ----- filter by transaction (advanced) ----- */
      // add transaction status filter
      var txStatusCode = $scope.filters.transaction.statusCode;
      if ( valueNotEmpty(txStatusCode) === true ) {
        filtersObject.filters['response.status'] = txStatusCode;
      }

      var txPath = $scope.filters.transaction.path;
      if ( valueNotEmpty(txPath) === true ) {
        filtersObject.filters['request.path'] = txPath;
      }

      var txParamKey = $scope.filters.transaction.requestParamKey;
      var txParamValue = $scope.filters.transaction.requestParamValue;
      if ( valueNotEmpty(txParamKey) === true ) {
        filtersObject.filters['request.querystring'] = txParamKey;

        if ( valueNotEmpty(txParamValue) === true ){
          filtersObject.filters['request.querystring'] += '=' + txParamValue;
        }
      }

      var txClient = $scope.filters.transaction.client;
      if ( valueNotEmpty(txClient) === true ) {
        filtersObject.filters.clientID = txClient;
      }

      var txWasRerun = $scope.filters.transaction.wasRerun;
      if ( valueNotEmpty(txWasRerun) === true ) {

        // if wasRerun is 'yes' - query all transactions that have child IDs
        if ( txWasRerun === 'yes' ){
          filtersObject.filters['childIDs.0'] = JSON.stringify( { '$exists': true } );
        }else if ( txWasRerun === 'no' ){
          filtersObject.filters['childIDs.0'] = JSON.stringify( { '$exists': false } );
        }
      }

      var txPropertyKey = $scope.filters.transaction.propertyKey;
      var txPropertyValue = $scope.filters.transaction.propertyValue;
      if ( valueNotEmpty(txPropertyKey) === true ) {
        filtersObject.filters.properties = {};
        filtersObject.filters.properties[txPropertyKey] = null;

        if ( valueNotEmpty(txPropertyValue) === true ) {
          filtersObject.filters.properties[txPropertyKey] = txPropertyValue;
        }
      }

      /* ----- filter by transaction (advanced) ----- */



      /* ----- filter by route ----- */
      var routeStatusCode = $scope.filters.route.statusCode;
      if ( valueNotEmpty(routeStatusCode) === true ) {
        filtersObject.filters['routes.response.status'] = routeStatusCode;
      }

      var routePath = $scope.filters.route.path;
      if ( valueNotEmpty(routePath) === true ) {
        filtersObject.filters['routes.request.path'] = routePath;
      }

      var routeParamKey = $scope.filters.route.requestParamKey;
      var routeParamValue = $scope.filters.route.requestParamValue;
      if ( valueNotEmpty(routeParamKey) === true ) {
        filtersObject.filters['routes.request.querystring'] = routeParamKey;

        if ( valueNotEmpty(routeParamValue) === true ){
          filtersObject.filters['routes.request.querystring'] += '=' + routeParamValue;
        }
      }
      /* ----- filter by route ----- */



      /* ----- filter by orchestration ----- */
      var orchStatusCode = $scope.filters.orchestration.statusCode;
      if ( valueNotEmpty(orchStatusCode) === true ) {
        filtersObject.filters['orchestrations.response.status'] = orchStatusCode;
      }

      var orchPath = $scope.filters.orchestration.path;
      if ( valueNotEmpty(orchPath) === true ) {
        filtersObject.filters['orchestrations.request.path'] = orchPath;
      }

      var orchParamKey = $scope.filters.orchestration.requestParamKey;
      var orchParamValue = $scope.filters.orchestration.requestParamValue;
      if ( valueNotEmpty(orchParamKey) === true ) {
        filtersObject.filters['orchestrations.request.querystring'] = orchParamKey;

        if ( valueNotEmpty(orchParamValue) === true ){
          filtersObject.filters['orchestrations.request.querystring'] += '=' + orchParamValue;
        }
      }
      /* ----- filter by orchestration ----- */


      /* ##### construct filters ##### */
      return filtersObject;

    };


    var refreshSuccess = function (transactions){
      // on success
      $scope.transactions = transactions;

      if( transactions.length < $scope.settings.filter.limit ){
        $scope.loadMoreBtn = false;

        if( transactions.length === 0 ){
          Alerting.AlertAddMsg('bottom', 'warning', 'There are no transactions for the current filters');
        }

      }else{
        //Show the load more button
        $scope.loadMoreBtn = true;
      }


      // if bulkRerun param true
      if ( $location.search().bulkRerun === 'true' ){
        // set checkAll to true - used to add transactions in toggleCheckedAll function
        $scope.checkbox.checkAll = true;

        // do the checkAll function to add the transactions to the transactionsSelected object
        $scope.toggleCheckedAll();

        if ( !$scope.settings.filter.startDate || !$scope.settings.filter.endDate ){
          $scope.NoDateRange = true;
        }
      }else{
        // normal transaction success
        // make sure newly added transactions are checked as well
        $scope.resetCheckedItems();
      }

    };

    var refreshError = function(err){
      // on error - Hide load more button and show error message
      $scope.loadMoreBtn = false;
      Alerting.AlertAddServerMsg(err.status);
    };

    $scope.validateFormFilters = function(){

      // reset hasErrors alert object
      Alerting.AlertReset('hasErrors');

      // clear timeout if it has been set
      $timeout.cancel( $scope.clearValidation );

      $scope.ngError = {};
      $scope.ngError.hasErrors = false;

      // transaction status code validation
      if( $scope.filters.transaction.statusCode && /^\d(\d\d|xx)$/.test($scope.filters.transaction.statusCode) === false ){
        $scope.ngError.txStatusCode = true;
        $scope.ngError.hasErrors = true;
      }

      // route status code validation
      if( $scope.filters.route.statusCode && /^\d(\d\d|xx)$/.test($scope.filters.route.statusCode) === false ){
        $scope.ngError.routeStatusCode = true;
        $scope.ngError.hasErrors = true;
      }

      // orchestration status code validation
      if( $scope.filters.orchestration.statusCode && /^\d(\d\d|xx)$/.test($scope.filters.orchestration.statusCode) === false ){
        $scope.ngError.orchStatusCode = true;
        $scope.ngError.hasErrors = true;
      }

      if ( $scope.ngError.hasErrors ){
        $scope.clearValidation = $timeout(function(){
          // clear errors after 5 seconds
          $scope.ngError = {};
        }, 5000);
        Alerting.AlertAddMsg('hasErrors', 'danger', $scope.validationFormErrorsMsg);
      }

    };

    $scope.applyFiltersToUrl = function( optionalParam ){

      // get the filter params object before clearing them
      var filterParamsBeforeClear = JSON.stringify( angular.copy( $location.search() ) );

      // first clear existing filters
      clearUrlParams();

      // if optionalParam param = bulkrerun
      if ( optionalParam === 'bulkrerun' ){
        $location.search( 'bulkRerun', 'true' );
      }

      // Add filters to url
      // set filter limit only if url parameter set and NOT a bulkrerun (using default defaultBulkRerunLimit)
      if ( $scope.settings.filter.limit && optionalParam !== 'bulkrerun' ){ $location.search( 'limit', $scope.settings.filter.limit ); }
      if ( $scope.settings.filter.startDate ){ $location.search( 'startDate', $scope.settings.filter.startDate ); }
      if ( $scope.settings.filter.endDate ){ $location.search( 'endDate', $scope.settings.filter.endDate ); }

      // add transaction filters
      if ( $scope.filters.transaction.status ){ $location.search( 'txStatus', $scope.filters.transaction.status ); }
      if ( $scope.filters.transaction.channel ){ $location.search( 'txChannel', $scope.filters.transaction.channel ); }
      if ( $scope.filters.transaction.statusCode ){ $location.search( 'txStatusCode', $scope.filters.transaction.statusCode ); }
      if ( $scope.filters.transaction.path ){ $location.search( 'txPath', $scope.filters.transaction.path ); }
      if ( $scope.filters.transaction.requestParamKey ){ $location.search( 'txParamKey', $scope.filters.transaction.requestParamKey ); }
      if ( $scope.filters.transaction.requestParamValue ){ $location.search( 'txParamValue', $scope.filters.transaction.requestParamValue ); }
      if ( $scope.filters.transaction.client ){ $location.search( 'txClient', $scope.filters.transaction.client ); }
      if ( $scope.filters.transaction.wasRerun ){ $location.search( 'txWasRerun', $scope.filters.transaction.wasRerun ); }
      if ( $scope.filters.transaction.propertyKey ){ $location.search( 'txPropertyKey', $scope.filters.transaction.propertyKey ); }
      if ( $scope.filters.transaction.propertyValue ){ $location.search( 'txPropertyValue', $scope.filters.transaction.propertyValue ); }

      // add route filters
      if ( $scope.filters.route.statusCode ){ $location.search( 'routeStatusCode', $scope.filters.route.statusCode ); }
      if ( $scope.filters.route.path ){ $location.search( 'routePath', $scope.filters.route.path ); }
      if ( $scope.filters.route.requestParamKey ){ $location.search( 'routeParamKey', $scope.filters.route.requestParamKey ); }
      if ( $scope.filters.route.requestParamValue ){ $location.search( 'routeParamValue', $scope.filters.route.requestParamValue ); }

      // add orchestration filters
      if ( $scope.filters.orchestration.statusCode ){ $location.search( 'orchStatusCode', $scope.filters.orchestration.statusCode ); }
      if ( $scope.filters.orchestration.path ){ $location.search( 'orchPath', $scope.filters.orchestration.path ); }
      if ( $scope.filters.orchestration.requestParamKey ){ $location.search( 'orchParamKey', $scope.filters.orchestration.requestParamKey ); }
      if ( $scope.filters.orchestration.requestParamValue ){ $location.search( 'orchParamValue', $scope.filters.orchestration.requestParamValue ); }

      // get the filter params object after clearing them
      var filterParamsAfterClear = JSON.stringify( angular.copy( $location.search() ) );

      // if the filters object stays the same then call refresh function
      // if filters object not the same then angular changes route and loads controller ( refresh )
      if ( filterParamsBeforeClear === filterParamsAfterClear ){
        $scope.refreshTransactionsList();
      }

    };

    //Refresh transactions list
    $scope.refreshTransactionsList = function () {

      Alerting.AlertReset();

      // validate the form first to check for any errors
      $scope.validateFormFilters();

      // execute refresh if no errors
      if ( $scope.ngError.hasErrors === false ){

        $scope.transactions = null;

        //reset the showpage filter to start at 0
        $scope.showpage = 0;

        // if bulkRerun param true
        if ( $location.search().bulkRerun === 'true' ){
          // do API call only for 'bulkrerun' properties
          var returnFilters = $scope.returnFilters();
          // add filterRepresentation to only return bulkrerun properties
          returnFilters.filterRepresentation = 'bulkrerun';

          // set filter limit to default defaultBulkRerunLimit
          returnFilters.filterLimit = $scope.defaultBulkRerunLimit;

          // remove filterPage because no pagination needed
          delete returnFilters.filterPage;

          // set bulkrerunActive true to show rerun information
          $scope.bulkRerunActive = true;

          Api.Transactions.query( returnFilters, refreshSuccess, refreshError);
        }else{
          //  do normal transaction API call for transactions
          Api.Transactions.query( $scope.returnFilters(), refreshSuccess, refreshError);
        }

      }else{
        Alerting.AlertAddMsg('server', 'danger', 'You appear to have errors in your filter query. Please correct and try again');
      }

    };
    //run the transaction list view for the first time
    $scope.refreshTransactionsList();

    //Refresh transactions list
    $scope.loadMoreTransactions = function () {
      $scope.busyLoadingMore = true;
      Alerting.AlertReset();

      $scope.showpage++;
      Api.Transactions.query( $scope.returnFilters(), loadMoreSuccess, loadMoreError);
    };

    var loadMoreSuccess = function (transactions){
      //on success
      $scope.transactions = $scope.transactions.concat(transactions);
      //remove any duplicates objects found in the transactions scope
      $scope.transactions = jQuery.unique($scope.transactions);

      if( transactions.length < $scope.settings.filter.limit ){
        $scope.loadMoreBtn = false;
        Alerting.AlertAddMsg('bottom', 'warning', 'There are no more transactions to retrieve');
      }

      //make sure newly added transactions are checked as well
      $scope.toggleCheckedAll();
      $scope.busyLoadingMore = false;
    };

    var loadMoreError = function(err){
      // on error - Hide load more button and show error message
      $scope.loadMoreBtn = false;
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

    var clearUrlParams =  function(){
      // loop through all parameters
      for (var property in $location.search()) {
        if ($location.search().hasOwnProperty(property)) {
          // set parameter to null to remove
          $location.search(property, null);
        }
      }
    };

    //Clear filter data end refresh transactions scope
    $scope.clearFilters = function () {

      // reset default filters
      $scope.settings.filter.limit = defaultLimit;
      $scope.settings.filter.startDate = '';
      $scope.settings.filter.endDate = '';
      $scope.settings.list.tabview = defaultTabView;
      $scope.filters.transaction.status = '';
      $scope.filters.transaction.channel = '';

      // get the filter params object before clearing them
      var filterParamsBeforeClear = JSON.stringify( angular.copy( $location.search() ) );

      // clear all filter parameters
      clearUrlParams();

      // get the filter params object after clearing them
      var filterParamsAfterClear = JSON.stringify( angular.copy( $location.search() ) );

      // if the filters object stays the same then call refresh function
      // if filters object not the same then angular changes route and loads controller ( refresh )
      if ( filterParamsBeforeClear === filterParamsAfterClear ){
        $scope.refreshTransactionsList();
      }

    };

    /*******************************************************************/
    /**         Transactions List and Detail view functions           **/
    /*******************************************************************/



    /****************************************************/
    /**         Transactions ReRun Functions           **/
    /****************************************************/

    $scope.bulkRerunContinue = function(){
      // set checkAll to true - used to add transactions in toggleCheckedAll function
      $scope.checkbox.checkAll = true;

      // do the checkAll function to add the transactions to the transactionsSelected object
      $scope.toggleCheckedAll();

      // display confirmation popup modal to complete the rerun procedure
      $scope.confirmRerunTransactions();
    };

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
      if( $scope.checkbox.checkAll === true ){

        $scope.transactionsSelected = [];
        $scope.rerunTransactionsSelected = 0;
        angular.forEach($scope.transactions, function(transaction){

          // first check if transaction can be rerun
          if ( transaction.canRerun ){

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
      $scope.checkbox.checkAll = false;
    };

    $scope.$on('transactionRerunSuccess', function() {
      $scope.refreshTransactionsList();
    });

    /****************************************************/
    /**         Transactions ReRun Functions           **/
    /****************************************************/

  });
