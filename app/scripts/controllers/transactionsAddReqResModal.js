import {
  beautifyIndent,
  returnContentType,
  retrieveBodyProperties
} from '../utils'
import transactionsBodyModal from '~/views/transactionsBodyModal'
import { TransactionsBodyModalCtrl } from './'

export function TransactionsAddReqResModalCtrl ($scope, $uibModal, $uibModalInstance, Api, config, record, channel, transactionId, recordType, index, bodyRangeProperties, $routeParams) {
  $scope.record = record
  $scope.channel = channel // optional
  $scope.transactionId = transactionId
  $scope.recordTypeName = recordType.charAt(0).toUpperCase() + recordType.slice(1, -1)
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

        $scope.requestBodyRangeProperties = {
          partial: $scope.partialRecordRequestBody,
          start: start ? start : '',
          end: end ? end : '',
          bodyLength: bodyLength ? bodyLength : ''
        }

        $scope.record.request.requestBodyRangeProperties = $scope.requestBodyRangeProperties

        if (record.request.headers && returnContentType(record.request.headers)) {
          const requestTransform = $scope.partialRequestBody
            ? { content: response.data }
            : beautifyIndent(returnContentType(record.request.headers), response.data)
          $scope.record.request.body = requestTransform.content
        }
      })
    }

    if (record.request && record.request.body) {
      if (record.request.headers && returnContentType(record.request.headers)) {
        const requestTransform = beautifyIndent(returnContentType(record.request.headers), record.request.body)
        $scope.record.request.body = requestTransform.content
      }

      if (bodyRangeProperties && bodyRangeProperties.request) {
        const { partial, start, end, bodyLength } = bodyRangeProperties.request

        $scope.partialRecordRequestBody = partial
        $scope.recordRequestBodyStart = start ? start : ''
        $scope.recordRequestBodyEnd = end ? end : ''
        $scope.recordRequestBodyLength = bodyLength ? bodyLength : ''

        $scope.requestBodyRangeProperties = {
          partial: $scope.partialRecordRequestBody,
          start: start ? start : '',
          end: end ? end : '',
          bodyLength: bodyLength ? bodyLength : ''
        }

        $scope.record.request.requestBodyRangeProperties = $scope.requestBodyRangeProperties
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
        } else {
          $scope.partialRecordResponseBody = false
        }
        $scope.recordResponseBodyStart = start ? start : ''
        $scope.recordResponseBodyEnd = end ? end : ''
        $scope.recordResponseBodyLength = bodyLength ? bodyLength : ''

        $scope.responseBodyRangeProperties = {
          partial: $scope.partialRecordResponseBody,
          start: start ? start : '',
          end: end ? end : '',
          bodyLength: bodyLength ? bodyLength : ''
        }

        $scope.record.response.responseBodyRangeProperties = $scope.responseBodyRangeProperties

        if (record.request.headers && returnContentType(record.response.headers)) {
          const responseTransform = $scope.partialResponseBody
            ? { content: response.data }
            : beautifyIndent(returnContentType(record.response.headers), response.data)
          $scope.record.response.body = responseTransform.content
        }
      })
    }

    if (record.response && record.response.body) {
      if (record.response.headers && returnContentType(record.response.headers)) {
        const responseTransform = beautifyIndent(returnContentType(record.response.headers), record.response.body)
        $scope.record.response.body = responseTransform.content
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

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }

  /********************************************************************/
  /**               Transactions View Body Functions                 **/
  /********************************************************************/

  $scope.viewBodyDetails = function (type, content, headers, bodyId, bodyRangeProperties) {
    $uibModal.open({
      template: transactionsBodyModal,
      controller: TransactionsBodyModalCtrl,
      windowClass: 'modal-fullview',
      resolve: {
        bodyData: function () {
          return {
            type: type, content: content, headers: headers,
            transactionId: $routeParams.transactionId, bodyId, bodyRangeProperties
          }
        }
      }
    })
  }

  /*********************************************************************/
  /**               Transactions View Route Functions                 **/
  /*********************************************************************/
}
