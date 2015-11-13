'use strict';
/* global beautifyIndent:false */
/* global returnContentType:false */
/* global moment:false */

angular.module('openhimConsoleApp')
  .controller('TransactionDetailsCtrl', function ($scope, $modal, $location, $routeParams, Api, Alerting) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    // get txList for paging
    var txList = JSON.parse(sessionStorage.getItem('currTxList'));

    $scope.pagingEnabled = true;
    if (!txList) {
      $scope.pagingEnabled = false;
    } else if (txList.indexOf($routeParams.transactionId) === -1) {
      $scope.pagingEnabled = false;
    }

    $scope.next = null;
    $scope.prev = null;
    if ($scope.pagingEnabled) {
      var currTxIndex = txList.indexOf($routeParams.transactionId);

      $scope.txNumber = currTxIndex+1;
      $scope.txTotal = txList.length;
      $scope.currFilterURL = sessionStorage.getItem('currFilterURL');

      if (currTxIndex !== 0) {
        $scope.prev = txList[currTxIndex-1];
      }
      if (currTxIndex !== txList.length-1) {
        $scope.next = txList[currTxIndex+1];
      }
    }

    var querySuccess = function(transactionDetails){

      $scope.transactionDetails = transactionDetails;

      // transform request body with indentation/formatting
      if( transactionDetails.request && transactionDetails.request.body ){
        if ( transactionDetails.request.headers && returnContentType( transactionDetails.request.headers ) ){
          var requestTransform = beautifyIndent(returnContentType( transactionDetails.request.headers ), transactionDetails.request.body);
          $scope.transactionDetails.request.body = requestTransform.content;
        }
      }

      // transform response body with indentation/formatting
      if( transactionDetails.response && transactionDetails.response.body ){
        if ( transactionDetails.response.headers && returnContentType( transactionDetails.response.headers ) ){
          var responseTransform = beautifyIndent(returnContentType( transactionDetails.response.headers ), transactionDetails.response.body);
          $scope.transactionDetails.response.body = responseTransform.content;
        }
      }

      // calculate total transaction time
      if( ( transactionDetails.request && transactionDetails.request.timestamp ) &&
        ( transactionDetails.response && transactionDetails.response.timestamp ) ) {
          var diff = moment(transactionDetails.response.timestamp)-moment(transactionDetails.request.timestamp);

          if (diff>=1000) {
            //display in seconds
            var round = function(value, decimalPlaces) {
              return +(Math.round(value + 'e+' + decimalPlaces)  + 'e-' + decimalPlaces);
            };

            transactionDetails.transactionTime =  round(diff/1000.0, 3) + ' s';
          } else {
            //display in milliseconds
            transactionDetails.transactionTime = diff + ' ms';
          }
      }


      var consoleSession = localStorage.getItem('consoleSession');
      consoleSession = JSON.parse(consoleSession);
      $scope.consoleSession = consoleSession;

      // get the user to find user roles
      Api.Users.get({ email: $scope.consoleSession.sessionUser }, function(user){
        // get the channels for the transactions filter dropdown
        Api.Channels.get({ channelId: transactionDetails.channelID }, function(channel){
          $scope.channel = channel;
          $scope.routeDefs = {};
          channel.routes.forEach(function (route) {
            $scope.routeDefs[route.name] = route;
          });

          if (typeof channel.status === 'undefined' || channel.status === 'enabled') {
            if ( user.groups.indexOf('admin') >= 0 ){
              $scope.rerunAllowed = true;
            }else{
              angular.forEach(user.groups, function(role){
                if ( channel.txRerunAcl.indexOf(role) >= 0 ){
                  $scope.rerunAllowed = true;
                }
              });
            }
          }
        }, function(){ /* server error - could not connect to API to get channels */ });
      }, function(){ /* server error - could not connect to API to get user details */ });

      // if clientID exist - fetch details
      if ( transactionDetails.clientID ){
        // get the client object for the transactions details page
        $scope.client = Api.Clients.get({ clientId: transactionDetails.clientID, property: 'clientName' });
      }


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
      filtersObject.filters = {};
      filtersObject.filters.parentID = $routeParams.transactionId;

      return filtersObject;
    };

    //Refresh transactions list
    $scope.fetchChildTransactions = function () {

      Api.Transactions.query( $scope.returnFilterObject(), function (values) {
        // on success
        $scope.childTransactions = values;
      },
      function (err) {
        Alerting.AlertAddServerMsg(err.status);
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

      // check if transaction has child IDs (It has been rerun before)
      if ($scope.transactionDetails.childIDs){
        if ($scope.transactionDetails.childIDs.length > 0){
          rerunTransactionsSelected = 1;
        }
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

    $scope.viewAddReqResDetails = function(record, route){
      $modal.open({
        templateUrl: 'views/transactionsAddReqResModal.html',
        controller: 'TransactionsAddReqResModalCtrl',
        windowClass: 'modal-fullview',
        resolve: {
          record: function () {
            return record;
          },
          route: function () {
            return route;
          }
        }
      });
    };

    /*********************************************************************/
    /**               Transactions View Route Functions                 **/
    /*********************************************************************/



    /********************************************************************/
    /**               Transactions View Body Functions                 **/
    /********************************************************************/

    $scope.viewBodyDetails = function(type, content, headers){
      $modal.open({
        templateUrl: 'views/transactionsBodyModal.html',
        controller: 'TransactionsBodyModalCtrl',
        windowClass: 'modal-fullview',
        resolve: {
          bodyData: function () {
            return {type: type, content: content, headers: headers};
          }
        }
      });
    };

    /********************************************************************/
    /**               Transactions View Body Functions                 **/
    /********************************************************************/

  });
