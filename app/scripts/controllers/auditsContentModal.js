import { isBase64String, decodeBase64, beautifyIndent } from '../utils'

export function AuditsContentModalCtrl ($scope, $uibModalInstance, auditData) {
  $scope.auditData = auditData

  // is content view raw audit message
  if (auditData.type === 'Raw Audit Message') {
    // transform body with indentation/formatting
    const bodyTransform = beautifyIndent('application/xml', auditData.content)
    $scope.auditData.content = bodyTransform.content
    $scope.bodyTransformLang = bodyTransform.lang
  } else {
    if (isBase64String(auditData.content)) {
      $scope.auditData.content = decodeBase64(auditData.content)
    }
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }
}
