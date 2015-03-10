'use strict';
/* global jQuery:false */
/* global moment:false */

angular.module('openhimConsoleApp')
  .controller('AuditsCtrl', function ($scope, $modal, $location, Api, Alerting, AuditLookups) {


    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/
    $scope.isCollapsed = true;

    Api.AuditsFilterOptions.get(function(auditsFilterOptions){
      $scope.auditsFilterOptions = auditsFilterOptions;
    }, function(err){
      console.log( err );
    });


    /* setup default filter options */
    var setupAuditFilters = function(){
      $scope.filters = {};
      $scope.filters.eventIdentification = {};

      $scope.filters.participantObjectIdentification = {};
      $scope.filters.participantObjectIdentification.patientID = {};
      $scope.filters.participantObjectIdentification.participantObjectDetail = {};

      $scope.filters.activeParticipant = {};

      $scope.filters.auditSourceIdentification = {};
    };
    setupAuditFilters();


    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);
    $scope.consoleSession = consoleSession;
    var userSettings = consoleSession.sessionUserSettings;


    //return results for the first page (10 results)
    $scope.showpage = 0;
    $scope.showlimit = 10;

    // setup audit lookup objects
    $scope.eventActionMap = AuditLookups.eventActionMap();
    $scope.eventOutcomeMap = AuditLookups.eventOutcomeMap();

    // setup default audits settings
    $scope.settings = {};
    $scope.settings.filter = {};
    $scope.settings.filter.limit = 10;
    $scope.settings.filter.dateStart = '';
    $scope.settings.filter.dateEnd = '';
    $scope.settings.list = {};
    $scope.settings.list.tabview = 'same';

    if ( userSettings ){
      if ( userSettings.filter ){
        
        if ( userSettings.filter.limit && userSettings.filter.limit !== 0 && userSettings.filter.limit === ''){
          $scope.settings.filter.limit = userSettings.filter.limit;
        }

        $scope.settings.filter.dateStart = '';
        $scope.settings.filter.dateEnd = '';
      }
      
      if ( userSettings.list ){
        $scope.settings.list.tabview = userSettings.list.tabview;
      }
    }

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/



    /*************************************************************/
    /**         Audits List and Detail view functions           **/
    /*************************************************************/

    //setup filter options
    $scope.returnFilterObject = function(){
      var filtersObject = {};
      var filterDateStart, filterDateEnd;

      filtersObject.filterPage = $scope.showpage;
      filtersObject.filterLimit = $scope.showlimit;


      /* ##### construct filters ##### */
      filtersObject.filters = {};

      // date filter
      filterDateStart = $scope.settings.filter.dateStart;
      filterDateEnd = $scope.settings.filter.dateEnd;
      if(filterDateStart && filterDateEnd){
        var startDate = moment(filterDateStart).format();
        var endDate = moment(filterDateEnd).endOf('day').format();
        filtersObject.filters['eventIdentification.eventDateTime'] = JSON.stringify( { '$gte': startDate, '$lte': endDate } );
      }


      /* ----- filter by Patient ----- */
      var patientID = $scope.filters.participantObjectIdentification.patientID.patientID;
      var assigningAuth = $scope.filters.participantObjectIdentification.patientID.assigningAuth;
      var assigningAuthID = $scope.filters.participantObjectIdentification.patientID.assigningAuthID;

      // if not defined then set wildcard
      if ( assigningAuth === null || assigningAuth === undefined || assigningAuth === '' ){
        assigningAuth = '.*';
      }
      // if not defined then set wildcard
      if ( assigningAuthID === null || assigningAuthID === undefined || assigningAuthID === '' ){
        assigningAuthID = '.*';
      }
      
      // add patientID filter
      var participantPatientID = patientID+'\\^\\^\\^'+assigningAuth+'&'+assigningAuthID+'&.*';
      if ( patientID !== null && patientID !== undefined && patientID !== '' ) { filtersObject.filters['participantObjectIdentification.participantObjectID'] = JSON.stringify( participantPatientID); }
      /* ----- filter by Patient ----- */


      /* ----- filter by Event ----- */
      // eventActionCode filter

      // add eventID filter
      var eventTypeCode = $scope.filters.eventIdentification.eventTypeCode;
      if ( eventTypeCode !== null && eventTypeCode !== undefined ) { filtersObject.filters['eventIdentification.eventTypeCode'] = eventTypeCode; }

      // add eventID filter
      var eventID = $scope.filters.eventIdentification.eventID;
      if ( eventID !== null && eventID !== undefined ) { filtersObject.filters['eventIdentification.eventID'] = eventID; }

      // add eventActionCode filter
      var eventActionCode = $scope.filters.eventIdentification.eventActionCode;
      if ( eventActionCode !== null && eventActionCode !== undefined ) { filtersObject.filters['eventIdentification.eventActionCode'] = eventActionCode; }

      // add eventOutcomeIndicator filter
      var eventOutcomeIndicator = $scope.filters.eventIdentification.eventOutcomeIndicator;
      if ( eventOutcomeIndicator !== null && eventOutcomeIndicator !== undefined ) { filtersObject.filters['eventIdentification.eventOutcomeIndicator'] = eventOutcomeIndicator; }
      /* ----- filter by Event ----- */


      /* ----- filter by Active Participant ----- */
      // add userID filter
      var userID = $scope.filters.activeParticipant.userID;
      if ( userID !== null && userID !== undefined && userID !== '' ) { filtersObject.filters['activeParticipant.userID'] = userID; }

      // add alternativeUserID filter
      var alternativeUserID = $scope.filters.activeParticipant.alternativeUserID;
      if ( alternativeUserID !== null && alternativeUserID !== undefined && alternativeUserID !== '' ) { filtersObject.filters['activeParticipant.alternativeUserID'] = alternativeUserID; }

      // add networkAccessPointID filter
      var networkAccessPointID = $scope.filters.activeParticipant.networkAccessPointID;
      if ( networkAccessPointID !== null && networkAccessPointID !== undefined && networkAccessPointID !== '' ) { filtersObject.filters['activeParticipant.networkAccessPointID'] = networkAccessPointID; }

      // add eventID filter
      var roleIDCode = $scope.filters.activeParticipant.roleIDCode;
      if ( roleIDCode !== null && roleIDCode !== undefined ) { filtersObject.filters['activeParticipant.roleIDCode'] = roleIDCode; }
      /* ----- filter by Active Participant ----- */


      /* ----- filter by Participant Object ----- */
      // add objectID filter
      var objectID = $scope.filters.participantObjectIdentification.participantObjectID;
      if ( objectID !== null && objectID !== undefined && objectID !== '' ) {

        // if patientID set then update query to include 'AND' operator
        if ( patientID !== null && patientID !== undefined && patientID !== '' ) {
          filtersObject.filters['participantObjectIdentification.participantObjectID'] = { type: 'AND', patientID: participantPatientID, objectID: objectID };
        }else{
          filtersObject.filters['participantObjectIdentification.participantObjectID'] = JSON.stringify( objectID );
        }

      }

      // add objectIDTypeCode filter
      var participantObjectIDTypeCode = $scope.filters.participantObjectIdentification.participantObjectIDTypeCode;
      if ( participantObjectIDTypeCode !== null && participantObjectIDTypeCode !== undefined ) { filtersObject.filters['participantObjectIdentification.participantObjectIDTypeCode'] = participantObjectIDTypeCode; }

      // add objectDetailType filter
      var objectDetailType = $scope.filters.participantObjectIdentification.participantObjectDetail.type;
      if ( objectDetailType !== null && objectDetailType !== undefined && objectDetailType !== '' ) { filtersObject.filters['participantObjectIdentification.participantObjectDetail.type'] = objectDetailType; }

      // add objectDetailValue filter
      var objectDetailValue = $scope.filters.participantObjectIdentification.participantObjectDetail.value;
      if ( objectDetailValue !== null && objectDetailValue !== undefined && objectDetailValue !== '' ) { filtersObject.filters['participantObjectIdentification.participantObjectDetail.value'] = objectDetailValue; }
      /* ----- filter by Participant Object ----- */

      /* ----- filter by Audit Source ----- */
      // add auditSource filter
      var auditSourceID = $scope.filters.auditSourceIdentification.auditSourceID;
      if ( auditSourceID !== null && auditSourceID !== undefined ) { filtersObject.filters['auditSourceIdentification.auditSourceID'] = auditSourceID; }
      /* ----- filter by Audit Source ----- */

      /* ##### construct filters ##### */

      return filtersObject;
    };

    var refreshSuccess = function (audits){
      // on success
      $scope.audits = audits;

      if( audits.length < $scope.showlimit ){
        jQuery('#loadMoreBtn').hide();

        if( audits.length === 0 ){
          Alerting.AlertAddMsg('bottom', 'warning', 'There are no audits for the current filters');
        }

      }else{
        //Show the load more button
        jQuery('#loadMoreBtn').show();
      }
    };

    var refreshError = function(err){
      // on error - Hide load more button and show error message
      jQuery('#loadMoreBtn').hide();
      Alerting.AlertAddServerMsg(err.status);
    };

    //Refresh audits list
    $scope.refreshAuditsList = function () {
      $scope.audits = null;
      Alerting.AlertReset();

      //reset the showpage filter to start at 0
      $scope.showpage = 0;
      $scope.showlimit = $scope.settings.filter.limit;

      Api.Audits.query( $scope.returnFilterObject(), refreshSuccess, refreshError);

    };
    //run the transaction list view for the first time
    $scope.refreshAuditsList();

    //Refresh audits list
    $scope.loadMoreAudits = function () {
      $scope.busyLoadingMore = true;
      Alerting.AlertReset();

      $scope.showpage++;
      Api.Audits.query( $scope.returnFilterObject(), loadMoreSuccess, loadMoreError);
    };

    var loadMoreSuccess = function (audits){
      //on success
      $scope.audits = $scope.audits.concat(audits);
      //remove any duplicates objects found in the audits scope
      $scope.audits = jQuery.unique($scope.audits);

      if( audits.length < $scope.showlimit ){
        jQuery('#loadMoreBtn').hide();
        Alerting.AlertAddMsg('bottom', 'warning', 'There are no more audits to retrieve');
      }

      $scope.busyLoadingMore = false;
    };

    var loadMoreError = function(err){
      // on error - Hide load more button and show error message
      jQuery('#loadMoreBtn').hide();
      Alerting.AlertAddServerMsg(err.status);
    };

    //location provider - load transaction details
    $scope.viewAuditDetails = function (path, $event) {
      //do audits details redirection when clicked on TD
      if( $event.target.tagName === 'TD' ){
        var baseUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#/';
        var txUrl = baseUrl + path;
        if ( $scope.settings.list.tabview && $scope.settings.list.tabview === 'new' ){
          window.open(txUrl, '_blank');
        }else{
          $location.path(path);
        }
      }
    };
    
    //Clear filter data end refresh audits scope
    $scope.clearFilters = function () {
      $scope.settings.filter.limit = 10;
      $scope.settings.filter.dateStart = '';
      $scope.settings.filter.dateEnd = '';
      $scope.settings.list.tabview = 'same';

      // reset audit filters
      setupAuditFilters();

      //run the transaction list view after filters been cleared
      $scope.refreshAuditsList();
    };

    /*************************************************************/
    /**         Audits List and Detail view functions           **/
    /*************************************************************/


  });
