import moment from 'moment'
import { valueNotEmpty } from '../utils'
import transactionsRerunModal from '~/views/transactionsRerunModal'
import { TransactionsRerunModalCtrl } from './transactionsRerunModal'

export function TransactionsCtrl ($scope, $uibModal, $location, $timeout, $interval, Api, Alerting) {
  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  // remember when we loaded the page...
  const pageLoadDate = moment()

  $scope.limits = [10, 20, 50, 100, 200, 500]
  // set default limit
  const defaultLimit = 20
  const defaultWasRerun = 'dont-filter'
  const defaultTabView = 'same'
  $scope.defaultBulkRerunLimit = 10000
  $scope.loadMoreBtn = false
  const defaultAutoUpdate = true

  // filters collapsed by default
  $scope.advancedFilters = {}
  $scope.advancedFilters.isCollapsed = true

  /* setup default filter options */
  $scope.showpage = 0
  $scope.checkbox = {}
  $scope.checkbox.checkAll = false
  $scope.transactionsSelected = []
  $scope.rerunTransactionsSelected = 0

  // default settings
  $scope.settings = {}
  $scope.settings.list = {}
  $scope.settings.list.tabview = defaultTabView
  $scope.settings.list.autoupdate = defaultAutoUpdate
  $scope.settings.filter = {}
  $scope.settings.filter.limit = defaultLimit

  let consoleSession = localStorage.getItem('consoleSession')
  consoleSession = JSON.parse(consoleSession)
  $scope.consoleSession = consoleSession
  const userSettings = consoleSession.sessionUserSettings
  const sessionUserEmail = consoleSession.sessionUser

  // polling
  let lastUpdated
  let serverDiffTime = 0
  $scope.baseIndex = 0
  const pollPeriod = 5000

  $scope.settings.filter.transaction = {}
  $scope.settings.filter.route = {}
  $scope.settings.filter.orchestration = {}
  // default value for reruns filter
  $scope.settings.filter.transaction.wasRerun = defaultWasRerun

  const isEmpty = function (obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false
      }
    }
    return true
  }

  const attachUserFiltersToScope = function (filters) {
    if (filters.limit && filters.limit !== 0) { $scope.settings.filter.limit = parseInt(filters.limit, 10) }
    if (!isEmpty(filters.transaction)) { $scope.settings.filter.transaction = filters.transaction }
    if (!isEmpty(filters.orchestration)) { $scope.settings.filter.orchestration = filters.orchestration }
    if (!isEmpty(filters.route)) { $scope.settings.filter.route = filters.route }
    $scope.settings.filter.startDate = filters.startDate
    $scope.settings.filter.endDate = filters.endDate
  }

  // check if no parameters exist and user has settings defined
  if (angular.equals({}, $location.search()) && userSettings) {
    if (userSettings.filter) {
      attachUserFiltersToScope(userSettings.filter)
    }

    if (userSettings.list) {
      $scope.settings.list.tabview = userSettings.list.tabview
      if (angular.isDefined(userSettings.list.autoupdate)) {
        $scope.settings.list.autoupdate = userSettings.list.autoupdate
      }
    }
  }

  // setup default transaction settings
  if ($location.search().limit) { $scope.settings.filter.limit = $location.search().limit }
  if ($location.search().startDate) { $scope.settings.filter.startDate = $location.search().startDate }
  if ($location.search().endDate) { $scope.settings.filter.endDate = $location.search().endDate }
  if ($location.search().txWasRerun) { $scope.settings.filter.transaction.wasRerun = $location.search().txWasRerun }

  // search for transaction filters
  if ($location.search().txStatus) { $scope.settings.filter.transaction.status = $location.search().txStatus }
  if ($location.search().txChannel) { $scope.settings.filter.transaction.channel = $location.search().txChannel }

  if ($location.search().txStatusCode) {
    $scope.settings.filter.transaction.statusCode = $location.search().txStatusCode
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().txHost) {
    $scope.settings.filter.transaction.host = $location.search().txHost
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().txPort) {
    $scope.settings.filter.transaction.port = $location.search().txPort
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().txPath) {
    $scope.settings.filter.transaction.path = $location.search().txPath
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().txParamKey) {
    $scope.settings.filter.transaction.requestParamKey = $location.search().txParamKey
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().txParamValue) {
    $scope.settings.filter.transaction.requestParamValue = $location.search().txParamValue
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().txClient) {
    $scope.settings.filter.transaction.client = $location.search().txClient
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().txPropertyKey) {
    $scope.settings.filter.transaction.propertyKey = $location.search().txPropertyKey
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().txPropertyValue) {
    $scope.settings.filter.transaction.propertyValue = $location.search().txPropertyValue
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().txHttpMethod) {
    $scope.settings.filter.transaction.method = $location.search().txHttpMethod
    $scope.advancedFilters.isCollapsed = false
  }

  // search for route filters
  if ($location.search().routeStatusCode) {
    $scope.settings.filter.route.statusCode = $location.search().routeStatusCode
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().routeHost) {
    $scope.settings.filter.route.host = $location.search().routeHost
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().routePort) {
    $scope.settings.filter.route.port = $location.search().routePort
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().routePath) {
    $scope.settings.filter.route.path = $location.search().routePath
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().routeParamKey) {
    $scope.settings.filter.route.requestParamKey = $location.search().routeParamKey
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().routeParamValue) {
    $scope.settings.filter.route.requestParamValue = $location.search().routeParamValue
    $scope.advancedFilters.isCollapsed = false
  }

  // search for orchestration filters
  if ($location.search().orchStatusCode) {
    $scope.settings.filter.orchestration.statusCode = $location.search().orchStatusCode
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().orchHost) {
    $scope.settings.filter.orchestration.host = $location.search().orchHost
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().orchPort) {
    $scope.settings.filter.orchestration.port = $location.search().orchPort
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().orchPath) {
    $scope.settings.filter.orchestration.path = $location.search().orchPath
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().orchParamKey) {
    $scope.settings.filter.orchestration.requestParamKey = $location.search().orchParamKey
    $scope.advancedFilters.isCollapsed = false
  }
  if ($location.search().orchParamValue) {
    $scope.settings.filter.orchestration.requestParamValue = $location.search().orchParamValue
    $scope.advancedFilters.isCollapsed = false
  }

  const userGroups = $scope.consoleSession.sessionUserGroups
  if (userGroups.indexOf('admin') >= 0) {
    $scope.rerunAllowedAdmin = true
  }

  // get the channels for the transactions filter dropdown
  $scope.channels = Api.Channels.query(function () {
    $scope.channelsMap = {}
    angular.forEach($scope.channels, function (channel) {
      $scope.channelsMap[channel._id] = {}
      $scope.channelsMap[channel._id].name = channel.name

      if (typeof channel.status === 'undefined' || channel.status === 'enabled') {
        if (userGroups.indexOf('admin') >= 0) {
          $scope.channelsMap[channel._id].rerun = true
        } else {
          const groupsAllowedToRerun = userGroups.filter(group => channel.txRerunAcl.includes(group))
          $scope.channelsMap[channel._id].rerun = groupsAllowedToRerun.length > 0
        }
      } else {
        $scope.channelsMap[channel._id].rerun = false
      }
    })
  }, function () { /* server error - could not connect to API to get channels */ })

  $scope.clientsIdNameMap = {}

  const clientsSuccess = function (clients) {
    $scope.clients = clients
    // Create client map of id to name
    $scope.clients.map(function (client) {
      $scope.clientsIdNameMap[client._id] = client.name
    })
  }
  // clients used for advanced filter dropdown and client name on transaction list
  Api.Clients.query(clientsSuccess)

  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  /*******************************************************************/
  /**         Transactions List and Detail view functions           **/
  /*******************************************************************/

  const buildDateFilterObject = function (object, comparator, date) {
    object[comparator] = moment(date).format()
  }

  // setup filter options
  $scope.returnFilters = function () {
    const filtersObject = {}
    let filterDateStart, filterDateEnd

    filtersObject.filterPage = $scope.showpage
    filtersObject.filterLimit = $scope.settings.filter.limit

    /* ##### construct filters ##### */
    filtersObject.filters = {}

    // date filter
    filterDateStart = $scope.settings.filter.startDate
    filterDateEnd = $scope.settings.filter.endDate

    if (filterDateStart || filterDateEnd) {
      const dateFilterObject = {}

      if (filterDateStart) { buildDateFilterObject(dateFilterObject, '$gte', filterDateStart) }
      if (filterDateEnd) { buildDateFilterObject(dateFilterObject, '$lte', filterDateEnd) }

      filtersObject.filters['request.timestamp'] = JSON.stringify(dateFilterObject)
    }

    /* ----- filter by transaction (basic) ----- */
    // add transaction status filter
    const txStatus = $scope.settings.filter.transaction.status
    if (valueNotEmpty(txStatus) === true) {
      filtersObject.filters.status = txStatus
    }

    const txChannel = $scope.settings.filter.transaction.channel
    if (valueNotEmpty(txChannel) === true) {
      filtersObject.filters.channelID = txChannel
    }
    /* ----- filter by transaction (basic) ----- */

    /* ----- filter by transaction (advanced) ----- */
    // add transaction status filter
    const txStatusCode = $scope.settings.filter.transaction.statusCode
    if (valueNotEmpty(txStatusCode) === true) {
      filtersObject.filters['response.status'] = txStatusCode
    }

    const txHost = $scope.settings.filter.transaction.host
    if (valueNotEmpty(txHost) === true) {
      filtersObject.filters['request.host'] = txHost
    }

    const txPort = $scope.settings.filter.transaction.port
    if (valueNotEmpty(txPort) === true) {
      filtersObject.filters['request.port'] = txPort
    }

    const txPath = $scope.settings.filter.transaction.path
    if (valueNotEmpty(txPath) === true) {
      filtersObject.filters['request.path'] = txPath
    }

    const txParamKey = $scope.settings.filter.transaction.requestParamKey
    const txParamValue = $scope.settings.filter.transaction.requestParamValue
    if (valueNotEmpty(txParamKey) === true) {
      filtersObject.filters['request.querystring'] = txParamKey

      if (valueNotEmpty(txParamValue) === true) {
        filtersObject.filters['request.querystring'] += '=' + txParamValue
      }
    }

    const txClient = $scope.settings.filter.transaction.client
    if (valueNotEmpty(txClient) === true) {
      filtersObject.filters.clientID = txClient
    }

    const txWasRerun = $scope.settings.filter.transaction.wasRerun
    if (valueNotEmpty(txWasRerun) === true) {
      // if wasRerun is 'yes' - query all transactions that have child IDs
      if (txWasRerun === 'yes') {
        filtersObject.filters.childIDs = JSON.stringify({ $exists: true, $ne: [] })
      } else if (txWasRerun === 'no') {
        filtersObject.filters.childIDs = JSON.stringify({ $eq: [] })
      }
    }

    const txPropertyKey = $scope.settings.filter.transaction.propertyKey
    const txPropertyValue = $scope.settings.filter.transaction.propertyValue
    if (valueNotEmpty(txPropertyKey) === true) {
      filtersObject.filters.properties = {}
      filtersObject.filters.properties[txPropertyKey] = null

      if (valueNotEmpty(txPropertyValue) === true) {
        filtersObject.filters.properties[txPropertyKey] = txPropertyValue
      }
    }

    const txHttpMethod = $scope.settings.filter.transaction.method
    if (valueNotEmpty(txHttpMethod) === true) {
      filtersObject.filters['request.method'] = txHttpMethod
    }

    /* ----- filter by transaction (advanced) ----- */

    /* ----- filter by route ----- */
    const routeStatusCode = $scope.settings.filter.route.statusCode
    if (valueNotEmpty(routeStatusCode) === true) {
      filtersObject.filters['routes.response.status'] = routeStatusCode
    }

    const routeHost = $scope.settings.filter.route.host
    if (valueNotEmpty(routeHost) === true) {
      filtersObject.filters['routes.request.host'] = routeHost
    }

    const routePort = $scope.settings.filter.route.port
    if (valueNotEmpty(routePort) === true) {
      filtersObject.filters['routes.request.port'] = routePort
    }

    const routePath = $scope.settings.filter.route.path
    if (valueNotEmpty(routePath) === true) {
      filtersObject.filters['routes.request.path'] = routePath
    }

    const routeParamKey = $scope.settings.filter.route.requestParamKey
    const routeParamValue = $scope.settings.filter.route.requestParamValue
    if (valueNotEmpty(routeParamKey) === true) {
      filtersObject.filters['routes.request.querystring'] = routeParamKey

      if (valueNotEmpty(routeParamValue) === true) {
        filtersObject.filters['routes.request.querystring'] += '=' + routeParamValue
      }
    }
    /* ----- filter by route ----- */

    /* ----- filter by orchestration ----- */
    const orchStatusCode = $scope.settings.filter.orchestration.statusCode
    if (valueNotEmpty(orchStatusCode) === true) {
      filtersObject.filters['orchestrations.response.status'] = orchStatusCode
    }

    const orchHost = $scope.settings.filter.orchestration.host
    if (valueNotEmpty(orchHost) === true) {
      filtersObject.filters['orchestrations.request.host'] = orchHost
    }

    const orchPort = $scope.settings.filter.orchestration.port
    if (valueNotEmpty(orchPort) === true) {
      filtersObject.filters['orchestrations.request.port'] = orchPort
    }

    const orchPath = $scope.settings.filter.orchestration.path
    if (valueNotEmpty(orchPath) === true) {
      filtersObject.filters['orchestrations.request.path'] = orchPath
    }

    const orchParamKey = $scope.settings.filter.orchestration.requestParamKey
    const orchParamValue = $scope.settings.filter.orchestration.requestParamValue
    if (valueNotEmpty(orchParamKey) === true) {
      filtersObject.filters['orchestrations.request.querystring'] = orchParamKey

      if (valueNotEmpty(orchParamValue) === true) {
        filtersObject.filters['orchestrations.request.querystring'] += '=' + orchParamValue
      }
    }
    /* ----- filter by orchestration ----- */

    /* ##### construct filters ##### */
    return filtersObject
  }

  const refreshSuccess = function (transactions) {
    // on success
    $scope.transactions = transactions

    // save latest returned transaction to session storage for use in transaction
    // details paging.
    const idList = transactions.map(function (tx) { return tx._id })
    sessionStorage.setItem('currTxList', angular.toJson(idList))
    sessionStorage.setItem('currFilterURL', `!${$location.url()}`)

    if (transactions.length < $scope.settings.filter.limit) {
      $scope.loadMoreBtn = false

      if (transactions.length === 0) {
        Alerting.AlertAddMsg('bottom', 'warning', 'There are no transactions for the current filters')
      }
    } else {
      // Show the load more button
      $scope.loadMoreBtn = true
    }

    // if bulkRerun param true
    if ($scope.bulkRerun) {
      // set checkAll to true - used to add transactions in toggleCheckedAll function
      $scope.checkbox.checkAll = true

      // do the checkAll function to add the transactions to the transactionsSelected object
      $scope.toggleCheckedAll()

      if (!$scope.settings.filter.startDate || !$scope.settings.filter.endDate) {
        $scope.NoDateRange = true
      }
    } else {
      // normal transaction success
      // make sure newly added transactions are checked as well
      $scope.resetCheckedItems()
    }
  }

  const refreshError = function (err) {
    // on error - Hide load more button and show error message
    $scope.loadMoreBtn = false
    Alerting.AlertAddServerMsg(err.status)
  }

  $scope.validateFormFilters = function () {
    // reset hasErrors alert object
    Alerting.AlertReset('hasErrors')

    // clear timeout if it has been set
    $timeout.cancel($scope.clearValidation)

    $scope.ngError = {}
    $scope.ngError.hasErrors = false

    // transaction status code validation
    if ($scope.settings.filter.transaction.statusCode && /^\d(\d\d|xx)$/.test($scope.settings.filter.transaction.statusCode) === false) {
      $scope.ngError.txStatusCode = true
      $scope.ngError.hasErrors = true
    }

    // route status code validation
    if ($scope.settings.filter.route.statusCode && /^\d(\d\d|xx)$/.test($scope.settings.filter.route.statusCode) === false) {
      $scope.ngError.routeStatusCode = true
      $scope.ngError.hasErrors = true
    }

    // orchestration status code validation
    if ($scope.settings.filter.orchestration.statusCode && /^\d(\d\d|xx)$/.test($scope.settings.filter.orchestration.statusCode) === false) {
      $scope.ngError.orchStatusCode = true
      $scope.ngError.hasErrors = true
    }

    if ($scope.ngError.hasErrors) {
      $scope.clearValidation = $timeout(function () {
        // clear errors after 5 seconds
        $scope.ngError = {}
      }, 5000)
      Alerting.AlertAddMsg('hasErrors', 'danger', $scope.validationFormErrorsMsg)
    }
  }

  const refreshDateFilters = function (date, callback) {
    if (moment(date, 'YYYY-MM-DD HH:mm:ss:SSSS', true).isValid()) {
      callback()
    } else if (!date) {
      $scope.applyFiltersToUrl()
    }
  }

  $scope.applyStartDate = function (date) {
    refreshDateFilters(date, function () {
      $scope.applyFiltersToUrl()
    })
  }

  $scope.applyEndDate = function (date) {
    refreshDateFilters(date, function () {
      if (moment(new Date(date)).hour() === 0 && moment(new Date(date)).minute() === 0) {
        $scope.settings.filter.endDate = moment(new Date(date)).endOf('day').format('YYYY-MM-DD HH:mm:ss:SSSS')
      }
      $scope.applyFiltersToUrl()
    })
  }

  $scope.applyFiltersToUrl = function () {
    // get the filter params object before clearing them
    const filterParamsBeforeClear = JSON.stringify(angular.copy($location.search()))

    // first clear existing filters
    $location.search({})

    // Add filters to url
    // set filter limit only if url parameter set
    if ($scope.settings.filter.limit) { $location.search('limit', $scope.settings.filter.limit) }
    if ($scope.settings.filter.startDate) { $location.search('startDate', $scope.settings.filter.startDate) }
    if ($scope.settings.filter.endDate) { $location.search('endDate', $scope.settings.filter.endDate) }

    // add transaction filters
    if ($scope.settings.filter.transaction.status) { $location.search('txStatus', $scope.settings.filter.transaction.status) }
    if ($scope.settings.filter.transaction.channel) { $location.search('txChannel', $scope.settings.filter.transaction.channel) }
    if ($scope.settings.filter.transaction.statusCode) { $location.search('txStatusCode', $scope.settings.filter.transaction.statusCode) }
    if ($scope.settings.filter.transaction.host) { $location.search('txHost', $scope.settings.filter.transaction.host) }
    if ($scope.settings.filter.transaction.port) { $location.search('txPort', $scope.settings.filter.transaction.port) }
    if ($scope.settings.filter.transaction.path) { $location.search('txPath', $scope.settings.filter.transaction.path) }
    if ($scope.settings.filter.transaction.requestParamKey) { $location.search('txParamKey', $scope.settings.filter.transaction.requestParamKey) }
    if ($scope.settings.filter.transaction.requestParamValue) { $location.search('txParamValue', $scope.settings.filter.transaction.requestParamValue) }
    if ($scope.settings.filter.transaction.client) { $location.search('txClient', $scope.settings.filter.transaction.client) }
    if ($scope.settings.filter.transaction.wasRerun) { $location.search('txWasRerun', $scope.settings.filter.transaction.wasRerun) }
    if ($scope.settings.filter.transaction.propertyKey) { $location.search('txPropertyKey', $scope.settings.filter.transaction.propertyKey) }
    if ($scope.settings.filter.transaction.propertyValue) { $location.search('txPropertyValue', $scope.settings.filter.transaction.propertyValue) }
    if ($scope.settings.filter.transaction.method) { $location.search('txHttpMethod', $scope.settings.filter.transaction.method) }

    // add route filters
    if ($scope.settings.filter.route.statusCode) { $location.search('routeStatusCode', $scope.settings.filter.route.statusCode) }
    if ($scope.settings.filter.route.host) { $location.search('routeHost', $scope.settings.filter.route.host) }
    if ($scope.settings.filter.route.port) { $location.search('routePort', $scope.settings.filter.route.port) }
    if ($scope.settings.filter.route.path) { $location.search('routePath', $scope.settings.filter.route.path) }
    if ($scope.settings.filter.route.requestParamKey) { $location.search('routeParamKey', $scope.settings.filter.route.requestParamKey) }
    if ($scope.settings.filter.route.requestParamValue) { $location.search('routeParamValue', $scope.settings.filter.route.requestParamValue) }

    // add orchestration filters
    if ($scope.settings.filter.orchestration.statusCode) { $location.search('orchStatusCode', $scope.settings.filter.orchestration.statusCode) }
    if ($scope.settings.filter.orchestration.host) { $location.search('orchHost', $scope.settings.filter.orchestration.host) }
    if ($scope.settings.filter.orchestration.port) { $location.search('orchPort', $scope.settings.filter.orchestration.port) }
    if ($scope.settings.filter.orchestration.path) { $location.search('orchPath', $scope.settings.filter.orchestration.path) }
    if ($scope.settings.filter.orchestration.requestParamKey) { $location.search('orchParamKey', $scope.settings.filter.orchestration.requestParamKey) }
    if ($scope.settings.filter.orchestration.requestParamValue) { $location.search('orchParamValue', $scope.settings.filter.orchestration.requestParamValue) }

    // get the filter params object after clearing them
    const filterParamsAfterClear = JSON.stringify(angular.copy($location.search()))

    // if the filters object stays the same then call refresh function
    // if filters object not the same then angular changes route and loads controller ( refresh )
    if (filterParamsBeforeClear === filterParamsAfterClear) {
      $scope.refreshTransactionsList()
    }
  }

  const updateConsoleSession = function () {
    let consoleSession = localStorage.getItem('consoleSession')
    consoleSession = JSON.parse(consoleSession)

    // update consoleSession with new user filter settings
    consoleSession.sessionUserSettings = $scope.settings
    localStorage.setItem('consoleSession', JSON.stringify(consoleSession))
  }

  // Refresh transactions list
  $scope.refreshTransactionsList = function () {
    Alerting.AlertReset()

    // validate the form first to check for any errors
    $scope.validateFormFilters()

    lastUpdated = moment() - serverDiffTime

    // execute refresh if no errors
    if ($scope.ngError.hasErrors === false) {
      // Set dateApplied flag if date is present when transaction list is refreshed
      if ($scope.settings.filter.startDate || $scope.settings.filter.endDate) {
        $scope.dateApplied = true
      } else {
        $scope.dateApplied = false
      }

      $scope.transactions = null

      // reset the showpage filter to start at 0
      $scope.showpage = 0
      // if bulkRerun param true
      if ($scope.bulkRerun) {
        // do API call only for 'bulkrerun' properties
        const returnFilters = $scope.returnFilters()
        // add filterRepresentation to only return bulkrerun properties
        returnFilters.filterRepresentation = 'bulkrerun'

        // set filter limit to default defaultBulkRerunLimit
        returnFilters.filterLimit = $scope.defaultBulkRerunLimit

        // remove filterPage because no pagination needed
        delete returnFilters.filterPage

        // set bulkrerunActive true to show rerun information
        $scope.bulkRerunActive = true

        Api.Transactions.query(returnFilters, refreshSuccess, refreshError)
      } else {
        //  do normal transaction API call for transactions
        Api.Transactions.query($scope.returnFilters(), refreshSuccess, refreshError)
      }
      updateConsoleSession()
    } else {
      Alerting.AlertAddMsg('server', 'danger', 'You appear to have errors in your filter query. Please correct and try again')
    }
  }
  // run the transaction list view for the first time
  $scope.refreshTransactionsList()

  const loadMoreSuccess = function (transactions) {
    // on success
    $scope.transactions = $scope.transactions.concat(transactions)

    if (transactions.length < $scope.settings.filter.limit) {
      $scope.loadMoreBtn = false
      Alerting.AlertAddMsg('bottom', 'warning', 'There are no more transactions to retrieve')
    }

    // make sure newly added transactions are checked as well
    $scope.toggleCheckedAll()
    $scope.busyLoadingMore = false
  }

  const loadMoreError = function (err) {
    // on error - Hide load more button and show error message
    $scope.loadMoreBtn = false
    Alerting.AlertAddServerMsg(err.status)
  }

  // Refresh transactions list
  $scope.loadMoreTransactions = function () {
    $scope.busyLoadingMore = true
    Alerting.AlertReset()

    $scope.showpage++

    const filters = $scope.returnFilters()

    if (!filters.filters['request.timestamp']) {
      // use page load time as an explicit end date
      // this prevents issues with paging when new transactions come in, breaking the pages
      filters.filters['request.timestamp'] = JSON.stringify({ $lte: moment(pageLoadDate - serverDiffTime).format() })
    }

    Api.Transactions.query(filters, loadMoreSuccess, loadMoreError)
  }

  // location provider - load transaction details
  $scope.viewTransactionDetails = function (path, $event) {
    // do transactions details redirection when clicked on TD
    if ($event.target.tagName === 'TD') {
      const absUrl = $location.absUrl()
      const absUrlPath = $location.url()
      const baseUrl = absUrl.replace(absUrlPath, '')
      const txUrl = baseUrl + '/' + path
      if ($scope.settings.list.tabview && $scope.settings.list.tabview === 'new') {
        window.open(txUrl, '_blank')
      } else {
        $location.path(path)
        $location.search({})
      }
    }
  }

  $scope.filtersApplied = function () {
    // We can't just check the scope date variables, as these are set before the filters are applied
    // This is why we have a date applied variable, which checks if date filter is applied to transaction list
    if ($scope.dateApplied) { return true }
    if ($scope.settings.filter.limit !== defaultLimit) { return true }
    if ($scope.settings.filter.transaction.wasRerun !== defaultWasRerun) { return true }
    if (Object.keys($scope.settings.filter.transaction).length > 1) { return true }
    if (!isEmpty($scope.settings.filter.orchestration)) { return true }
    if (!isEmpty($scope.settings.filter.route)) { return true }
    return false
  }

  // Clear filter data end refresh transactions scope
  $scope.clearFilters = function () {
    Alerting.AlertReset()
    $scope.bulkRerunActive = false
    $scope.bulkRerun = false

    // reset default filters
    $scope.settings.filter.limit = defaultLimit
    $scope.settings.filter.startDate = ''
    $scope.settings.filter.endDate = ''
    $scope.settings.filter.transaction = {}
    $scope.settings.filter.orchestration = {}
    $scope.settings.filter.route = {}
    $scope.settings.filter.transaction.wasRerun = defaultWasRerun

    $scope.settings.list.tabview = defaultTabView
    $scope.settings.list.autoupdate = defaultAutoUpdate

    // clear all filter parameters
    $location.search({})
    $scope.advancedFilters.isCollapsed = true
    $scope.refreshTransactionsList()
  }

  // Apply the current user's default filters
  $scope.applyDefaultFilters = function () {
    Alerting.AlertReset()
    $scope.bulkRerunActive = false
    $scope.bulkRerun = false

    const success = function (user) {
      attachUserFiltersToScope(user.settings.filter)
      $scope.refreshTransactionsList()
    }

    const error = function (err) {
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while fetching the users\' filters: #' + err.status + ' - ' + err.data)
    }

    Api.Users.get({ email: sessionUserEmail }, success, error)
  }

  // Persist Current Filters to Session and Database
  $scope.persistUserFiltersToDatabase = function () {
    Alerting.AlertReset()

    const success = function () {
      Alerting.AlertAddMsg('top', 'success', 'User filters have been saved successfully')
    }

    const error = function (err) {
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving the users\' filters: #' + err.status + ' - ' + err.data)
    }

    const updateUser = function (user) {
      const userObject = angular.copy(user)
      user.$update(function () {
        success(userObject)
      }, error)
    }

    const currentUser = Api.Users.get({ email: sessionUserEmail }, function () {
      // check settings properties exist
      if (!currentUser.settings) { currentUser.settings = {} }
      if (!currentUser.settings.filter) { currentUser.settings.filter = {} }

      // add user filters to the user object
      currentUser.settings.filter = $scope.settings.filter

      // update user via api
      updateUser(currentUser)
    })
  }

  /*******************************************************************/
  /**         Transactions List and Detail view functions           **/
  /*******************************************************************/

  /****************************************************/
  /**         Transactions ReRun Functions           **/
  /****************************************************/
  $scope.bulkRerunInitiate = function () {
    $scope.bulkRerun = true
    $scope.refreshTransactionsList()
  }

  $scope.bulkRerunCancel = function () {
    $scope.bulkRerun = false
    $scope.bulkRerunActive = false
    $scope.refreshTransactionsList()
  }

  $scope.bulkRerunContinue = function () {
    $scope.bulkRerun = false
    // set checkAll to true - used to add transactions in toggleCheckedAll function
    $scope.checkbox.checkAll = true

    // do the checkAll function to add the transactions to the transactionsSelected object
    $scope.toggleCheckedAll()

    // display confirmation popup modal to complete the rerun procedure
    $scope.confirmRerunTransactions()
  }

  $scope.confirmRerunTransactions = function () {
    Alerting.AlertReset()

    const transactionsSelected = $scope.transactionsSelected
    const rerunTransactionsSelected = $scope.rerunTransactionsSelected
    $uibModal.open({
      template: transactionsRerunModal,
      controller: TransactionsRerunModalCtrl,
      scope: $scope,
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

  $scope.toggleCheckedAll = function () {
    // if checked for all
    if ($scope.checkbox.checkAll === true) {
      $scope.transactionsSelected = []
      $scope.rerunTransactionsSelected = 0

      angular.forEach($scope.transactions, function (transaction) {
        // first check if transaction can be rerun
        if (transaction.canRerun) {
          // only add transaction if channel Rerun is allowed
          if ($scope.channelsMap[transaction.channelID].rerun) {
            $scope.transactionsSelected.push(transaction._id)

            // check if transaction is a rerun
            if (transaction.childIDs) {
              if (transaction.childIDs.length > 0) {
                $scope.rerunTransactionsSelected++
              }
            }
          }
        }
      })
    } else {
      $scope.transactionsSelected = []
      $scope.rerunTransactionsSelected = 0
    }
  }

  const getObjectById = function (id, myArray) {
    const object = myArray.filter(function (obj) {
      if (obj._id === id) {
        return obj
      }
    })[0]
    return object
  }

  $scope.toggleTransactionSelection = function (transactionID) {
    const idx = $scope.transactionsSelected.indexOf(transactionID)
    const transaction = getObjectById(transactionID, $scope.transactions)

    // is currently selected
    if (idx > -1) {
      $scope.transactionsSelected.splice(idx, 1)

      // check if transaction has reruns
      if (transaction.childIDs) {
        if (transaction.childIDs.length > 0) {
          $scope.rerunTransactionsSelected--
        }
      }
    } else {
      // is newly selected
      $scope.transactionsSelected.push(transactionID)

      // check if transaction has reruns
      if (transaction.childIDs) {
        if (transaction.childIDs.length > 0) {
          $scope.rerunTransactionsSelected++
        }
      }
    }
  }

  $scope.resetCheckedItems = function () {
    $scope.transactionsSelected = []
    $scope.rerunTransactionsSelected = 0
    $scope.checkbox.checkAll = false
  }

  $scope.$on('transactionRerunSuccess', function () {
    $scope.bulkRerunActive = false
    $scope.bulkRerun = false
    $scope.refreshTransactionsList()
  })

  /****************************************************/
  /**         Transactions ReRun Functions           **/
  /****************************************************/

  /****************************************************/
  /**         Poll for latest transactions           **/
  /****************************************************/

  let pollingInterval
  let lastPollingCompleted = true

  $scope.pollForLatest = function () {
    if (!$scope.transactions) { return }
    const filters = $scope.returnFilters()

    if (!filters.filters['request.timestamp']) {
      // only poll for latest if date filters are OFF

      filters.filters['request.timestamp'] = JSON.stringify({ $gte: moment(lastUpdated).format() })
      lastUpdated = moment() - serverDiffTime

      delete filters.filterPage
      delete filters.filterLimit

      lastPollingCompleted = false

      Api.Transactions.query(filters, function (transactions) {
        lastPollingCompleted = true
        transactions.reverse().forEach(function (trx) {
          $scope.transactions.unshift(trx)
          if ($scope.transactions.length > $scope.settings.filter.limit) {
            $scope.transactions.pop()
          }
          $scope.baseIndex--
        })
      })
    }
  }

  // poll for updates for any transactions that are marked as 'Processing'
  // TODO need an endpoint in core to lookup a several transactions by _id at once
  $scope.pollForProcessingUpdates = function () {
    if (!$scope.transactions) { return }
    $scope.transactions.forEach(function (trx) {
      if (trx.status === 'Processing') {
        Api.Transactions.get({
          transactionId: trx._id,
          filterRepresentation: 'simple'
        }, function (result) {
          $scope.transactions.forEach(function (scopeTrx) {
            if (scopeTrx._id === result._id) {
              scopeTrx.status = result.status
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
