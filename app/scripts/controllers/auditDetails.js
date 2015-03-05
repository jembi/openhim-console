'use strict';

angular.module('openhimConsoleApp')
  .controller('AuditDetailsCtrl', function ($scope, $modal, $location, $routeParams, Api, Alerting) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    $scope.eventActionMap = {};
    $scope.eventActionMap.C = 'Create (C)';
    $scope.eventActionMap.R = 'Read (R)';
    $scope.eventActionMap.U = 'Update (U)';
    $scope.eventActionMap.D = 'Delete (D)';
    $scope.eventActionMap.E = 'Execute (E)';

    $scope.eventOutcomeMap = {};
    $scope.eventOutcomeMap[0] = 'Success (0)';
    $scope.eventOutcomeMap[4] = 'Minor Failure (4)';
    $scope.eventOutcomeMap[8] = 'Serious Failure (8)';
    $scope.eventOutcomeMap[12] = 'Major Failure (12)';

    var querySuccess = function(auditDetails){

      $scope.auditDetails = auditDetails;
      
      // transform request body with indentation/formatting
      /*if( auditDetails.request && auditDetails.request.body ){
        if ( auditDetails.request.headers && returnContentType( auditDetails.request.headers ) ){
          var requestTransform = beautifyIndent(returnContentType( auditDetails.request.headers ), auditDetails.request.body);
          $scope.auditDetails.request.body = requestTransform.content;
          $scope.requestTransformLang = requestTransform.lang;
        }
      }

      // transform response body with indentation/formatting
      if( auditDetails.response && auditDetails.response.body ){
        if ( auditDetails.response.headers && returnContentType( auditDetails.response.headers ) ){
          var responseTransform = beautifyIndent(returnContentType( auditDetails.response.headers ), auditDetails.response.body);
          $scope.auditDetails.response.body = responseTransform.content;
          $scope.responseTransformLang = responseTransform.lang;
        }
      }*/

    };

    var queryError = function(err){
      // on error - add server error alert
      Alerting.AlertAddServerMsg(err.status);
    };

    //get the Data for the supplied ID and store in 'auditsDetails' object
    Api.Audits.get({ auditId: $routeParams.auditId }, querySuccess, queryError);

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
      filtersObject.parentID = $routeParams.auditId;
      return filtersObject;
    };

    //location provider - load audit details
    $scope.viewTransactionDetails = function (path) {
      //do audits details redirection when clicked on TD
      $location.path(path);
    };

    /*******************************************************************/
    /**         Transactions List and Detail view functions           **/
    /*******************************************************************/



    /********************************************************************/
    /**               Transactions View Body Functions                 **/
    /********************************************************************/

    $scope.viewContentDetails = function(type, content){
      $modal.open({
        templateUrl: 'views/auditsContentModal.html',
        controller: 'AuditsContentModalCtrl',
        resolve: {
          auditData: function () {
            return {type: type, content: content};
          }
        }
      });
    };

    /********************************************************************/
    /**               Transactions View Body Functions                 **/
    /********************************************************************/

  });
