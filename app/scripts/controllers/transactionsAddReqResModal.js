import {
  beautifyIndent,
  returnContentType,
  retrieveBodyProperties
} from '../utils'

export function TransactionsAddReqResModalCtrl ($scope, $uibModal, $uibModalInstance, Api, config, record, channel, transactionId, recordType, index) {
  $scope.record = record
  $scope.channel = channel // optional
  $scope.viewFullBody = false
  $scope.viewFullBodyType = null
  $scope.viewFullBodyContent = null
  $scope.fullBodyTransformLang = null
  $scope.transactionId = transactionId
  $scope.recordPathRequest = recordType + '[' + index + '].request'
  $scope.recordPathResponse = recordType + '[' + index + '].response'

  const defaultLengthOfBodyToDisplay = config.defaultLengthOfBodyToDisplay
  $scope.partialRecordResponseBody = false
  $scope.partialRecordRequestBody = false

  // transform request body with indentation/formatting
  if (record.request && record.request.bodyId) {
    $scope.retrieveRecordRequestBody = function (start=0, end=defaultLengthOfBodyToDisplay) {
      Api.TransactionBodies(transactionId, record.request.bodyId, start, end).then(response => {
        const { start, end, bodyLength } = retrieveBodyProperties(response)

        if (start && end && bodyLength) {
          $scope.recordRequestBodyStart = start
          $scope.recordRequestBodyEnd = end
          $scope.recordRequestBodyLength = bodyLength

          if ((bodyLength - end) > 1) {
            $scope.partialRecordRequestBody = true
          }
        }

        if (record.request.headers && returnContentType(record.request.headers)) {
          let requestTransform = beautifyIndent(returnContentType(record.request.headers), response.data)
          $scope.record.request.body = requestTransform.content
          $scope.requestTransformLang = requestTransform.lang
        }
      })
    }
    $scope.retrieveRecordRequestBody()
  }

  // transform response body with indentation/formatting
  if (record.response && record.response.bodyId) {
    $scope.retrieveRecordResponseBody = function (start=0, end=defaultLengthOfBodyToDisplay) {
      Api.TransactionBodies(transactionId, record.response.bodyId, start, end).then(response => {
        const { start, end, bodyLength } = retrieveBodyProperties(response)

        if (start && end && bodyLength) {
          $scope.recordResponseBodyStart = start
          $scope.recordResponseBodyEnd = end
          $scope.recordResponseBodyLength = bodyLength

          if ((bodyLength - end) > 1) {
            $scope.partialRecordResponseBody = true
          }
        }

        if (record.response.headers && returnContentType(record.response.headers)) {
          let responseTransform = beautifyIndent(returnContentType(record.response.headers), response.data)
          $scope.record.response.body = responseTransform.content
          $scope.responseTransformLang = responseTransform.lang
        }
      })
    }
    $scope.retrieveRecordResponseBody()
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
