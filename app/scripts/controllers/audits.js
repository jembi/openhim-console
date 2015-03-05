'use strict';
/* global jQuery:false */
/* global moment:false */

angular.module('openhimConsoleApp')
  .controller('AuditsCtrl', function ($scope, $modal, $location, Api, Alerting, AuditLookups) {


    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    var consoleSession = localStorage.getItem('consoleSession');
    consoleSession = JSON.parse(consoleSession);
    $scope.consoleSession = consoleSession;
    var userSettings = consoleSession.sessionUserSettings;


    //return results for the first page (10 results)
    $scope.showpage = 0;
    $scope.showlimit = 10;

    $scope.eventActionMap = AuditLookups.eventActionMap();
    $scope.eventOutcomeMap = AuditLookups.eventOutcomeMap();

    /*$scope.eventActionMap = {};
    $scope.eventActionMap.C = 'Create (C)';
    $scope.eventActionMap.R = 'Read (R)';
    $scope.eventActionMap.U = 'Update (U)';
    $scope.eventActionMap.D = 'Delete (D)';
    $scope.eventActionMap.E = 'Execute (E)';

    $scope.eventOutcomeMap = {};
    $scope.eventOutcomeMap[0] = 'Success (0)';
    $scope.eventOutcomeMap[4] = 'Minor Failure (4)';
    $scope.eventOutcomeMap[8] = 'Serious Failure (8)';
    $scope.eventOutcomeMap[12] = 'Major Failure (12)';*/


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
        
        if ( userSettings.filter.limit && userSettings.filter.limit !== 0){
          $scope.settings.filter.limit = userSettings.filter.limit;
        }else{
          $scope.settings.filter.limit = 100;
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
      var startDate, endDate;
      var filterDateStart, filterDateEnd;

      //filterStatus = $scope.settings.filter.status;
      //filterChannel = $scope.settings.filter.channel;
      filterDateStart = $scope.settings.filter.dateStart;
      filterDateEnd = $scope.settings.filter.dateEnd;
      

      //if(filterStatus){ filtersObject.status = filterStatus; }
      if(filterDateStart && filterDateEnd){
        startDate = moment(filterDateStart).format();
        endDate = moment(filterDateEnd).endOf('day').format();

        filtersObject.startDate = startDate;
        filtersObject.endDate = endDate;
      }
      filtersObject.filterPage = $scope.showpage;
      filtersObject.filterLimit = $scope.showlimit;

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
      $scope.settings.filter.eventAction = '';
      $scope.settings.filter.eventOutcome = '';
      $scope.settings.filter.dateStart = '';
      $scope.settings.filter.dateEnd = '';
      $scope.settings.list.tabview = 'same';

      //run the transaction list view after filters been cleared
      $scope.refreshAuditsList();
    };

    /*************************************************************/
    /**         Audits List and Detail view functions           **/
    /*************************************************************/


  });
