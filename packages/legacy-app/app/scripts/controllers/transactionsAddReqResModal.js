import {
  beautifyIndent,
  returnContentType
} from '../utils'

export function TransactionsAddReqResModalCtrl ($scope, $uibModal, $uibModalInstance, record, channel, transactionId, recordType, index) {
  $scope.record = record
  $scope.channel = channel // optional
  $scope.viewFullBody = false
  $scope.viewFullBodyType = null
  $scope.viewFullBodyContent = null
  $scope.fullBodyTransformLang = null
  $scope.transactionId = transactionId
  $scope.recordPathRequest = recordType + '[' + index + '].request'
  $scope.recordPathResponse = recordType + '[' + index + '].response'

  // transform request body with indentation/formatting
  if (record.request && record.request.body) {
    if (record.request.headers && returnContentType(record.request.headers)) {
      const requestTransform = beautifyIndent(returnContentType(record.request.headers), record.request.body)
      $scope.record.request.body = requestTransform.content
      $scope.requestTransformLang = requestTransform.lang
    }
  }

  // transform response body with indentation/formatting
  if (record.response && record.response.body) {
    if (record.response.headers && returnContentType(record.response.headers)) {
      const responseTransform = beautifyIndent(returnContentType(record.response.headers), record.response.body)
      $scope.record.response.body = responseTransform.content
      $scope.responseTransformLang = responseTransform.lang
    }
  }

  $scope.toggleFullView = function (type, bodyContent, contentType) {
    // if both parameters supplied - view body message
    if (type && bodyContent) {
      $scope.viewFullBody = true
      $scope.viewFullBodyType = type
      $scope.viewFullBodyContent = bodyContent
      $scope.fullBodyTransformLang = contentType
    } else {
      $scope.viewFullBody = false
    }
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }

  /*********************************************************************/
  /**               Transactions View Route Functions                 **/
  /*********************************************************************/
}
