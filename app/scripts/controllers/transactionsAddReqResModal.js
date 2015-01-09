'use strict';

angular.module('openhimWebui2App')
  .controller('TransactionsAddReqResModalCtrl', function ($scope, $modal, $modalInstance, record) {

    $scope.record = record;
    $scope.viewFullBody = false;
    $scope.viewFullBodyType = null;
    $scope.viewFullBodyContent = null;
    

    $scope.toggleFullView = function (type, bodyContent) {

      // if both parameters supplied - view body message
      if ( type && bodyContent ){
        $scope.viewFullBody = true;
        $scope.viewFullBodyType = type;
        $scope.viewFullBodyContent = bodyContent;
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