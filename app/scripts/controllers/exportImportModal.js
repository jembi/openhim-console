import transactionsBodyModal from '~/views/transactionsBodyModal'
import { TransactionsBodyModalCtrl } from './'
export function ExportImportModalCtrl ($scope, $uibModalInstance, $uibModal, $timeout, Api, Alerting, data) {
  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  $scope.outcome = {
    selectedAll: false
  }
  $scope.ngErrors = {}
  $scope.conflicts = []
  $scope.validImports = []
  $scope.invalidImports = []
  $scope.importStatus = 'resolvingConflicts'

  for (let i = 0; i < data.length; i++) {
    if (data[i].status === 'Conflict') {
      data[i].action = 'ignore'
      if (data[i].model === 'Keystore') { data[i].duplicatePrevented = true }
      $scope.conflicts.push(data[i])
    } else if (data[i].status === 'Valid') {
      $scope.validImports.push(data[i])
    } else if (data[i].status === 'Error') {
      $scope.invalidImports.push(data[i])
    }
  }

  $scope.cancel = function () {
    $timeout.cancel($scope.clearValidationRoute)
    $uibModalInstance.dismiss('cancel')
  }

  $scope.resetErrors = function () {
    Alerting.AlertReset()
    $scope.ngErrors.hasErrors = false
    angular.forEach($scope.conflicts, function (item) {
      item.errMsg = undefined
    })
  }

  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  /****************************************/
  /**         Import Functions           **/
  /****************************************/

  // import failed function
  let importFail = function (err) {
    Alerting.AlertReset()
    Alerting.AlertAddMsg('top', 'danger', 'An error has occurred during the import: #' + err.status + ' - ' + err.data)
  }

  // import success function
  let importSuccess = function (data, callback) {
    $scope.importStatus = 'done'
    $uibModalInstance.close(data)
    if (callback) { callback() }
  }

  // function to run import file
  $scope.runImportFile = function (importData, callback) {
    Api.Metadata.save(importData, function (result) {
      importSuccess(result, callback)
    }, importFail)
  }

  $scope.validateImport = function (callback) {
    // update the uid for each
    angular.forEach($scope.conflicts, function (item) {
      if (item.action && item.action === 'duplicate') {
        let err = 'Needs to be different to original uid.'
        if (item.model === 'Channels' && item.record.name === item.uid) { item.errMsg = err } else if (item.model === 'Clients' && item.record.clientID === item.uid) { item.errMsg = err } else if (item.model === 'Mediators' && item.record.urn === item.uid) { item.errMsg = err } else if (item.model === 'Users' && item.record.email === item.uid) { item.errMsg = err } else if (item.model === 'ContactGroups' && item.record.groups === item.uid) { item.errMsg = err }
      }
    })

    $scope.ngErrors.hasErrors = $scope.conflicts.some(function (item) {
      return item.errMsg && item.errMsg.length > 0
    })

    if ($scope.ngErrors.hasErrors) {
      $scope.clearValidationRoute = $timeout(function () {
        console.log('reset errors')
        // clear errors after 5 seconds
        $scope.resetErrors()
      }, 5000)
      Alerting.AlertAddMsg('hasErrorsImport', 'danger', 'There are errors on the import form.')
    }

    if (callback) {
      const result = !$scope.ngErrors.hasErrors
      callback(result)
    } else {
      return !$scope.ngErrors.hasErrors
    }
  }

  $scope.saveImport = function (callback) {
    $scope.validateImport(function (result) {
      if (result) {
        $scope.importStatus = 'progress'

        // setup data object
        $scope.resolvedData = {
          'Channels': [],
          'Clients': [],
          'Mediators': [],
          'Users': [],
          'ContactGroups': [],
          'Keystore': []
        }

        angular.forEach($scope.conflicts, function (item) {
          // update the uid for each
          if (item.action && item.action === 'duplicate') {
            if (item.model === 'Channels') { item.record.name = item.uid } else if (item.model === 'Clients') { item.record.clientID = item.uid } else if (item.model === 'Mediators') { item.record.urn = item.uid } else if (item.model === 'Users') { item.record.email = item.uid } else if (item.model === 'ContactGroups') { item.record.groups = item.uid }
          }

          if (item.action && item.action !== 'ignore') {
            if (item.model === 'Channels') { $scope.resolvedData.Channels.push(item.record) } else if (item.model === 'Clients') { $scope.resolvedData.Clients.push(item.record) } else if (item.model === 'Mediators') { $scope.resolvedData.Mediators.push(item.record) } else if (item.model === 'Users') { $scope.resolvedData.Users.push(item.record) } else if (item.model === 'ContactGroups') { $scope.resolvedData.ContactGroups.push(item.record) } else if (item.model === 'Keystore') { $scope.resolvedData.Keystore.push(item.record) }
          }
        })

        angular.forEach($scope.validImports, function (item) {
          if (item.model === 'Channels') { $scope.resolvedData.Channels.push(item.record) } else if (item.model === 'Clients') { $scope.resolvedData.Clients.push(item.record) } else if (item.model === 'Mediators') { $scope.resolvedData.Mediators.push(item.record) } else if (item.model === 'Users') { $scope.resolvedData.Users.push(item.record) } else if (item.model === 'ContactGroups') { $scope.resolvedData.ContactGroups.push(item.record) } else if (item.model === 'Keystore') { $scope.resolvedData.Keystore.push(item.record) }
        })

        // read the import script data and process
        if ($scope.resolvedData.Channels.length > 0 ||
          $scope.resolvedData.Clients.length > 0 ||
          $scope.resolvedData.Users.length > 0 ||
          $scope.resolvedData.Mediators.length > 0 ||
          $scope.resolvedData.ContactGroups.length > 0 ||
          $scope.resolvedData.Keystore.length > 0) {
          $scope.runImportFile($scope.resolvedData, callback)
        } else {
          $uibModalInstance.close()
          const message = 'Nothing to import'
          if (callback) { callback(message) }
        }
      }
    })
  }

  $scope.viewRecordDetails = function (event, type, content) {
    event.preventDefault()
    $uibModal.open({
      template: transactionsBodyModal,
      controller: TransactionsBodyModalCtrl,
      windowClass: 'modal-fullview',
      resolve: {
        bodyData: function () {
          return { type: type, content: content, headers: { 'content-type': 'application/json' } }
        }
      }
    })
  }

  $scope.selectAll = function () {
    angular.forEach($scope.conflicts, function (item) {
      item.action = !$scope.outcome.selectedAll ? 'overwrite' : (item.action === 'overwrite' ? 'ignore' : item.action)
    })
  }

  $scope.checkIfAllOverwrites = function () {
    $scope.outcome.selectedAll = $scope.conflicts.every(function (item) {
      return item.action === 'overwrite'
    })
  }
  $scope.checkIfAllOverwrites()

  /****************************************/
  /**         Import Functions           **/
  /****************************************/
}
