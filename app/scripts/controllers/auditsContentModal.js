'use strict';
/* global isBase64String:false */
/* global decodeBase64:false */
/* global beautifyIndent:false */

angular.module('openhimConsoleApp')
  .controller('AuditsContentModalCtrl', function ($scope, $modalInstance, auditData) {

    $scope.auditData = auditData;

    // is content view raw audit message
    if ( auditData.type === 'Raw Audit Message' ){
      // transform body with indentation/formatting
      var bodyTransform = beautifyIndent('application/xml', auditData.content);
      $scope.auditData.content = bodyTransform.content;
      $scope.bodyTransformLang = bodyTransform.lang;
    }else{
      if (isBase64String( auditData.content )) {
        $scope.auditData.content = decodeBase64( auditData.content );
      }
    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });