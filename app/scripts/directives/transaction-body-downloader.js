'use strict';
/* global _:false */
/* global buildBlob:false */
/* global saveAs:false */

angular.module('openhimConsoleApp')
  .directive('transactionBodyDownloader', function (Api) {
    return {
      restrict: 'EA',
      template: '<div class="btn btn-primary" ng-click="download()"><i class="glyphicon glyphicon-download-alt"></i></div>',
      scope: {
        transactionId: '=',
        path: '='
      },
      link: function(scope) {
        scope.download = function () {
          var onSuccess = function (trx) {
            var subTrx = _.get(trx, scope.path);

            var contentType = 'text/plain'; // default
            if (subTrx.headers && subTrx.headers['content-type']) {
              contentType = subTrx.headers['content-type'];
            }

            var extension;
            if (contentType.indexOf('json') > -1) {
              extension = '.json';
            } else if (contentType.indexOf('xml') > -1) {
              extension = '.xml';
            } else {
              extension = '.txt';
            }

            var bodyBlob = buildBlob(subTrx.body, contentType);
            var filename = scope.transactionId + '_' + _.camelCase(scope.path) + extension;
            saveAs(bodyBlob, filename);
          };

          var onError = function (err) {
            console.log(err);
          };

          Api.Transactions.get({ transactionId: scope.transactionId, filterRepresentation: 'full' }, onSuccess, onError);
        };
      }
    };
  });
