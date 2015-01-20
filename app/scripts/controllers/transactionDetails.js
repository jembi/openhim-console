'use strict';
/* global beautifyIndent:false */

angular.module('openhimWebui2App')
  .controller('TransactionDetailsCtrl', function ($scope, $modal, $location, $routeParams, Api, Alerting) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    var querySuccess = function(transactionDetails){

      $scope.transactionDetails = transactionDetails;
      
      // transform request body with indentation/formatting
      if( transactionDetails.request && transactionDetails.request.body ){
        if ( transactionDetails.request.headers ){
          var requestTransform = beautifyIndent(transactionDetails.request.headers['content-type'], transactionDetails.request.body);
          $scope.transactionDetails.request.body = requestTransform.content;
          $scope.requestTransformLang = requestTransform.lang;
        }
      }

      // transform response body with indentation/formatting
      if( transactionDetails.response && transactionDetails.response.body ){
        if ( transactionDetails.response.headers ){
          var responseTransform = beautifyIndent(transactionDetails.response.headers['content-type'], transactionDetails.response.body);
          $scope.transactionDetails.response.body = responseTransform.content;
          $scope.responseTransformLang = responseTransform.lang;
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

          if ( user.groups.indexOf('admin') >= 0 ){
            $scope.rerunAllowed = true;
          }else{
            angular.forEach(user.groups, function(role){
              if ( channel.txRerunAcl.indexOf(role) >= 0 ){
                $scope.rerunAllowed = true;
              }
            });
          }
        }, function(){ /* server error - could not connect to API to get channels */ });
      }, function(){ /* server error - could not connect to API to get user details */ });

      // get the client object for the transactions details page
      $scope.client = Api.Clients.get({ clientId: transactionDetails.clientID, property: 'clientName' });

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

    $scope.viewAddReqResDetails = function(record){
      $modal.open({
        templateUrl: 'views/transactionsAddReqResModal.html',
        controller: 'TransactionsAddReqResModalCtrl',
        resolve: {
          record: function () {
            return record;
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

    $scope.viewBodyDetails = function(type, content, contentType){
      $modal.open({
        templateUrl: 'views/transactionsBodyModal.html',
        controller: 'TransactionsBodyModalCtrl',
        resolve: {
          bodyData: function () {
            return {type: type, content: content, contentType: contentType};
          }
        }
      });
    };

    /********************************************************************/
    /**               Transactions View Body Functions                 **/
    /********************************************************************/

  });
