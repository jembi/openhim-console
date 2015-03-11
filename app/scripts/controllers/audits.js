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


      //return results for the first page (10 results)
      $scope.showpage = 0;
      $scope.showlimit = 10;

      // setup audit lookup objects
      $scope.eventActionMap = AuditLookups.eventActionMap();
      $scope.eventOutcomeMap = AuditLookups.eventOutcomeMap();

      // setup default audits settings
      $scope.settings = {};
      $scope.settings.filter = {};
      if ( $location.search().limit ){ $scope.settings.filter.limit = $location.search().limit; }else{ $scope.settings.filter.limit = 10; }
      if ( $location.search().dateStart ){ $scope.settings.filter.dateStart = $location.search().dateStart; }else{ $scope.settings.filter.dateStart = ''; }
      if ( $location.search().dateEnd ){ $scope.settings.filter.dateEnd = $location.search().dateEnd; }else{ $scope.settings.filter.dateEnd = ''; }
      $scope.settings.list = {};
      $scope.settings.list.tabview = 'same';


      $scope.filters = {};
      $scope.filters.eventIdentification = {};
      if ( $location.search().eventID ){ $scope.filters.eventIdentification.eventID = $location.search().eventID; }
      if ( $location.search().eventTypeCode ){ $scope.filters.eventIdentification.eventTypeCode = $location.search().eventTypeCode; }
      if ( $location.search().eventActionCode ){ $scope.filters.eventIdentification.eventActionCode = $location.search().eventActionCode; }
      if ( $location.search().eventOutcomeIndicator ){ $scope.filters.eventIdentification.eventOutcomeIndicator = $location.search().eventOutcomeIndicator; }

      $scope.filters.participantObjectIdentification = {};
      $scope.filters.participantObjectIdentification.patientID = {};
      if ( $location.search().patientID ){ $scope.filters.participantObjectIdentification.patientID.patientID = $location.search().patientID; }
      if ( $location.search().assigningAuth ){ $scope.filters.participantObjectIdentification.patientID.assigningAuth = $location.search().assigningAuth; }
      if ( $location.search().assigningAuthID ){ $scope.filters.participantObjectIdentification.patientID.assigningAuthID = $location.search().assigningAuthID; }

      if ( $location.search().participantObjectID ){ $scope.filters.participantObjectIdentification.participantObjectID = $location.search().participantObjectID; }
      if ( $location.search().participantObjectIDTypeCode ){ $scope.filters.participantObjectIdentification.participantObjectIDTypeCode = $location.search().participantObjectIDTypeCode; }
      $scope.filters.participantObjectIdentification.participantObjectDetail = {};
      if ( $location.search().participantObjectDetailType ){ $scope.filters.participantObjectIdentification.participantObjectDetail.type = $location.search().participantObjectDetailType; }
      if ( $location.search().participantObjectDetailValue ){ $scope.filters.participantObjectIdentification.participantObjectDetail.value = $location.search().participantObjectDetailValue; }

      $scope.filters.activeParticipant = {};
      if ( $location.search().userID ){ $scope.filters.activeParticipant.userID = $location.search().userID; }
      if ( $location.search().roleIDCode ){ $scope.filters.activeParticipant.roleIDCode = $location.search().roleIDCode; }
      if ( $location.search().alternativeUserID ){ $scope.filters.activeParticipant.alternativeUserID = $location.search().alternativeUserID; }
      if ( $location.search().networkAccessPointID ){ $scope.filters.activeParticipant.networkAccessPointID = $location.search().networkAccessPointID; }
      
      $scope.filters.auditSourceIdentification = {};
      if ( $location.search().auditSourceID ){ $scope.filters.auditSourceIdentification.auditSourceID = $location.search().auditSourceID; }


    };
    setupAuditFilters();


    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);
    $scope.consoleSession = consoleSession;
    var userSettings = consoleSession.sessionUserSettings;


    

    if ( userSettings ){
      if ( userSettings.filter ){
        
        if ( userSettings.filter.limit && userSettings.filter.limit !== 0 && userSettings.filter.limit === ''){
          $scope.settings.filter.limit = userSettings.filter.limit;
        }

        //$scope.settings.filter.dateStart = '';
        //$scope.settings.filter.dateEnd = '';
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

    var valeNotEmpty = function(value){
      if ( value !== null && value !== undefined && value !== '' ) {
        return true;
      }
      return false;
    };

    //setup filter options
    $scope.returnFilters = function(type){
      var filtersObject = {};
      var filterUrlParams = '';
      var filterDateStart, filterDateEnd;

      filtersObject.filterPage = $scope.showpage;
      filtersObject.filterLimit = $scope.showlimit;
      filterUrlParams += '&limit='+$scope.settings.filter.limit;


      /* ##### construct filters ##### */
      filtersObject.filters = {};

      // date filter
      filterDateStart = $scope.settings.filter.dateStart;
      filterDateEnd = $scope.settings.filter.dateEnd;
      if(filterDateStart && filterDateEnd){
        var startDate = moment(filterDateStart).format();
        var endDate = moment(filterDateEnd).endOf('day').format();
        filtersObject.filters['eventIdentification.eventDateTime'] = JSON.stringify( { '$gte': startDate, '$lte': endDate } );
        filterUrlParams += '&dateStart='+startDate;
        filterUrlParams += '&dateEnd='+endDate;
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
      if ( valeNotEmpty(patientID) === true ) {
        filtersObject.filters['participantObjectIdentification.participantObjectID'] = JSON.stringify( participantPatientID);
        filterUrlParams += '&patientID='+patientID;
      }
      /* ----- filter by Patient ----- */


      /* ----- filter by Event ----- */
      // add eventID filter
      var eventTypeCode = $scope.filters.eventIdentification.eventTypeCode;
      if ( valeNotEmpty(eventTypeCode) === true ) {
        // construct object to query in mongo
        var eventTypeArray = eventTypeCode.split('---');
        filtersObject.filters['eventIdentification.eventTypeCode.code'] = eventTypeArray[0];
        filtersObject.filters['eventIdentification.eventTypeCode.codeSystemName'] = eventTypeArray[1];
        filtersObject.filters['eventIdentification.eventTypeCode.displayName'] = eventTypeArray[2];
        filterUrlParams += '&eventTypeCode='+eventTypeCode;
      }

      // add eventID filter
      var eventID = $scope.filters.eventIdentification.eventID;
      if ( valeNotEmpty(eventID) === true ) {
        var eventIDArray = eventID.split('---');
        filtersObject.filters['eventIdentification.eventID.code'] = eventIDArray[0];
        filtersObject.filters['eventIdentification.eventID.codeSystemName'] = eventIDArray[1];
        filtersObject.filters['eventIdentification.eventID.displayName'] = eventIDArray[2];
        filterUrlParams += '&eventID='+eventID;
      }

      // add eventActionCode filter
      var eventActionCode = $scope.filters.eventIdentification.eventActionCode;
      if ( valeNotEmpty(eventActionCode) === true ) {
        filtersObject.filters['eventIdentification.eventActionCode'] = eventActionCode;
        filterUrlParams += '&eventActionCode='+eventActionCode;
      }

      // add eventOutcomeIndicator filter
      var eventOutcomeIndicator = $scope.filters.eventIdentification.eventOutcomeIndicator;
      if ( valeNotEmpty(eventOutcomeIndicator) === true ) {
        filtersObject.filters['eventIdentification.eventOutcomeIndicator'] = eventOutcomeIndicator;
        filterUrlParams += '&eventOutcomeIndicator='+eventOutcomeIndicator;
      }
      /* ----- filter by Event ----- */


      /* ----- filter by Active Participant ----- */
      // add userID filter
      var userID = $scope.filters.activeParticipant.userID;
      if ( valeNotEmpty(userID) === true ) {
        filtersObject.filters['activeParticipant.userID'] = userID;
        filterUrlParams += '&userID='+userID;
      }

      // add alternativeUserID filter
      var alternativeUserID = $scope.filters.activeParticipant.alternativeUserID;
      if ( valeNotEmpty(alternativeUserID) === true ) {
        filtersObject.filters['activeParticipant.alternativeUserID'] = alternativeUserID;
        filterUrlParams += '&alternativeUserID='+alternativeUserID;
      }

      // add networkAccessPointID filter
      var networkAccessPointID = $scope.filters.activeParticipant.networkAccessPointID;
      if ( valeNotEmpty(networkAccessPointID) === true ) {
        filtersObject.filters['activeParticipant.networkAccessPointID'] = networkAccessPointID;
        filterUrlParams += '&networkAccessPointID='+networkAccessPointID;
      }

      // add eventID filter
      var roleIDCode = $scope.filters.activeParticipant.roleIDCode;
      if ( valeNotEmpty(roleIDCode) === true ) {
        var roleIDCodeArray = roleIDCode.split('---');
        filtersObject.filters['activeParticipant.roleIDCode.code'] = roleIDCodeArray[0];
        filtersObject.filters['activeParticipant.roleIDCode.codeSystemName'] = roleIDCodeArray[1];
        filtersObject.filters['activeParticipant.roleIDCode.displayName'] = roleIDCodeArray[2];
        filterUrlParams += '&roleIDCode='+roleIDCode;
      }
      /* ----- filter by Active Participant ----- */


      /* ----- filter by Participant Object ----- */
      // add objectID filter
      var objectID = $scope.filters.participantObjectIdentification.participantObjectID;
      if ( valeNotEmpty(objectID) === true ) {
        filterUrlParams += '&participantObjectID='+objectID;

        // if patientID set then update query to include 'AND' operator
        if ( valeNotEmpty(patientID) === true ) {
          filtersObject.filters['participantObjectIdentification.participantObjectID'] = { type: 'AND', patientID: participantPatientID, objectID: objectID };
        }else{
          filtersObject.filters['participantObjectIdentification.participantObjectID'] = JSON.stringify( objectID );
        }

      }

      // add objectIDTypeCode filter
      var participantObjectIDTypeCode = $scope.filters.participantObjectIdentification.participantObjectIDTypeCode;
      if ( valeNotEmpty(participantObjectIDTypeCode) === true ) {
        var participantObjectIDTypeCodeArray = participantObjectIDTypeCode.split('---');
        filtersObject.filters['participantObjectIdentification.participantObjectIDTypeCode.code'] = participantObjectIDTypeCodeArray[0];
        filtersObject.filters['participantObjectIdentification.participantObjectIDTypeCode.codeSystemName'] = participantObjectIDTypeCodeArray[1];
        filtersObject.filters['participantObjectIdentification.participantObjectIDTypeCode.displayName'] = participantObjectIDTypeCodeArray[2];
        filterUrlParams += '&participantObjectIDTypeCode='+participantObjectIDTypeCode;
      }

      // add objectDetailType filter
      var objectDetailType = $scope.filters.participantObjectIdentification.participantObjectDetail.type;
      if ( valeNotEmpty(objectDetailType) === true ) {
        filtersObject.filters['participantObjectIdentification.participantObjectDetail.type'] = objectDetailType;
        filterUrlParams += '&participantObjectDetailType='+objectDetailType;
      }

      // add objectDetailValue filter
      var objectDetailValue = $scope.filters.participantObjectIdentification.participantObjectDetail.value;
      if ( valeNotEmpty(objectDetailValue) === true ) {
        filtersObject.filters['participantObjectIdentification.participantObjectDetail.value'] = objectDetailValue;
        filterUrlParams += '&participantObjectDetailValue='+objectDetailValue;
      }
      /* ----- filter by Participant Object ----- */

      /* ----- filter by Audit Source ----- */
      // add auditSource filter
      var auditSourceID = $scope.filters.auditSourceIdentification.auditSourceID;
      if ( valeNotEmpty(auditSourceID) === true ) {
        filtersObject.filters['auditSourceIdentification.auditSourceID'] = auditSourceID;
        filterUrlParams += '&auditSourceID='+auditSourceID;
      }
      /* ----- filter by Audit Source ----- */

      /* ##### construct filters ##### */

      if ( type === 'urlParams' ){
        return filterUrlParams;
      }else if (type === 'filtersObject'){
        return filtersObject;
      }
      
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


    $scope.applyFiltersToUrl = function(){
      var filters = $scope.returnFilters('urlParams');
      var baseUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#/';
      //$scope.refreshAuditsList()
      var path = 'audits?'+filters.substring(1);
      window.location = baseUrl + path;
    };

    //Refresh audits list
    $scope.refreshAuditsList = function () {

      $scope.audits = null;
      Alerting.AlertReset();

      //reset the showpage filter to start at 0
      $scope.showpage = 0;
      $scope.showlimit = $scope.settings.filter.limit;

      Api.Audits.query( $scope.returnFilters('filtersObject'), refreshSuccess, refreshError);

    };
    //run the audit list view for the first time
    $scope.refreshAuditsList();

    //Refresh audits list
    $scope.loadMoreAudits = function () {
      $scope.busyLoadingMore = true;
      Alerting.AlertReset();

      $scope.showpage++;
      Api.Audits.query( $scope.returnFilters('filtersObject'), loadMoreSuccess, loadMoreError);
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
      /*setupAuditFilters();

      //run the transaction list view after filters been cleared
      $scope.refreshAuditsList();*/
      var baseUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#/';
      var path = 'audits';
      window.location = baseUrl + path;
    };

    /*************************************************************/
    /**         Audits List and Detail view functions           **/
    /*************************************************************/


  });
