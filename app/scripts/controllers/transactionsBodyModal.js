import size from 'filesize'
import { beautifyIndent, returnContentType, retrieveBodyProperties } from '../utils'

export function TransactionsBodyModalCtrl($scope, $uibModalInstance, config, Api, Alerting, bodyData) {
  $scope.bodyData = bodyData
  const defaultLengthOfBodyToDisplay = config.defaultLengthOfBodyToDisplay

  if ($scope.bodyData && $scope.bodyData.bodyRangeProperties) {
    const properties = $scope.bodyData.bodyRangeProperties

    $scope.partialBody = properties.partial
    $scope.bodyStart = properties.start
    $scope.bodyEnd = properties.end
    $scope.bodyLength = properties.bodyLength

    let bodySize = size((properties.end - properties.start) + 1) // Include the starting point as a value
    let bodySizeFull = size(properties.bodyLength)
    $scope.bodySizeIndicator = bodySize === bodySizeFull
      ? bodySizeFull
      : `${bodySize} of ${bodySizeFull}`
  }

  // transform body with indentation/formatting
  if ($scope.bodyData && $scope.bodyData.content) {
    if (bodyData.headers && returnContentType(bodyData.headers)) {
      const bodyTransform = $scope.partialBody
        ? { content: bodyData.content }
        : beautifyIndent(returnContentType(bodyData.headers), bodyData.content)
      $scope.bodyData.content = bodyTransform.content
    }
  }

  if (
    $scope.bodyData &&
    $scope.bodyData.transactionId &&
    $scope.bodyData.bodyId
  ) {
    $scope.formatContent = true
    $scope.formatButtonText = 'Remove formatting'
    $scope.retrieveBodyData = function (start = 0, end = defaultLengthOfBodyToDisplay) {
      $scope.busyLoadingMore = true
      Api.TransactionBodies($scope.bodyData.transactionId, $scope.bodyData.bodyId, start, end).then(response => {
        const { start, end, bodyLength } = retrieveBodyProperties(response)

        if (start && end && bodyLength) {
          $scope.bodyStart = start
          $scope.bodyEnd = end
          $scope.bodyLength = bodyLength
          $scope.partialBody = (bodyLength - end) > 1
          let bodySize = size((end - start) + 1) // Include the starting point as a value
          let bodySizeFull = size(bodyLength)
          $scope.bodySizeIndicator = bodySize === bodySizeFull
            ? bodySizeFull
            : `${bodySize} of ${bodySizeFull}`
        }

        if (bodyData.headers && returnContentType(bodyData.headers)) {
          let bodyTransform = beautifyIndent(returnContentType(bodyData.headers), response.data)
          $scope.bodyData.content = bodyTransform.content
        }
      })
      .catch(err => Alerting.AlertAddServerMsg(err.status))
      .finally(() => ($scope.busyLoadingMore = false))
    }

    $scope.loadMore = (function (bodyEnd) {
      return function () {
        bodyEnd += config.defaultLengthOfBodyToDisplay
        $scope.retrieveBodyData(0, bodyEnd)
      }
    })(config.defaultLengthOfBodyToDisplay)

    $scope.loadFull = function () {
      $scope.retrieveBodyData(0, $scope.bodyLength)
    }

    $scope.toggleFormatContent = function () {
      $scope.formatContent = !$scope.formatContent
      $scope.formatButtonText = $scope.formatContent ? 'Remove formatting' : 'Format'
    }
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }
}
