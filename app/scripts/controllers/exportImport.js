'use strict';

angular.module('openhimConsoleApp')
  .controller('ExportImportCtrl', function ($upload, $scope, $modal, Api, Alerting) {


    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    $scope.downloadLink = '';
    $scope.validatedData = {};

    // function to reset export options to default
    $scope.resetExportOptions = function() {
      // assign all collections to select exports object
      $scope.selectedExports = {};
      $scope.selectedExports.Users = $scope.exportCollections.Users;
      $scope.selectedExports.Clients = $scope.exportCollections.Clients;
      $scope.selectedExports.Channels = $scope.exportCollections.Channels;
      $scope.selectedExports.Mediators = $scope.exportCollections.Mediators;
      $scope.selectedExports.ContactGroups = $scope.exportCollections.ContactGroups;

      // set show all records to false - Entire collections being exported
      $scope.showRecordOptions = {};
      $scope.showRecordOptions.Users = false;
      $scope.showRecordOptions.Clients = false;
      $scope.showRecordOptions.Channels = false;
      $scope.showRecordOptions.Mediators = false;
      $scope.showRecordOptions.ContactGroups = false;
    };
    
    var getMetadataSuccess = function(result) {
      exportObject = result[0];
      var Users = exportObject.Users;
      var Clients = exportObject.Clients;
      var Channels = exportObject.Channels;
      var Mediators = exportObject.Mediators;
      var ContactGroups = exportObject.ContactGroups;

      // set up settings object
      $scope.exportSettings = {};
      $scope.exportSettings.removeIds = true;

      // Assign API collections to export options object
      $scope.exportCollections = {};
      $scope.exportCollections.Users = Users;
      $scope.exportCollections.Clients = Clients;
      $scope.exportCollections.Channels = Channels;
      $scope.exportCollections.Mediators = Mediators;
      $scope.exportCollections.ContactGroups = ContactGroups;

      // set inital reset ( default export option )
      $scope.resetExportOptions();
    };
    
    var getMetadataError = function(err) {
      Alerting.AlertReset();
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while fetching metadata: #' + err.status + ' - ' + err.data);
    };

    var openValidationModal = function() {
      console.log($scope.importStatus);
      var modalInstance = $modal.open({
        templateUrl: 'views/exportImportModal.html',
        controller: 'ExportImportModalCtrl',
        resolve: {
          data: function () {return $scope.validatedData;}
        }
      });

      modalInstance.result.then(function(importResults) {
        $scope.importStatus = 'done';
        $scope.importResults = importResults;
      }, function() {
        console.info('Modal dismissed at: ' + new Date());
      });
    };      
      
    // Make API requests for the export configuration options
    var exportObject = Api.Metadata.query(function(result) {
      getMetadataSuccess(result);
    }, function(err) {
      getMetadataError(err);
    });

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/




    /****************************************/
    /**         Export Functions           **/
    /****************************************/
      
    // function to toggle entire collection
    $scope.toggleCollectionExportSelection = function(model, collection) {
      if ( $scope.selectedExports[model] === collection) {
        $scope.selectedExports[model] = [];
        $scope.showRecordOptions[model] = true;
      }else {
        $scope.selectedExports[model] = collection;
        $scope.showRecordOptions[model] = false;
      }
    };

    // function to toggle specific records
    $scope.toggleRecordExportSelection = function(model, record) {
      var idx = $scope.selectedExports[model].indexOf(record);

      // is currently selected
      if (idx > -1) {
        $scope.selectedExports[model].splice(idx, 1);
      } else {
        // is newly selected
        $scope.selectedExports[model].push(record);
      }
    };
    // function to remove certain properties from export object
    $scope.removeProperties = function(obj) {
      var propertyID = '_id';
      var propertyV = '__v';
      
      for (var prop in obj) {
        if (prop === propertyID || prop === propertyV) {
          delete obj[prop];
        } else if ( typeof obj[prop] === 'object' || obj[prop] instanceof Array ) {
          $scope.removeProperties(obj[prop]);
        }
      }
      return obj;
    };


    var NewBlob = function(data, datatype) {
      var out;
      try {
        out = new Blob([data], {type: datatype});
      }
      catch (e) {

        var BlobBuilder = function(){
          window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
        };
        
        if (e.name === 'TypeError' && window.BlobBuilder) {
          var bb = new BlobBuilder();
          bb.append(data);
          out = bb.getBlob(datatype);
        }
        else if (e.name === 'InvalidStateError') {
          // InvalidStateError (tested on FF13 WinXP)
          out = new Blob([data], {type: datatype});
        }
        else {
          out = { error: 'Browser not supported for Blob creation' };
          // We're screwed, blob constructor unsupported entirely
        }
      }
      return out;
    };


    // function to create the export file object
    $scope.createExportFile = function() {
      var exportData = angular.copy( $scope.selectedExports );
      var textFile = null;

      // create the export script as a blob file
      var makeTextFile = function (text) {
        //var data = new Blob([text], {type: 'application/json'});
        var data = new NewBlob(text, 'application/json');

        // if blob error exist
        if ( data.error ) {
          return;
        } else {
          // If we are replacing a previously generated file we need to
          // manually revoke the object URL to avoid memory leaks.
          if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
          }
          textFile = window.URL.createObjectURL(data);
          return textFile;
        }
      };

      exportData = JSON.stringify( $scope.removeProperties( exportData ), null, 2 );
      $scope.importScriptName = 'openhim-insert.json';
      
      // assign download link and show download button
      var blobLink = makeTextFile( exportData );
      if ( blobLink ) {
        $scope.downloadLink = blobLink;
      }
      
    };

    // function for when the download button is clicked
    $scope.downloadExportFile = function() {
      //reset download link and remove download button
      $scope.downloadLink = '';
    };

    /****************************************/
    /**         Export Functions           **/
    /****************************************/



    /****************************************/
    /**         Import Functions           **/
    /****************************************/

    var validateImportFail = function(err) {
      console.log(err);

      Alerting.AlertReset();
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while validating the import: #' + err.status + ' - ' + err.data);
    };

    var validateImportSuccess = function(result) {
      console.log('succesfully validated uploaded file');
      $scope.importStatus = 'resolvingConflicts';
      $scope.validatedData = result;

      openValidationModal();
    };

    $scope.validateImportFile = function(data) {
      $scope.importStatus = 'progress';

      Api.MetadataValidation.save(data, function(result){
        validateImportSuccess(result);
      }, function(err){
        validateImportFail(err);
      });
    };

    // watch if files have been dropped
    $scope.$watch('files', function () {
      $scope.upload($scope.files);
    });

    // function to upload the file
    $scope.upload = function (files) {
      if (files && files.length) {

        var reader = new FileReader();

        // onload function used by the reader
        reader.onload = function(event) {
          // read the import script data and validate
          $scope.validateImportFile(event.target.result);
        };

        // foreach uploaded file
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
                   
          // when the file is read it triggers the onload event function above.
          reader.readAsText(file);
        }
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

    $scope.showConflictModal = function() {
      openValidationModal();
    };


    /****************************************/
    /**         Import Functions           **/
    /****************************************/
  });
