'use strict';

angular.module('openhimWebui2App')
  .controller('ExportImportCtrl', function ($upload, $scope, $modal, Api) {


    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    $scope.downloadLink = '';

    // function to reset export options to default
    $scope.resetExportOptions = function(){
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

    // Make API requests for the export configuration options
    var Users = Api.Users.query();
    var Clients = Api.Clients.query();
    var Channels = Api.Channels.query();
    var Mediators = Api.Mediators.query();
    var ContactGroups = Api.ContactGroups.query();

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
      }else {
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
        } else if ( typeof obj[prop] === 'object' || obj[prop] instanceof Array ){
          $scope.removeProperties(obj[prop]);
        }
      }

      return obj;
    };






    var NewBlob = function(data, datatype){
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
    $scope.createExportFile = function(){
      
      var exportData = angular.copy( $scope.selectedExports );
      var textFile = null;

      // create the export script as a blob file
      var makeTextFile = function (text) {
        //var data = new Blob([text], {type: 'application/json'});
        var data = new NewBlob(text, 'application/json');

        // if blob error exist
        if ( data.error ){
          return;
        }else{
          // If we are replacing a previously generated file we need to
          // manually revoke the object URL to avoid memory leaks.
          if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
          }

          textFile = window.URL.createObjectURL(data);
          return textFile;
        }
      };

      if ( $scope.exportSettings.removeIds === false ){
        exportData = JSON.stringify( exportData, null, 2 );
        $scope.importScriptName = 'openhim-update.json';
      }else{
        exportData = JSON.stringify( $scope.removeProperties( exportData ), null, 2 );
        $scope.importScriptName = 'openhim-insert.json';
      }
      
      // assign download link and show download button
      var blobLink = makeTextFile( exportData );
      if ( blobLink ){
        $scope.downloadLink = blobLink;
      }
      
    };

    // function for when the download button is clicked
    $scope.downloadExportFile = function(){
      //reset download link and remove download button
      $scope.downloadLink = '';
    };

    /****************************************/
    /**         Export Functions           **/
    /****************************************/



    /****************************************/
    /**         Import Functions           **/
    /****************************************/

    // import failed function
    var importFail = function(model, value, err){
      $scope.failedImports.push({ model:model, record: value, error: err.data, status: err.status });
      $scope.importFail++;
    };

    // import success function
    var importSuccess = function(){
      $scope.importSuccess++;
    };

    // function to run import file
    $scope.runImportFile = function(data){

      // set counter variables
      $scope.importFail = 0;
      $scope.importSuccess = 0;
      $scope.failedImports = [];
      $scope.importProgressStatus = 0;
      $scope.importProgressType = '';

      // convert to json object
      data = JSON.parse(data);

      var totalRecords = 0;
      totalRecords += data.Clients.length;
      totalRecords += data.Channels.length;
      totalRecords += data.ContactGroups.length;
      totalRecords += data.Users.length;
      totalRecords += data.Mediators.length;

      var doneItems = 0;

      //loop through each collection in object
      angular.forEach(data, function(modelRecords, model) {

        // loop through each record
        angular.forEach(modelRecords, function(value) {

          var record;
          var insertParams = {};

          // check model to determine which API to call
          switch(model) {
            case 'Clients':
              record = new Api.Clients( value );
              break;
            case 'Channels':
              record = new Api.Channels( value );
              break;
            case 'ContactGroups':
              record = new Api.ContactGroups( value );
              break;
            case 'Mediators':
              if ( value._id ){
                delete value._id;
              }
              record = new Api.Mediators( value );
              insertParams.urn = '';
              break;
            case 'Users':
              record = new Api.Users( value );
              insertParams.email = '';
              break;
            default:
              // no default yet
          }

          // if record has _id then do update
          if ( record._id ){
            record.$update(function(){
              importSuccess();
            }, function(err){
              importFail(model, value, err);
            });
          }else{
            record.$save(insertParams, function(){
              importSuccess();
            }, function(err){
              importFail(model, value, err);
            });
          }

          doneItems++;
          $scope.importProgressStatus = Math.floor( doneItems / totalRecords );

          // update progress bar too 100%
          if( doneItems === totalRecords ){
            $scope.importProgressStatus = 100;
            $scope.importProgressType = 'success';
          }

        });

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
          var data = event.target.result;
          // read the import script data and process
          $scope.runImportFile(data);
        };

        // foreach uploaded file
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
                   
          // when the file is read it triggers the onload event function above.
          reader.readAsText(file);
        }
      }
    };


    /****************************************/
    /**         Import Functions           **/
    /****************************************/

    

  });
