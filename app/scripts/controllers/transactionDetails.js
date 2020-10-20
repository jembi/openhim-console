import moment from 'moment'

import { TransactionsRerunModalCtrl, TransactionsAddReqResModalCtrl, TransactionsBodyModalCtrl } from './'
import { beautifyIndent, returnContentType } from '../utils'

import transactionsRerunModal from '~/views/transactionsRerunModal'
import transactionsAddReqResModal from '~/views/transactionsAddReqResModal'
import transactionsBodyModal from '~/views/transactionsBodyModal'

export function TransactionDetailsCtrl ($scope, $uibModal, $compile, $location, $routeParams, Api, Alerting, config) {
  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  // get txList for paging
  let txList = JSON.parse(sessionStorage.getItem('currTxList'))
  $scope.pagingEnabled = (!txList || txList.indexOf($routeParams.transactionId) === -1) ? false : true

  $scope.next = null
  $scope.prev = null
  if ($scope.pagingEnabled) {
    let currTxIndex = txList.indexOf($routeParams.transactionId)

    $scope.txNumber = currTxIndex + 1
    $scope.txTotal = txList.length
    $scope.currFilterURL = sessionStorage.getItem('currFilterURL')

    if (currTxIndex !== 0) {
      $scope.prev = txList[currTxIndex - 1]
    }
    if (currTxIndex !== txList.length - 1) {
      $scope.next = txList[currTxIndex + 1]
    }
  }

  /*
    Default length of transaction response or request body returned is less than 1024
    The following flags are used to determine whether the full transaction request or response body has been retrieved
  */
  const defaultLengthOfBodyToDisplay = config.defaultLengthOfBodyToDisplay
  $scope.partialResponseBody = false
  $scope.partialRequestBody = false

  const retrieveBodyProperties = function (response) {
    const properties = {}
    const contentRange = response.headers('content-range') ? response.headers('content-range') : ''
    const match = contentRange.match(/\d+/g)

    if (match && match[0]) properties.start = match[0]
    if (match && match[1]) properties.end = match[1]
    if (match && match[2]) properties.bodyLength = match[2]

    return properties
  }

  let querySuccess = function (transactionDetails) {
    $scope.transactionDetails = transactionDetails

    if (transactionDetails.request && transactionDetails.request.bodyId) {
      $scope.retrieveTransactionRequestBody = function (start=0, end=defaultLengthOfBodyToDisplay) {
        Api.TransactionBodies($routeParams.transactionId, transactionDetails.request.bodyId, start, end).then(response => {
          const { start, end, bodyLength } = retrieveBodyProperties(response)

          if (start && end && bodyLength) {
            $scope.requestBodyStart = start
            $scope.requestBodyEnd = end
            $scope.requestBodyLength = bodyLength

            if ((bodyLength - end) > 1) {
              $scope.partialRequestBody = true
            }
          }

          if (transactionDetails.request.headers && returnContentType(transactionDetails.request.headers)) {
            let requestTransform = beautifyIndent(returnContentType(transactionDetails.request.headers), response.data)
            $scope.transactionDetails.request.body = requestTransform.content
          }
        }).catch(queryError)
      }
      $scope.retrieveTransactionRequestBody()
    }

    if (transactionDetails.response && transactionDetails.response.bodyId) {
      $scope.retrieveTransactionResponseBody = function (start=0, end=defaultLengthOfBodyToDisplay) {
        Api.TransactionBodies($routeParams.transactionId, transactionDetails.response.bodyId, start, end).then(response => {
          const { start, end, bodyLength } = retrieveBodyProperties(response)

          if (start && end && bodyLength) {
            $scope.responseBodyStart = start
            $scope.responseBodyEnd = end
            $scope.responseBodyLength = bodyLength

            if ((bodyLength - end) > 1) {
              $scope.partialResponseBody = true
            }
          }

          if (transactionDetails.response.headers && returnContentType(transactionDetails.response.headers)) {
            let responseTransform = beautifyIndent(returnContentType(transactionDetails.response.headers), response.data)
            $scope.transactionDetails.response.body = responseTransform.content
          }
        }).catch(queryError)
      }
      $scope.retrieveTransactionResponseBody()
    }

    // calculate total transaction time
    if ((transactionDetails.request && transactionDetails.request.timestamp) &&
      (transactionDetails.response && transactionDetails.response.timestamp)) {
      let diff = moment(transactionDetails.response.timestamp) - moment(transactionDetails.request.timestamp)

      transactionDetails.transactionTime = diff >= 1000 ? (Math.round(diff / 1000.0) + 's') : (diff + 'ms')
    }

    let consoleSession = localStorage.getItem('consoleSession')
    consoleSession = JSON.parse(consoleSession)
    $scope.consoleSession = consoleSession

    // get the user to find user roles
    Api.Users.get({ email: $scope.consoleSession.sessionUser }, function (user) {
      // get the channels for the transactions filter dropdown
      Api.Channels.get({ channelId: transactionDetails.channelID }, function (channel) {
        $scope.channel = channel
        $scope.routeDefs = {}
        channel.routes.forEach(function (route) {
          $scope.routeDefs[route.name] = route
        })

        if (typeof channel.status === 'undefined' || channel.status === 'enabled') {
          if (user.groups.indexOf('admin') >= 0) {
            $scope.rerunAllowed = true
          } else {
            angular.forEach(user.groups, function (role) {
              if (channel.txRerunAcl.indexOf(role) >= 0) {
                $scope.rerunAllowed = true
              }
            })
          }
        }
      }, function () { /* server error - could not connect to API to get channels */ })
    }, function () { /* server error - could not connect to API to get user details */ })

    // if clientID exist - fetch details
    if (transactionDetails.clientID) {
      // get the client object for the transactions details page
      $scope.client = Api.Clients.get({ clientId: transactionDetails.clientID, property: 'clientName' })
    }
  }

  let queryError = function (err) {
    // on error - add server error alert
    Alerting.AlertAddServerMsg(err.status)
  }

  // get the Data for the supplied ID and store in 'transactionsDetails' object
  Api.Transactions.get({ transactionId: $routeParams.transactionId, filterRepresentation: 'full' }, querySuccess, queryError)

  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  /*******************************************************************/
  /**         Transactions List and Detail view functions           **/
  /*******************************************************************/

  // setup filter options
  $scope.returnFilterObject = function () {
    let filtersObject = {}

    filtersObject.filterPage = 0
    filtersObject.filterLimit = 0
    filtersObject.filters = {}
    filtersObject.filters.parentID = $routeParams.transactionId

    return filtersObject
  }

  // Refresh transactions list
  $scope.fetchChildTransactions = function () {
    Api.Transactions.query($scope.returnFilterObject(), function (values) {
      // on success
      $scope.childTransactions = values
    },
      function (err) {
        Alerting.AlertAddServerMsg(err.status)
      })
  }
  // run the transaction list view for the first time
  $scope.fetchChildTransactions()

  // location provider - load transaction details
  $scope.viewTransactionDetails = function (path) {
    // do transactions details redirection when clicked on TD
    $location.path(path)
  }

  /*******************************************************************/
  /**         Transactions List and Detail view functions           **/
  /*******************************************************************/

  /****************************************************************/
  /**               Transactions ReRun Functions                 **/
  /****************************************************************/

  $scope.confirmRerunTransactions = function () {
    let transactionsSelected = [$scope.transactionDetails._id]
    let rerunTransactionsSelected = 0

    // check if transaction has child IDs (It has been rerun before)
    if ($scope.transactionDetails.childIDs) {
      if ($scope.transactionDetails.childIDs.length > 0) {
        rerunTransactionsSelected = 1
      }
    }

    $uibModal.open({
      template: transactionsRerunModal,
      controller: TransactionsRerunModalCtrl,
      resolve: {
        transactionsSelected: function () {
          return transactionsSelected
        },
        rerunTransactionsSelected: function () {
          return rerunTransactionsSelected
        }
      }
    })
  }

  /****************************************************************/
  /**               Transactions ReRun Functions                 **/
  /****************************************************************/

  /*********************************************************************/
  /**               Transactions View Route Functions                 **/
  /*********************************************************************/

  $scope.viewAddReqResDetails = function (record, channel, recordType, index) {
    $uibModal.open({
      template: transactionsAddReqResModal,
      controller: TransactionsAddReqResModalCtrl,
      windowClass: 'modal-fullview',
      resolve: {
        record: function () {
          return record
        },
        channel: function () {
          return channel
        },
        transactionId: function () {
          return $scope.transactionDetails._id
        },
        recordType: function () {
          return recordType
        },
        index: function () {
          return index
        }
      }
    })
  }

  /*********************************************************************/
  /**               Transactions View Route Functions                 **/
  /*********************************************************************/

  /********************************************************************/
  /**               Transactions View Body Functions                 **/
  /********************************************************************/

  $scope.viewBodyDetails = function (type, content, headers) {
    $uibModal.open({
      template: transactionsBodyModal,
      controller: TransactionsBodyModalCtrl,
      windowClass: 'modal-fullview',
      resolve: {
        bodyData: function () {
          return { type: type, content: content, headers: headers }
        }
      }
    })
  }

  /********************************************************************/
  /**               Show transactions that have been rerun                 **/
  /********************************************************************/

  // Content function is called twice. This is a flag to check whether the function has been called already,
  // if set to true second call does not happen
  let contentCalled = false

  $scope.showTransactionsRerun = function () {
    const data = $('#rerun-table').html()

    if (!contentCalled) {
      contentCalled = true

      $('#rerun-popover').popover({
        content: $compile(data)($scope),
        html: true
      })

      $('#rerun-popover').popover('show')
    }
  }

  /********************************************************************/
  /**               Transactions View Body Functions                 **/
  /********************************************************************/
}
