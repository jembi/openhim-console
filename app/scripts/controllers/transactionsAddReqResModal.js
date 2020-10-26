import {
  beautifyIndent,
  returnContentType,
  retrieveBodyProperties
} from '../utils'

export function TransactionsAddReqResModalCtrl ($scope, $uibModal, $uibModalInstance, Api, config, record, channel, transactionId, recordType, index, bodyRangeProperties) {
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

        if (bodyLength && end && (bodyLength - end) > 1) {
          $scope.partialRecordRequestBody = true
        } else {
          $scope.partialRecordRequestBody = false
        }
        $scope.recordRequestBodyStart = start ? start : ''
        $scope.recordRequestBodyEnd = end ? end : ''
        $scope.recordRequestBodyLength = bodyLength ? bodyLength : ''

        if (record.request.headers && returnContentType(record.request.headers)) {
          const requestTransform = beautifyIndent(returnContentType(record.request.headers), response.data)
          $scope.record.request.body = requestTransform.content
          $scope.requestTransformLang = requestTransform.lang
        }
      })
    }

    if (record.request && record.request.body) {
      if (record.request.headers && returnContentType(record.request.headers)) {
        const requestTransform = beautifyIndent(returnContentType(record.request.headers), record.request.body)
        $scope.record.request.body = requestTransform.content
        $scope.requestTransformLang = requestTransform.lang
      }

      if (bodyRangeProperties && bodyRangeProperties.request) {
        const { partial, start, end, bodyLength } = bodyRangeProperties.request

        $scope.partialRecordRequestBody = partial
        $scope.recordRequestBodyStart = start ? start : ''
        $scope.recordRequestBodyEnd = end ? end : ''
        $scope.recordRequestBodyLength = bodyLength ? bodyLength : ''
      }
    } else {
      $scope.retrieveRecordRequestBody()
    }
  }

  // transform response body with indentation/formatting
  if (record.response && record.response.bodyId) {
    $scope.retrieveRecordResponseBody = function (start=0, end=defaultLengthOfBodyToDisplay) {
      Api.TransactionBodies(transactionId, record.response.bodyId, start, end).then(response => {
        const { start, end, bodyLength } = retrieveBodyProperties(response)

        if (bodyLength && end && (bodyLength - end) > 1) {
          $scope.partialRecordResponseBody = true
        }
        $scope.recordResponseBodyStart = start ? start : ''
        $scope.recordResponseBodyEnd = end ? end : ''
        $scope.recordResponseBodyLength = bodyLength ? bodyLength : ''

        if (record.response.headers && returnContentType(record.response.headers)) {
          const responseTransform = beautifyIndent(returnContentType(record.response.headers), response.data)
          $scope.record.response.body = responseTransform.content
          $scope.responseTransformLang = responseTransform.lang
        }
      })
    }

    if (record.response && record.response.body) {
      if (record.response.headers && returnContentType(record.response.headers)) {
        const responseTransform = beautifyIndent(returnContentType(record.response.headers), record.response.body)
        $scope.record.response.body = responseTransform.content
        $scope.responseTransformLang = responseTransform.lang
      }

      if (bodyRangeProperties && bodyRangeProperties.response) {
        const { partial, start, end, bodyLength } = bodyRangeProperties.request

        $scope.partialRecordResponseBody = partial
        $scope.recordResponseBodyStart = start ? start : ''
        $scope.recordResponseBodyEnd = end ? end : ''
        $scope.recordResponseBodyLength = bodyLength ? bodyLength : ''
      }
    } else {
      $scope.retrieveRecordResponseBody()
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
