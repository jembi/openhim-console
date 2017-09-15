
import $ from 'jquery'
import moment from 'moment'
import { valueNotEmpty } from '../utils'

export function AuditsCtrl ($scope, $uibModal, $location, $interval, Api, Alerting, AuditLookups) {
  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/
  $scope.isCollapsed = true

  // remember when we loaded the page...
  let pageLoadDate = moment()

  // polling
  let lastUpdated
  let serverDiffTime = 0
  $scope.baseIndex = 0
  let pollPeriod = 5000

  Api.AuditsFilterOptions.get(function (auditsFilterOptions) {
    $scope.auditsFilterOptions = auditsFilterOptions
  }, function (err) {
    console.log('Audits error: ' + err)
  })

  /* setup default filter options */
  let setupAuditFilters = function () {
    // return results for the first page (10 results)
    $scope.showpage = 0
    $scope.showlimit = 10

    // setup audit lookup objects
    $scope.eventActionMap = AuditLookups.eventActionMap()
    $scope.eventOutcomeMap = AuditLookups.eventOutcomeMap()

    // setup default audits settings
    $scope.settings = {}
    $scope.settings.filter = {}
    if ($location.search().limit) { $scope.settings.filter.limit = $location.search().limit } else { $scope.settings.filter.limit = 10 }
    if ($location.search().dateStart) { $scope.settings.filter.dateStart = $location.search().dateStart } else { $scope.settings.filter.dateStart = '' }
    if ($location.search().dateEnd) { $scope.settings.filter.dateEnd = $location.search().dateEnd } else { $scope.settings.filter.dateEnd = '' }
    $scope.settings.list = {}
    $scope.settings.list.tabview = 'same'
    $scope.settings.list.autoupdate = true

    $scope.filters = {}
    $scope.filters.eventIdentification = {}
    if ($location.search().eventID) { $scope.filters.eventIdentification.eventID = $location.search().eventID }
    if ($location.search().eventTypeCode) { $scope.filters.eventIdentification.eventTypeCode = $location.search().eventTypeCode }
    if ($location.search().eventActionCode) { $scope.filters.eventIdentification.eventActionCode = $location.search().eventActionCode }
    if ($location.search().eventOutcomeIndicator) { $scope.filters.eventIdentification.eventOutcomeIndicator = $location.search().eventOutcomeIndicator }

    $scope.filters.participantObjectIdentification = {}
    $scope.filters.participantObjectIdentification.patientID = {}
    if ($location.search().patientID) { $scope.filters.participantObjectIdentification.patientID.patientID = $location.search().patientID }
    if ($location.search().assigningAuth) { $scope.filters.participantObjectIdentification.patientID.assigningAuth = $location.search().assigningAuth }
    if ($location.search().assigningAuthID) { $scope.filters.participantObjectIdentification.patientID.assigningAuthID = $location.search().assigningAuthID }

    if ($location.search().participantObjectID) { $scope.filters.participantObjectIdentification.participantObjectID = $location.search().participantObjectID }
    if ($location.search().participantObjectIDTypeCode) { $scope.filters.participantObjectIdentification.participantObjectIDTypeCode = $location.search().participantObjectIDTypeCode }
    $scope.filters.participantObjectIdentification.participantObjectDetail = {}
    if ($location.search().participantObjectDetailType) { $scope.filters.participantObjectIdentification.participantObjectDetail.type = $location.search().participantObjectDetailType }
    if ($location.search().participantObjectDetailValue) { $scope.filters.participantObjectIdentification.participantObjectDetail.value = $location.search().participantObjectDetailValue }

    $scope.filters.activeParticipant = {}
    if ($location.search().userID) { $scope.filters.activeParticipant.userID = $location.search().userID }
    if ($location.search().roleIDCode) { $scope.filters.activeParticipant.roleIDCode = $location.search().roleIDCode }
    if ($location.search().alternativeUserID) { $scope.filters.activeParticipant.alternativeUserID = $location.search().alternativeUserID }
    if ($location.search().networkAccessPointID) { $scope.filters.activeParticipant.networkAccessPointID = $location.search().networkAccessPointID }

    $scope.filters.auditSourceIdentification = {}
    if ($location.search().auditSourceID) { $scope.filters.auditSourceIdentification.auditSourceID = $location.search().auditSourceID }
  }
  setupAuditFilters()

  let consoleSession = localStorage.getItem('consoleSession')
  consoleSession = JSON.parse(consoleSession)
  $scope.consoleSession = consoleSession
  let userSettings = consoleSession.sessionUserSettings

  if (userSettings) {
    if (userSettings.filter) {
      if (userSettings.filter.limit && userSettings.filter.limit !== 0 && userSettings.filter.limit === '') {
        $scope.settings.filter.limit = userSettings.filter.limit
      }
    }

    if (userSettings.list) {
      $scope.settings.list.tabview = userSettings.list.tabview
    }
  }

  /***************************************************/
  /**         Initial page load functions           **/
  /***************************************************/

  /*************************************************************/
  /**         Audits List and Detail view functions           **/
  /*************************************************************/

  // setup filter options
  $scope.returnFilters = function (type) {
    let filtersObject = {}
    let filterUrlParams = ''
    let filterDateStart, filterDateEnd

    filtersObject.filterPage = $scope.showpage
    filtersObject.filterLimit = $scope.showlimit
    filterUrlParams += '&limit=' + $scope.settings.filter.limit

    /* ##### construct filters ##### */
    filtersObject.filters = {}

    // date filter
    filterDateStart = $scope.settings.filter.dateStart
    filterDateEnd = $scope.settings.filter.dateEnd
    if (filterDateStart && filterDateEnd) {
      let startDate = moment(filterDateStart).format()
      let endDate = moment(filterDateEnd).endOf('day').format()
      filtersObject.filters['eventIdentification.eventDateTime'] = JSON.stringify({ '$gte': startDate, '$lte': endDate })
    }
    if (filterDateStart) { filterUrlParams += '&dateStart=' + moment(filterDateStart).format('YYYY-MM-DD') }
    if (filterDateEnd) { filterUrlParams += '&dateEnd=' + moment(filterDateEnd).format('YYYY-MM-DD') }

    /* ----- filter by Patient ----- */
    let patientID = $scope.filters.participantObjectIdentification.patientID.patientID
    let assigningAuth = $scope.filters.participantObjectIdentification.patientID.assigningAuth
    let assigningAuthID = $scope.filters.participantObjectIdentification.patientID.assigningAuthID

    // if not defined then set wildcard
    if (assigningAuth === null || assigningAuth === undefined || assigningAuth === '') {
      assigningAuth = '.*'
    }
    // if not defined then set wildcard
    if (assigningAuthID === null || assigningAuthID === undefined || assigningAuthID === '') {
      assigningAuthID = '.*'
    }

    // add patientID filter
    let participantPatientID = patientID + '\\^\\^\\^' + assigningAuth + '&' + assigningAuthID + '&.*'
    if (valueNotEmpty(patientID) === true) {
      filtersObject.filters['participantObjectIdentification.participantObjectID'] = JSON.stringify(participantPatientID)
      filterUrlParams += '&patientID=' + patientID
    }
    /* ----- filter by Patient ----- */

    /* ----- filter by Event ----- */
    // add eventID filter
    let eventTypeCode = $scope.filters.eventIdentification.eventTypeCode
    if (valueNotEmpty(eventTypeCode) === true) {
      // construct object to query in mongo
      let eventTypeArray = eventTypeCode.split('---')
      filtersObject.filters['eventIdentification.eventTypeCode.code'] = eventTypeArray[0]
      filtersObject.filters['eventIdentification.eventTypeCode.codeSystemName'] = eventTypeArray[1]
      filtersObject.filters['eventIdentification.eventTypeCode.displayName'] = eventTypeArray[2]
      filterUrlParams += '&eventTypeCode=' + eventTypeCode
    }

    // add eventID filter
    let eventID = $scope.filters.eventIdentification.eventID
    if (valueNotEmpty(eventID) === true) {
      let eventIDArray = eventID.split('---')
      filtersObject.filters['eventIdentification.eventID.code'] = eventIDArray[0]
      filtersObject.filters['eventIdentification.eventID.codeSystemName'] = eventIDArray[1]
      filtersObject.filters['eventIdentification.eventID.displayName'] = eventIDArray[2]
      filterUrlParams += '&eventID=' + eventID
    }

    // add eventActionCode filter
    let eventActionCode = $scope.filters.eventIdentification.eventActionCode
    if (valueNotEmpty(eventActionCode) === true) {
      filtersObject.filters['eventIdentification.eventActionCode'] = eventActionCode
      filterUrlParams += '&eventActionCode=' + eventActionCode
    }

    // add eventOutcomeIndicator filter
    let eventOutcomeIndicator = $scope.filters.eventIdentification.eventOutcomeIndicator
    if (valueNotEmpty(eventOutcomeIndicator) === true) {
      filtersObject.filters['eventIdentification.eventOutcomeIndicator'] = eventOutcomeIndicator
      filterUrlParams += '&eventOutcomeIndicator=' + eventOutcomeIndicator
    }
    /* ----- filter by Event ----- */

    /* ----- filter by Active Participant ----- */
    // add userID filter
    let userID = $scope.filters.activeParticipant.userID
    if (valueNotEmpty(userID) === true) {
      filtersObject.filters['activeParticipant.userID'] = userID
      filterUrlParams += '&userID=' + userID
    }

    // add alternativeUserID filter
    let alternativeUserID = $scope.filters.activeParticipant.alternativeUserID
    if (valueNotEmpty(alternativeUserID) === true) {
      filtersObject.filters['activeParticipant.alternativeUserID'] = alternativeUserID
      filterUrlParams += '&alternativeUserID=' + alternativeUserID
    }

    // add networkAccessPointID filter
    let networkAccessPointID = $scope.filters.activeParticipant.networkAccessPointID
    if (valueNotEmpty(networkAccessPointID) === true) {
      filtersObject.filters['activeParticipant.networkAccessPointID'] = networkAccessPointID
      filterUrlParams += '&networkAccessPointID=' + networkAccessPointID
    }

    // add eventID filter
    let roleIDCode = $scope.filters.activeParticipant.roleIDCode
    if (valueNotEmpty(roleIDCode) === true) {
      let roleIDCodeArray = roleIDCode.split('---')
      filtersObject.filters['activeParticipant.roleIDCode.code'] = roleIDCodeArray[0]
      filtersObject.filters['activeParticipant.roleIDCode.codeSystemName'] = roleIDCodeArray[1]
      filtersObject.filters['activeParticipant.roleIDCode.displayName'] = roleIDCodeArray[2]
      filterUrlParams += '&roleIDCode=' + roleIDCode
    }
    /* ----- filter by Active Participant ----- */

    /* ----- filter by Participant Object ----- */
    // add objectID filter
    let objectID = $scope.filters.participantObjectIdentification.participantObjectID
    if (valueNotEmpty(objectID) === true) {
      filterUrlParams += '&participantObjectID=' + objectID

      // if patientID set then update query to include 'AND' operator
      if (valueNotEmpty(patientID) === true) {
        filtersObject.filters['participantObjectIdentification.participantObjectID'] = { type: 'AND', patientID: participantPatientID, objectID: objectID }
      } else {
        filtersObject.filters['participantObjectIdentification.participantObjectID'] = JSON.stringify(objectID)
      }
    }

    // add objectIDTypeCode filter
    let participantObjectIDTypeCode = $scope.filters.participantObjectIdentification.participantObjectIDTypeCode
    if (valueNotEmpty(participantObjectIDTypeCode) === true) {
      let participantObjectIDTypeCodeArray = participantObjectIDTypeCode.split('---')
      filtersObject.filters['participantObjectIdentification.participantObjectIDTypeCode.code'] = participantObjectIDTypeCodeArray[0]
      filtersObject.filters['participantObjectIdentification.participantObjectIDTypeCode.codeSystemName'] = participantObjectIDTypeCodeArray[1]
      filtersObject.filters['participantObjectIdentification.participantObjectIDTypeCode.displayName'] = participantObjectIDTypeCodeArray[2]
      filterUrlParams += '&participantObjectIDTypeCode=' + participantObjectIDTypeCode
    }

    // add objectDetailType filter
    let objectDetailType = $scope.filters.participantObjectIdentification.participantObjectDetail.type
    if (valueNotEmpty(objectDetailType) === true) {
      filtersObject.filters['participantObjectIdentification.participantObjectDetail.type'] = objectDetailType
      filterUrlParams += '&participantObjectDetailType=' + objectDetailType
    }

    // add objectDetailValue filter
    let objectDetailValue = $scope.filters.participantObjectIdentification.participantObjectDetail.value
    if (valueNotEmpty(objectDetailValue) === true) {
      filtersObject.filters['participantObjectIdentification.participantObjectDetail.value'] = objectDetailValue
      filterUrlParams += '&participantObjectDetailValue=' + objectDetailValue
    }
    /* ----- filter by Participant Object ----- */

    /* ----- filter by Audit Source ----- */
    // add auditSource filter
    let auditSourceID = $scope.filters.auditSourceIdentification.auditSourceID
    if (valueNotEmpty(auditSourceID) === true) {
      filtersObject.filters['auditSourceIdentification.auditSourceID'] = auditSourceID
      filterUrlParams += '&auditSourceID=' + auditSourceID
    }
    /* ----- filter by Audit Source ----- */

    /* ##### construct filters ##### */

    if (type === 'urlParams') {
      return filterUrlParams
    } else if (type === 'filtersObject') {
      return filtersObject
    }
  }

  let refreshSuccess = function (audits) {
    // on success
    $scope.audits = audits

    if (audits.length < $scope.showlimit) {
      $('#loadMoreBtn').hide()
      if (audits.length === 0) {
        Alerting.AlertAddMsg('bottom', 'warning', 'There are no audits for the current filters')
      }
    } else {
      // Show the load more button
      $('#loadMoreBtn').show()
    };

    let refreshError = function (err) {
      // on error - Hide load more button and show error message
      $('#loadMoreBtn').hide()
      Alerting.AlertAddServerMsg(err.status)
    }

    $scope.applyFilterIfValidDate = function (date) {
      if (moment(date, 'YYYY-MM-DD', true).isValid()) {
        $scope.applyFiltersToUrl()
      }
    }

    $scope.applyFiltersToUrl = function () {
      let curHashParams = window.location.hash
      let filters = $scope.returnFilters('urlParams')
      let newHash = '/audits?' + filters.substring(1)

      // just refresh audits list - no new params
      if (curHashParams === newHash) {
        $scope.refreshAuditsList()
      } else {
        let absUrl = $location.absUrl()
        let absUrlPath = $location.url()
        let baseUrl = absUrl.replace(absUrlPath, '')
        window.location = baseUrl + newHash
      }
    }

    // Refresh audits list
    $scope.refreshAuditsList = function () {
      $scope.audits = null
      Alerting.AlertReset()

      // reset the showpage filter to start at 0
      $scope.showpage = 0
      $scope.showlimit = $scope.settings.filter.limit

      Api.Audits.query($scope.returnFilters('filtersObject'), refreshSuccess, refreshError)
    }
    // run the audit list view for the first time
    $scope.refreshAuditsList()

    let loadMoreSuccess = function (audits) {
      // on success
      $scope.audits = $scope.audits.concat(audits)
      // remove any duplicates objects found in the audits scope
      $scope.audits = $.unique($scope.audits)
      if (audits.length < $scope.showlimit) {
        $('#loadMoreBtn').hide()
        Alerting.AlertAddMsg('bottom', 'warning', 'There are no more audits to retrieve')
      }

      $scope.busyLoadingMore = false
    }

    let loadMoreError = function (err) {
      // on error - Hide load more button and show error message
      $('#loadMoreBtn').hide()
      Alerting.AlertAddServerMsg(err.status)
    }

    // Refresh audits list
    $scope.loadMoreAudits = function () {
      $scope.busyLoadingMore = true
      Alerting.AlertReset()

      $scope.showpage++

      let filters = $scope.returnFilters('filtersObject')

      if (!filters.filters['eventIdentification.eventDateTime']) {
        // use page load time as an explicit end date
        // this prevents issues with paging when new transactions come in, breaking the pages
        filters.filters['eventIdentification.eventDateTime'] = JSON.stringify({ '$lte': moment(pageLoadDate - serverDiffTime).format() })
      }

      Api.Audits.query(filters, loadMoreSuccess, loadMoreError)
    }

    // location provider - load audit details
    $scope.viewAuditDetails = function (path, $event) {
      // do audits details redirection when clicked on TD
      if ($event.target.tagName === 'TD') {
        let absUrl = $location.absUrl()
        let absUrlPath = $location.url()
        let baseUrl = absUrl.replace(absUrlPath, '')
        let txUrl = baseUrl + '/' + path
        if ($scope.settings.list.tabview && $scope.settings.list.tabview === 'new') {
          window.open(txUrl, '_blank')
        } else {
          $location.path(path)
        }
      }
    }

    // Clear filter data end refresh audits scope
    $scope.clearFilters = function () {
      $scope.settings.filter.limit = 10
      $scope.settings.filter.dateStart = ''
      $scope.settings.filter.dateEnd = ''
      $scope.settings.list.tabview = 'same'

      // get the filter params object before clearing them
      let filterParamsBeforeClear = angular.copy($location.search())

      // clear all filter parameters
      $location.search({})

      // get the filter params object after clearing them
      let filterParamsAfterClear = angular.copy($location.search())

      // if the filters object stays the same then call refresh function
      // if filters object not the same then angular changes route and loads controller ( refresh )
      if (angular.equals(filterParamsBeforeClear, filterParamsAfterClear)) {
        $scope.refreshAuditsList()
      }
    }

    /*************************************************************/
    /**         Audits List and Detail view functions           **/
    /*************************************************************/

    /****************************************************/
    /**         Poll for latest audits                 **/
    /****************************************************/

    let pollingInterval
    let lastPollingCompleted = true

    $scope.pollForLatest = function () {
      let filters = $scope.returnFilters('filtersObject')

      if (!filters.filters['eventIdentification.eventDateTime']) {
        // only poll for latest if date filters are OFF
        filters.filters['eventIdentification.eventDateTime'] = JSON.stringify({ '$gte': moment(lastUpdated).format(), '$lte': moment().format() })
        lastUpdated = moment() - serverDiffTime

        delete filters.filterPage
        delete filters.filterLimit
        lastPollingCompleted = false

        Api.Audits.query(filters, function (audits) {
          lastPollingCompleted = true
          audits.forEach(function (audit) {
            $scope.audits.unshift(audit)
            $scope.baseIndex--
          })
        })
      }
    }

    $scope.startPolling = function () {
      if (!pollingInterval) {
        pollingInterval = $interval(function () {
          if (lastPollingCompleted) {
            $scope.pollForLatest()
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
}
