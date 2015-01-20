'use strict';
/* global beautifyIndent:false */
/* global returnContentType:false */

angular.module('openhimWebui2App')
  .controller('TransactionsAddReqResModalCtrl', function ($scope, $modal, $modalInstance, record) {

    $scope.record = record;
    $scope.viewFullBody = false;
    $scope.viewFullBodyType = null;
    $scope.viewFullBodyContent = null;
    $scope.fullBodyTransformLang = null;
    
    // transform request body with indentation/formatting
    if( record.request && record.request.body ){
      if( record.request.headers && returnContentType( record.request.headers ) ){
        var requestTransform = beautifyIndent(returnContentType( record.request.headers ), record.request.body);
        $scope.record.request.body = requestTransform.content;
        $scope.requestTransformLang = requestTransform.lang;
      }
    }

    // transform response body with indentation/formatting
    if( record.response && record.response.body ){
      if ( record.response.headers && returnContentType( record.response.headers ) ){
        var responseTransform = beautifyIndent(returnContentType( record.response.headers ), record.response.body);
        $scope.record.response.body = responseTransform.content;
        $scope.responseTransformLang = responseTransform.lang;
      }
    }
    

    $scope.toggleFullView = function (type, bodyContent, contentType) {

      // if both parameters supplied - view body message
      if ( type && bodyContent ){
        $scope.viewFullBody = true;
        $scope.viewFullBodyType = type;
        $scope.viewFullBodyContent = bodyContent;
        $scope.fullBodyTransformLang = contentType;
      }else{
        $scope.viewFullBody = false;
      }

    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

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

  });