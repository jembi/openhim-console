'use strict';

angular.module('openhimWebui2App')
  .controller('ExportImportCtrl', function ($upload, $scope, $modal, Api, Import) {


    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

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
      
    $scope.toggleCollectionExportSelection = function(model, collection) {
      if ( $scope.selectedExports[model] === collection) {
        $scope.selectedExports[model] = [];
        $scope.showRecordOptions[model] = true;
      }else {
        $scope.selectedExports[model] = collection;
        $scope.showRecordOptions[model] = false;
      }
    };


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

    $scope.createExportFile = function(){
      
      var exportData = angular.copy( $scope.selectedExports );
      var textFile = null;
      var makeTextFile = function (text) {
        var data = new Blob([text], {type: 'application/json'});

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
          window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        return textFile;
      };

      if ( $scope.exportSettings.removeIds === false ){
        exportData = JSON.stringify( exportData, null, 2 );
        $scope.importScriptName = 'openhim-update.json';
      }else{
        exportData = JSON.stringify( $scope.removeProperties( exportData ), null, 2 );
        $scope.importScriptName = 'openhim-insert.json';
      }
      
      var link = document.getElementById('downloadlink');
      link.href = makeTextFile( exportData );
      link.style.display = 'inline-block';
      
    };

    $scope.downloadExportFile = function(){
      var link = document.getElementById('downloadlink');
      link.style.display = 'none';
    };

    /****************************************/
    /**         Export Functions           **/
    /****************************************/



    /****************************************/
    /**         Import Functions           **/
    /****************************************/

    var importFail = function(model, value, err){
      $scope.failedImports.push({ model:model, record: value, error: err.data, status: err.status });
      $scope.importFail++;
    };

    var importSuccess = function(){
      $scope.importSuccess++;
    };

    $scope.runImportFile = function(data){

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

        angular.forEach(modelRecords, function(value) {

          var record;

          switch(model) {
            case 'Clients':
              record = new Import.Clients( value );
              break;
            case 'Channels':
              record = new Import.Channels( value );
              break;
            case 'ContactGroups':
              record = new Import.ContactGroups( value );
              break;
            case 'Mediators':
              // remove medaitor _id if exists
              if( value._id ){
                delete value._id;
              }
              record = new Import.Mediators( value );
              break;
            case 'Users':
              record = new Import.Users( value );
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
            record.$save( function(){
              importSuccess();
            }, function(err){
              importFail(model, value, err);
            });
          }

          doneItems++;
          $scope.importProgressStatus = Math.floor( doneItems / totalRecords );

          if( doneItems === totalRecords ){
            $scope.importProgressStatus = 100;
            $scope.importProgressType = 'success';
          }

          $scope.$apply();

        });

      });

    };


    $scope.$watch('files', function () {
      $scope.upload($scope.files);
    });

    var reader = new FileReader();
    // inject an image with the src url
    reader.onload = function(event) {
      var data = event.target.result;
      // read the import script data and process
      $scope.runImportFile(data);
    };

    $scope.upload = function (files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
                   
          // when the file is read it triggers the onload event above.
          reader.readAsText(file);
        }
      }
    };


    /****************************************/
    /**         Import Functions           **/
    /****************************************/

    

  });
