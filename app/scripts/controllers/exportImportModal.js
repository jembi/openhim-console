'use strict';

angular.module('openhimConsoleApp')
  .controller('ExportImportModalCtrl', function ($scope, $modal, $modalInstance, Api, Alerting, data) {

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    console.log(data);
    $scope.validationResults = data;
    // $scope.viewRecordDetails = viewRecordDetails;

    // 
    $scope.outcome = {
      selectedAll: false
    };
    $scope.conflicts = [];
    $scope.validImports = [];

    for(var i=0; i < $scope.validationResults.successes.length; i++) {
      if($scope.validationResults.successes[i].status === 'Conflict') {$scope.conflicts.push($scope.validationResults.successes[i]);}
      if($scope.validationResults.successes[i].status === 'Valid') {$scope.validImports.push($scope.validationResults.successes[i]);}
    }

    $scope.saveImport = function() {
      console.log(data);

      // read the import script data and process
      // $scope.runImportFile(data);

      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
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
      $scope.importResult = data;
    };

    // function to run import file
    $scope.runImportFile = function(data) {
      $scope.importStatus = 'progress';
      $scope.updateFlag = false;

      data = JSON.parse(data);
      
      // If record has _id then do update instead of insert
      if (data.Clients && data.Clients.length > 0 && data.Clients[0]._id) { $scope.updateFlag = true; }
      if (data.Channels && data.Channels.length > 0 && data.Channels[0]._id) { $scope.updateFlag = true; }
      if (data.ContactGroups && data.ContactGroups.length > 0 && data.ContactGroups[0]._id) { $scope.updateFlag = true; }
      if (data.Users && data.Users.length > 0 && data.Users[0]._id) { $scope.updateFlag = true; }
      if (data.Mediators && data.Mediators.length > 0 && data.Mediators[0]._id) { $scope.updateFlag = true; }

      if ( $scope.updateFlag ) {
        Api.Metadata.update(data, function(result) {
          importSuccess(result);
        }, function(err) {
          importFail(err);
        });
      } else {
        Api.Metadata.save(data, function(result) {
          importSuccess(result);
        }, function(err) {
          importFail(err);
        });
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
        item.selected = !$scope.outcome.selectedAll;
      });
      console.log($scope.conflicts);
    };

    $scope.checkIfAllSelected = function() {
      $scope.outcome.selectedAll = $scope.conflicts.every(function(item) {
        return item.selected;
      });
    };


    /****************************************/
    /**         Import Functions           **/
    /****************************************/

  });
