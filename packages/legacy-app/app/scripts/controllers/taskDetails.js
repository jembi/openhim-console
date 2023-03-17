import confirmModal from '~/views/confirmModal'
import { ConfirmModalCtrl } from './'
import { valueNotEmpty } from '../utils'

export function TaskDetailsCtrl ($scope, $uibModal, $location, $routeParams, Api, Alerting, $route) {
  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  $scope.limits = [10, 50, 100, 200, 500]
  // default settings
  $scope.showpage = 1
  $scope.showlimit = 100
  $scope.filters = {}
  $scope.filters.limit = 100
  $scope.settings = {}
  $scope.settings.list = {}
  $scope.settings.list.tabview = 'same'

  // setup task filtter settings
  if ($location.search().limit) { $scope.filters.limit = $location.search().limit }
  if ($location.search().tstatus) { $scope.filters.tstatus = $location.search().tstatus }
  if ($location.search().rerunStatus) { $scope.filters.rerunStatus = $location.search().rerunStatus }
  if ($location.search().hasErrors) { $scope.filters.hasErrors = $location.search().hasErrors }

  // find pagination filter parameters
  if ($location.search().page) { $scope.showpage = parseInt($location.search().page) }

  $scope.setPagination = function (pageNum) {
    // angular reloads controller on route change - Applies the pagination filter to API request
    $location.search('page', pageNum)
  }

  const querySuccess = function (task) {
    $scope.task = task
    $scope.totalFilteredTransactions = task.totalFilteredTransactions

    const showlimit = $scope.showlimit
    const showpage = $scope.showpage
    const pages = Math.ceil(task.totalFilteredTransactions / showlimit)

    // if page not set AND all transactions in the list - no filtering
    if ($scope.getProcessedPercentage(task) !== '100%' && task.totalFilteredTransactions > showlimit && !$location.search().page && task.totalTransactions === task.totalFilteredTransactions) {
      // set pagination to current transaction being processed
      const currentProcessed = $scope.getProcessedTotal(task)
      $scope.setPagination(Math.ceil(currentProcessed / showlimit))
    }

    $scope.pageIndexBase = (showpage - 1) * showlimit
    $scope.pagesArray = []

    for (let i = 1; i <= pages; i++) {
      let status = ''
      if (showpage === i) {
        status = 'active'
      }
      $scope.pagesArray.push({ pageNum: i, status: status })
    }
  }

  const queryError = function (err) {
    // on error - add server error alert
    Alerting.AlertAddServerMsg(err.status)
  }

  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  // setup filter options
  $scope.returnFilters = function () {
    const filtersObject = {}

    filtersObject.taskId = $routeParams.taskId

    // minus 1 from showpage to use correct index for slicing the results
    filtersObject.filterPage = $scope.showpage - 1
    filtersObject.filterLimit = $scope.showlimit

    /* ##### construct filters ##### */
    filtersObject.filters = {}

    /* ----- filter by tasks (basic) ----- */
    // add task status filter
    const tstatus = $scope.filters.tstatus
    if (valueNotEmpty(tstatus) === true) {
      filtersObject.filters.tstatus = tstatus
    }

    const rerunStatus = $scope.filters.rerunStatus
    if (valueNotEmpty(rerunStatus) === true) {
      filtersObject.filters.rerunStatus = rerunStatus
    }

    const hasErrors = $scope.filters.hasErrors
    if (valueNotEmpty(hasErrors) === true) {
      filtersObject.filters.hasErrors = hasErrors
    }
    /* ----- filter by tasks (basic) ----- */

    /* ##### construct filters ##### */
    return filtersObject
  }

  const clearUrlParams = function () {
    // loop through all parameters
    for (const property in $location.search()) {
      if ($location.search().hasOwnProperty(property)) {
        // set parameter to null to remove
        $location.search(property, null)
      }
    }
  }

  $scope.applyFiltersToUrl = function () {
    // get the filter params object before clearing them
    const filterParamsBeforeClear = JSON.stringify(angular.copy($location.search()))

    // first clear existing filters
    clearUrlParams()

    // Add filters to url
    if ($scope.filters.limit) { $location.search('limit', $scope.filters.limit) }
    if ($scope.filters.tstatus) { $location.search('tstatus', $scope.filters.tstatus) }
    if ($scope.filters.rerunStatus) { $location.search('rerunStatus', $scope.filters.rerunStatus) }
    if ($scope.filters.hasErrors) { $location.search('hasErrors', $scope.filters.hasErrors) }

    // get the filter params object after clearing them
    const filterParamsAfterClear = JSON.stringify(angular.copy($location.search()))

    // if the filters object stays the same then call refresh function
    // if filters object not the same then angular changes route and loads controller ( refresh )
    if (filterParamsBeforeClear === filterParamsAfterClear) {
      $scope.refreshTaskDetails()
    }
  }

  $scope.refreshTaskDetails = function () {
    Alerting.AlertReset()

    $scope.task = null
    $scope.showlimit = $scope.filters.limit

    // do the initial request
    Api.Tasks.get($scope.returnFilters(), querySuccess, queryError)
  }
  // run the tasks list view for the first time
  $scope.refreshTaskDetails()

  // Clear filter data end refresh tasks scope
  $scope.clearFilters = function () {
    // reset default filters
    $scope.filters.limit = 100
    $scope.filters.tstatus = ''
    $scope.filters.rerunStatus = ''
    $scope.filters.hasErrors = ''
    $scope.settings.list.tabview = 'same'

    // get the filter params object before clearing them
    const filterParamsBeforeClear = JSON.stringify(angular.copy($location.search()))

    // clear all filter parameters
    clearUrlParams()

    // get the filter params object after clearing them
    const filterParamsAfterClear = JSON.stringify(angular.copy($location.search()))

    // if the filters object stays the same then call refresh function
    // if filters object not the same then angular changes route and loads controller ( refresh )
    if (filterParamsBeforeClear === filterParamsAfterClear) {
      $scope.refreshTaskDetails()
    }
  }

  /**************************************************/
  /**         Task Calculation Functions           **/
  /**************************************************/

  $scope.getProcessedTotal = function (task) {
    if (task) {
      const totalTransactions = task.totalTransactions
      const remainingTransactions = task.remainingTransactions
      return parseInt(totalTransactions - remainingTransactions)
    }
  }

  $scope.getProcessedPercentage = function (task) {
    if (task) {
      const totalTransactions = task.totalTransactions
      const remainingTransactions = task.remainingTransactions
      const completedTransactions = totalTransactions - remainingTransactions
      return (100 / totalTransactions * completedTransactions).toFixed(0) + '%'
    }
  }

  $scope.getExecutionTime = function (task) {
    if (task) {
      if (task.completedDate) {
        const created = new Date(task.created)
        const completedDate = new Date(task.completedDate)
        const miliseconds = completedDate - created
        const seconds = miliseconds / 1000
        return seconds.toFixed(2)
      } else {
        return 0
      }
    }
  }

  $scope.viewTransactionDetails = function (path) {
    const baseUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#!/'
    const txUrl = baseUrl + path
    if ($scope.settings.list.tabview && $scope.settings.list.tabview === 'new') {
      window.open(txUrl, '_blank')
    } else {
      $location.path(path)
    }
  }

  /**************************************************/
  /**         Task Calculation Functions           **/
  /**************************************************/

  function updateTaskWithStatus (task, status) {
    const updated = new Api.Tasks()
    updated._id = task._id
    updated.status = status
    updated.$update({}, function () {
      $route.reload()
    })
  }

  $scope.pauseTask = function (task) {
    updateTaskWithStatus(task, 'Paused')
  }

  $scope.resumeTask = function (task) {
    updateTaskWithStatus(task, 'Queued')
  }

  $scope.cancelTask = function (task) {
    const cancelObject = {
      title: 'Cancel Task',
      button: 'Yes',
      message: 'Are you sure you want to cancel this task?'
    }

    const modalInstance = $uibModal.open({
      template: confirmModal,
      controller: ConfirmModalCtrl,
      resolve: {
        confirmObject: function () {
          return cancelObject
        }
      }
    })

    modalInstance.result.then(function () {
      // cancel confirmed
      updateTaskWithStatus(task, 'Cancelled')
    }, function () {
      // cancel cancelled
    })
  }
}
