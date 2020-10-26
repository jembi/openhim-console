import { beautifyIndent, returnContentType, retrieveBodyProperties } from '../utils'
import { Api } from '../services/rest'

export function TransactionsBodyModalCtrl ($scope, $uibModalInstance, config, Alerting, bodyData, Api) {
  $scope.bodyData = bodyData
  const defaultLengthOfBodyToDisplay = config.defaultLengthOfBodyToDisplay

  console.log(bodyData)

  // $scope.partialBody = false
  // transform body with indentation/formatting
  if ($scope.bodyData && $scope.bodyData.content) {
    if (bodyData.headers && returnContentType(bodyData.headers)) {
      const bodyTransform = beautifyIndent(returnContentType(bodyData.headers), bodyData.content)
      $scope.bodyData.content = bodyTransform.content
    }
  }

  $scope.retrieveBodyData = function (start=0, end=defaultLengthOfBodyToDisplay) {
    Api.TransactionBodies($scope.bodyData.transactionId, $scope.bodyData.bodyId, start, end).then(response => {
      const { start, end, bodyLength } = retrieveBodyProperties(response)

      if (start && end && bodyLength) {
        $scope.bodyStart = start
        $scope.bodyEnd = end
        $scope.bodyLength = bodyLength

        if ((bodyLength - end) > 1) {
          $scope.partialBody = true
        }
      }

      if (bodyData.headers && returnContentType(bodyData.headers)) {
        let bodyTransform = beautifyIndent(returnContentType(bodyData.headers), response.data)
        $scope.bodyData.content = bodyTransform.content
      }
    }).catch(err => {
      Alerting.AlertAddServerMsg(err.status)
    })
  }
  // $scope.retrieveBodyData()

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }

  $scope.loadMore = function () {
    $scope.retrieveBodyData(0, 2048)
  }

  $scope.loadFull = function () {
    $scope.retrieveBodyData(0, 9999999999999)
  }
}
