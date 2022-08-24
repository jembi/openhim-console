const MAX_BATCH_SIZE = 64

function * getBatchSizes (currentBatchSize) {
  yield { value: 1, label: 'One at a time' }

  let currentValue = 2
  while (currentValue <= Math.min(currentBatchSize, MAX_BATCH_SIZE)) {
    yield { value: currentValue, label: `${currentValue} at a time` }
    currentValue *= 2
  }
}

export function TransactionsRerunModalCtrl ($scope, $uibModalInstance, Api, Notify, Alerting, transactionsSelected, rerunTransactionsSelected) {
  $scope.rerunSuccess = false
  $scope.transactionsSelected = transactionsSelected
  $scope.rerunTransactionsSelected = rerunTransactionsSelected
  $scope.taskSetup = {}
  $scope.taskSetup.batchSize = 1
  $scope.taskSetup.paused = false
  $scope.batchSizes = Array.from(getBatchSizes(transactionsSelected.length))

  if (rerunTransactionsSelected === 1 && transactionsSelected.length === 1) {
    Alerting.AlertAddMsg('rerun', 'warning', 'This transaction has already been rerun')
  } else if (rerunTransactionsSelected > 0) {
    Alerting.AlertAddMsg('rerun', 'warning', rerunTransactionsSelected + ' of these transactions have already been rerun')
  }

  function onSuccess () {
    // On success
    Notify.notify('TasksChanged')
    $scope.rerunSuccess = true
    $scope.$emit('transactionRerunSuccess')
  };

  const onError = function (err) {
    Alerting.AlertAddServerMsg(err.status)
  }

  const onFetchTransactions = function (transactions) {
    const tIds = transactions.map(function (tx) { return tx._id })
    createTask(tIds, () => {})
  }

  const createRerunTasks = function(filters, numOfTransactions) {
    const pages = Math.ceil(numOfTransactions/filters.filterLimit)

    for (let index = 0; index < pages; index++) {
      filters.filterPage = index
      Api.Transactions.query(filters, onFetchTransactions, onError)
    }
    onSuccess()
  }

  function createTask (tIds, onSuccess) {
    $scope.task = new Api.Tasks({ tids: tIds, batchSize: $scope.taskSetup.batchSize, paused: $scope.taskSetup.paused })
    $scope.task.$save({}, onSuccess)
  }

  $scope.confirmRerun = function () {
    if ($scope.bulkRerunActive) {
      const filters = $scope.returnFilters()
      filters.filterLimit = $scope.defaultBulkRerunLimit
      filters.filterPage = 0

      createRerunTasks(filters, $scope.transactionsCount)
    } else {
      createTask($scope.transactionsSelected, onSuccess)
    }
    $scope.rerunSuccess = true
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }
}
