import moment from 'moment'
import { valueNotEmpty } from '../utils'
import { ConfirmModalCtrl } from './'
import confirmModal from '~/views/confirmModal'

export function TasksCtrl ($scope, $uibModal, $location, $interval, Api, Alerting, $route) {
  /**********************************************/
  /**         Initial load functions           **/
  /**********************************************/

  // remember when we loaded the page...
  const pageLoadDate = moment()
  $scope.limits = [10, 50, 100, 200, 500]
  // default settings
  $scope.showpage = 0
  $scope.showlimit = 10
  $scope.filters = {}
  $scope.filters.limit = 10
  $scope.settings = {}
  $scope.settings.list = {}
  $scope.settings.list.tabview = 'same'
  $scope.settings.list.autoupdate = true

  // polling
  let lastUpdated
  let serverDiffTime = 0
  $scope.baseIndex = 0
  const pollPeriod = 5000

  // setup task filtter settings
  if ($location.search().limit) { $scope.filters.limit = $location.search().limit }
  if ($location.search().date) { $scope.filters.date = $location.search().date }
  if ($location.search().status) { $scope.filters.status = $location.search().status }
  if ($location.search().user) { $scope.filters.user = $location.search().user }

  // get the users for the tasks filter dropdown
  $scope.users = Api.Users.query()

  $scope.refreshSuccess = function (tasks) {
    // on success
    $scope.tasks = tasks

    if (tasks.length < $scope.showlimit) {
      $('#loadMoreBtn').hide()

      if (tasks.length === 0) {
        Alerting.AlertAddMsg('bottom', 'warning', 'There are no tasks for the current filters')
      }
    } else {
      // Show the load more button
      $('#loadMoreBtn').show()
    }
  }

  $scope.refreshError = function (err) {
    // on error - Hide load more button and show error message
    $('#loadMoreBtn').hide()
    Alerting.AlertAddServerMsg(err.status)
  }

  // setup filter options
  $scope.returnFilters = function () {
    const filtersObject = {}
    let filterDate

    filtersObject.filterPage = $scope.showpage
    filtersObject.filterLimit = $scope.showlimit

    /* ##### construct filters ##### */
    filtersObject.filters = {}

    // date filter
    filterDate = $scope.filters.date
    if (filterDate) {
      const startDate = moment(filterDate).format()
      const endDate = moment(filterDate).endOf('day').format()
      filtersObject.filters.created = JSON.stringify({ $gte: startDate, $lte: endDate })
    }

    /* ----- filter by tasks (basic) ----- */
    // add task status filter
    const taskStatus = $scope.filters.status
    if (valueNotEmpty(taskStatus) === true) {
      filtersObject.filters.status = taskStatus
    }

    const taskUser = $scope.filters.user
    if (valueNotEmpty(taskUser) === true) {
      filtersObject.filters.user = taskUser
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

  $scope.applyFilterIfValidDate = function (date) {
    if (moment(date, 'YYYY-MM-DD', true).isValid()) {
      $scope.applyFiltersToUrl()
    }
  }

  $scope.applyFiltersToUrl = function () {
    // get the filter params object before clearing them
    const filterParamsBeforeClear = JSON.stringify(angular.copy($location.search()))

    // first clear existing filters
    clearUrlParams()

    // Add filters to url
    if ($scope.filters.status) { $location.search('status', $scope.filters.status) }
    if ($scope.filters.user) { $location.search('user', $scope.filters.user) }
    if ($scope.filters.limit) { $location.search('limit', $scope.filters.limit) }
    if ($scope.filters.date) { $location.search('date', $scope.filters.date) }

    // get the filter params object after clearing them
    const filterParamsAfterClear = JSON.stringify(angular.copy($location.search()))

    // if the filters object stays the same then call refresh function
    // if filters object not the same then angular changes route and loads controller ( refresh )
    if (filterParamsBeforeClear === filterParamsAfterClear) {
      $scope.refreshTasksList()
    }
  }

  $scope.refreshTasksList = function () {
    Alerting.AlertReset()

    $scope.tasks = null

    // reset the showpage filter to start at 0
    $scope.showpage = 0
    $scope.showlimit = $scope.filters.limit

    // do the initial request
    Api.Tasks.query($scope.returnFilters(), $scope.refreshSuccess, $scope.refreshError)
  }
  // run the tasks list view for the first time
  $scope.refreshTasksList()

  // Refresh tasks list
  const loadMoreSuccess = function (tasks) {
    // on success
    $scope.tasks = $scope.tasks.concat(tasks)
    // remove any duplicates objects found in the tasks scope
    $scope.tasks = $.unique($scope.tasks)

    if (tasks.length < $scope.showlimit) {
      $('#loadMoreBtn').hide()
      Alerting.AlertAddMsg('bottom', 'warning', 'There are no more tasks to retrieve')
    }

    // make sure newly added tasks are checked as well
    $scope.busyLoadingMore = false
  }

  const loadMoreError = function (err) {
    // on error - Hide load more button and show error message
    $('#loadMoreBtn').hide()
    Alerting.AlertAddServerMsg(err.status)
  }

  $scope.loadMoreTasks = function () {
    $scope.busyLoadingMore = true
    Alerting.AlertReset()

    $scope.showpage++

    const filters = $scope.returnFilters()

    if (!filters.filters.created) {
      // use page load time as an explicit end date
      // this prevents issues with paging when new tasks come in, breaking the pages
      filters.filters.created = JSON.stringify({ $lte: moment(pageLoadDate - serverDiffTime).format() })
    }

    Api.Tasks.query($scope.returnFilters(), loadMoreSuccess, loadMoreError)
  }

  // Clear filter data end refresh tasks scope
  $scope.clearFilters = function () {
    // reset default filters
    $scope.filters.limit = 100
    $scope.filters.date = ''
    $scope.filters.status = ''
    $scope.filters.user = ''
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
      $scope.refreshTasksList()
    }
  }

  /**********************************************/
  /**         Initial load functions           **/
  /**********************************************/

  /*****************************************************/
  /**         General rerun task functions            **/
  /*****************************************************/

  $scope.viewTaskDetails = function (path) {
    const baseUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#/'
    const taskUrl = baseUrl + path
    if ($scope.settings.list.tabview && $scope.settings.list.tabview === 'new') {
      window.open(taskUrl, '_blank')
    } else {
      $location.path(path)
    }
  }

  $scope.getProcessedTotal = function (task) {
    const totalTransactions = task.totalTransactions
    const remainingTransactions = task.remainingTransactions
    return parseInt(totalTransactions - remainingTransactions)
  }

  $scope.getProcessedPercentage = function (task) {
    const totalTransactions = task.totalTransactions
    const remainingTransactions = task.remainingTransactions
    const completedTransactions = totalTransactions - remainingTransactions
    return (100 / totalTransactions * completedTransactions).toFixed(0) + '%'
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

  /*****************************************************/
  /**         General rerun task functions            **/
  /*****************************************************/

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

  /****************************************************/
  /**         Poll for latest tasks                  **/
  /****************************************************/

  let pollingInterval
  let lastPollingCompleted = true

  $scope.pollForLatest = function () {
    const filters = $scope.returnFilters()

    if (!filters.filters.created) {
      // only poll for latest if date filters are OFF

      filters.filters.created = JSON.stringify({ $gte: moment(lastUpdated).format() })
      lastUpdated = moment() - serverDiffTime

      delete filters.filterPage
      delete filters.filterLimit
      lastPollingCompleted = false

      Api.Tasks.query(filters, function (tasks) {
        lastPollingCompleted = true
        tasks.forEach(function (task) {
          $scope.tasks.unshift(task)
          $scope.baseIndex--
        })
      })
    }
  }

  // poll for updates for any tasks that are marked as 'Processing' or 'Queued'
  // TODO need an endpoint in core to lookup a several tasks by _id at once
  $scope.pollForProcessingUpdates = function () {
    $scope.tasks.forEach(function (task) {
      if (task.status === 'Processing' || task.status === 'Queued') {
        const taskFilters = {}
        taskFilters.taskId = task._id
        taskFilters.filterPage = 0
        taskFilters.filterLimit = 0
        taskFilters.filters = {}

        Api.Tasks.get(taskFilters, function (result) {
          $scope.tasks.forEach(function (scopeTask) {
            if (scopeTask._id === result._id) {
              scopeTask.status = result.status
              scopeTask.remainingTransactions = result.remainingTransactions
              scopeTask.completedDate = result.completedDate
            }
          })
        })
      }
    })
  }

  $scope.startPolling = function () {
    if (!pollingInterval) {
      pollingInterval = $interval(function () {
        if (lastPollingCompleted) {
          $scope.pollForLatest()
          $scope.pollForProcessingUpdates()
        }
      }, pollPeriod)
    }
  }

  $scope.stopPolling = function () {
    if (angular.isDefined(pollingInterval)) {
      $interval.cancel(pollingInterval)
      pollingInterval = undefined
    }
  }

  // sync time with server
  Api.Heartbeat.get(function (heartbeat) {
    serverDiffTime = moment() - moment(heartbeat.now)
    lastUpdated = moment() - serverDiffTime
    if ($scope.settings.list.autoupdate) {
      $scope.startPolling()
    }
  })

  $scope.$on('$destroy', $scope.stopPolling)

  /****************************************************/
  /**         Poll for latest transactions           **/
  /****************************************************/
}
