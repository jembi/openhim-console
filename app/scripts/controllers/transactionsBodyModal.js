'use strict';
/* global beautifyIndent:false */
/* global returnContentType:false */

angular.module('openhimConsoleApp')
  .controller('TransactionsBodyModalCtrl', function ($scope, $modalInstance, bodyData) {

    $scope.bodyData = bodyData;

    // transform body with indentation/formatting
    if( $scope.bodyData.content ){
      if ( bodyData.headers && returnContentType( bodyData.headers ) ){
        var bodyTransform = beautifyIndent(returnContentType( bodyData.headers ), bodyData.content);
        $scope.bodyData.content = bodyTransform.content;
      }
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });
