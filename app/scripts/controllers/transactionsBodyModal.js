import { beautifyIndent, returnContentType } from '../utils'

export function TransactionsBodyModalCtrl ($scope, $uibModalInstance, bodyData) {
  $scope.bodyData = bodyData

  // transform body with indentation/formatting
  if ($scope.bodyData.content) {
    if (bodyData.headers && returnContentType(bodyData.headers)) {
      const bodyTransform = beautifyIndent(returnContentType(bodyData.headers), bodyData.content)
      $scope.bodyData.content = bodyTransform.content
    }
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }
}
