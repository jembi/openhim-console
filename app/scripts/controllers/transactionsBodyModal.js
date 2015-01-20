'use strict';
/* global beautifyIndent:false */

angular.module('openhimWebui2App')
  .controller('TransactionsBodyModalCtrl', function ($scope, $modalInstance, bodyData) {

    $scope.bodyData = bodyData;

    // transform body with indentation/formatting
    if( $scope.bodyData.content ){
      if ( bodyData.contentType ){
        var bodyTransform = beautifyIndent(bodyData.contentType, bodyData.content);
        $scope.bodyData.content = bodyTransform.content;
        $scope.bodyTransformLang = bodyTransform.lang;
      }
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });