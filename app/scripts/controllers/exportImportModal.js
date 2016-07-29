'use strict';

angular.module('openhimConsoleApp')
  .controller('ExportImportModalCtrl', function ($scope, $modal, $modalInstance, $timeout, Api, Alerting, data) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    $scope.outcome = {
      selectedAll: false
    };
    $scope.ngErrors = {};
    $scope.conflicts = [];
    $scope.validImports = [];
    $scope.importStatus = 'resolvingConflicts';

    for(var i=0; i < data.successes.length; i++) {
      if(data.successes[i].status === 'Conflict') {$scope.conflicts.push(data.successes[i]);}
      if(data.successes[i].status === 'Valid') {$scope.validImports.push(data.successes[i]);}
    }

    $scope.cancel = function () {
      $timeout.cancel( $scope.clearValidationRoute );
      $modalInstance.dismiss('cancel');
    };

    $scope.resetErrors = function(){
      Alerting.AlertReset();
      $scope.ngErrors.hasErrors = false;
      angular.forEach($scope.conflicts, function(item) {
        item.errMsg = undefined;
      });
    };

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/



    /****************************************/
    /**         Import Functions           **/
    /****************************************/

    // import failed function
    var importFail = function(err) {
      Alerting.AlertReset();
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred during the import: #' + err.status + ' - ' + err.data);
    };

    // import success function
    var importSuccess = function(data) {
      $scope.importStatus = 'done';
      $modalInstance.close(data);
    };

    // function to run import file
    $scope.runImportFile = function(importData) {
      console.log(importData);
      
      Api.Metadata.save(importData, function(result) {
        importSuccess(result);
      }, function(err) {
        importFail(err);
      });
    };

    var validateImport = function() {
      console.log('start validation');
      // update the uid for each 
      angular.forEach($scope.conflicts, function(item) {
        if(item.action && item.action === 'duplicate'){
          var err = 'Needs to be different to original uid.';
          if(item.model==='Channels' && item.record.name === item.uid) {item.errMsg = err;}
          else if(item.model==='Clients' && item.record.clientID === item.uid) {item.errMsg = err;}
          else if(item.model==='Mediators' && item.record.urn === item.uid) {item.errMsg = err;}
          else if(item.model==='Users' && item.record.email === item.uid) {item.errMsg = err;}
          else if(item.model==='ContactGroups' && item.record.groups === item.uid) {item.errMsg = err;}

          $scope.ngErrors.hasErrors = $scope.conflicts.some(function(item){
            return item.errMsg;
          });
        }
      });

      if($scope.ngErrors.hasErrors) {
        $scope.clearValidationRoute = $timeout(function(){
          console.log('reset errors');
          // clear errors after 5 seconds
          $scope.resetErrors();
        }, 5000);
        Alerting.AlertAddMsg('hasErrorsImport', 'danger', 'There are errors on the import form.');
      }
      console.log($scope.conflicts);

      return !$scope.ngErrors.hasErrors;
    };

    $scope.saveImport = function() {
      if(validateImport()){
        $scope.importStatus = 'progress';
        console.log($scope.validImports);
        console.log($scope.conflicts);
        
        // setup data object
        var resolvedData = {
          'Channels': [],
          'Clients': [],
          'Mediators': [],
          'Users': [],
          'ContactGroups': []
        };

        angular.forEach($scope.conflicts, function(item) {

          // update the uid for each 
          if(item.action && item.action === 'duplicate'){
            if(item.model==='Channels') {item.record.name = item.uid;}
            else if(item.model==='Clients') {item.record.clientID = item.uid;}
            else if(item.model==='Mediators') {item.record.urn = item.uid;}
            else if(item.model==='Users') {item.record.email = item.uid;}
            else if(item.model==='ContactGroups') {item.record.groups = item.uid;}
          }

          if(item.action && item.action !== 'ignore'){
            if(item.model==='Channels') {resolvedData.Channels.push(item.record);}
            else if(item.model==='Clients') {resolvedData.Clients.push(item.record);}
            else if(item.model==='Mediators') {resolvedData.Mediators.push(item.record);}
            else if(item.model==='Users') {resolvedData.Users.push(item.record);}
            else if(item.model==='ContactGroups') {resolvedData.ContactGroups.push(item.record);}  
          }
        });

        // read the import script data and process
        $scope.runImportFile(resolvedData);
      }
    };

    $scope.viewRecordDetails = function(type, content) {
      $modal.open({
        templateUrl: 'views/transactionsBodyModal.html',
        controller: 'TransactionsBodyModalCtrl',
        windowClass: 'modal-fullview',
        resolve: {
          bodyData: function () {
            return { type: type, content: content, headers: { 'content-type': 'application/json' } };
          }
        }
      });
    };

    $scope.selectAll = function() {
      angular.forEach($scope.conflicts, function(item) {
        item.action = !$scope.outcome.selectedAll ? 'overwrite' : (item.action === 'overwrite' ? 'ignore' : item.action);
      });
    };

    $scope.checkIfAllOverwrites = function() {
      $scope.outcome.selectedAll = $scope.conflicts.every(function(item) {
        return item.action === 'overwrite';
      });
    };
    $scope.checkIfAllOverwrites();

    /****************************************/
    /**         Import Functions           **/
    /****************************************/
  });
