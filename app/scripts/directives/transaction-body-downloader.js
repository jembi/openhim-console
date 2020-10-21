import * as _ from 'lodash'
import { saveAs } from 'file-saver'
import { buildBlob } from '../utils'

export function transactionBodyDownloader (Api, Alerting) {
  return {
    restrict: 'EA',
    template: '<div class="btn btn-primary" ng-click="download()" tooltip="Download body"><i class="glyphicon glyphicon-download-alt"></i></div>',
    scope: {
      transactionId: '=',
      path: '='
    },
    link: function (scope) {
      scope.download = function () {
        let onSuccess = function (trx) {
          let subTrx = _.get(trx, scope.path)

          let contentType = 'text/plain' // default
          if (subTrx.headers && subTrx.headers['content-type']) {
            contentType = subTrx.headers['content-type']
          }

          let extension
          if (contentType.indexOf('json') > -1) {
            extension = '.json'
          } else if (contentType.indexOf('xml') > -1) {
            extension = '.xml'
          } else {
            extension = '.txt'
          }

          if(subTrx.bodyId) {
            Api.TransactionBodies(trx._id, subTrx.bodyId).then(response => {
              let bodyBlob = buildBlob(response.data, contentType)
              let filename = scope.transactionId + '_' + _.camelCase(scope.path) + extension
              saveAs(bodyBlob, filename)
            }).catch(onError)
          } else {
            Alerting.AlertAddServerMsg('Invalid body Id')
          }
        }

        let onError = function (err) {
          Alerting.AlertAddServerMsg(err.status)
        }

        Api.Transactions.get({ transactionId: scope.transactionId, filterRepresentation: 'full' }, onSuccess, onError)
      }
    }
  }
}
