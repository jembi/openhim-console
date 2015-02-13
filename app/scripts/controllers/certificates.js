'use strict';

angular.module('openhimWebui2App')
  .controller('CertificatesCtrl', function ($upload, $scope, $modal, Api, Alerting) {


    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/

    $scope.showImportResults = false;
    $scope.certValidity = {};

    
    // function to reset certs
    $scope.resetCertificates = function(){
            
      // get server certificate data
      $scope.currentServerCert = Api.Keystore.get({ type: 'cert' });

      // get trusted certificates array
      $scope.trustedCerts = Api.Keystore.query({ type: 'ca' });

      // get current certificate validity
      Api.Keystore.get({ type: 'validity' }, function(result){
        $scope.certValidity = result;
      }, function(){
        $scope.certValidity.valid = false;
      });

    };

    // set inital certs
    $scope.resetCertificates();
    

    /***************************************************/
    /**         Initial page load functions           **/
    /***************************************************/






    /****************************************/
    /**         Import Functions           **/
    /****************************************/

    // import failed function
    $scope.uploadFail = function(err, location, fileName){
      if ( location === 'trustedCerts' ){
        $scope.failedImports.push({ filename: fileName, error: err.data, status: err.status });
      }else{
        Alerting.AlertAddMsg(location, 'danger', 'Upload error occured: [ File: '+fileName+' ] #' + err.status + ' - ' + err.data);
      }
      
      $scope.importFail++;
    };

    // import success function
    $scope.uploadSuccess = function(location, fileName){
      Alerting.AlertAddMsg(location, 'success', 'Newly Uploaded File: '+fileName);
      $scope.importSuccess++;
      $scope.resetCertificates();
    };

    // execute the certificate upload
    $scope.uploadCertificate = function(data, totalFiles, fileName){

      Alerting.AlertReset();

      $scope.importFail = 0;
      $scope.importSuccess = 0;
      $scope.failedImports = [];
      $scope.importProgressStatus = 0;
      $scope.importProgressType = '';

      var doneItems = 0;
      $scope.certificateObject = new Api.Keystore();

      switch ( $scope.uploadType ){
        case 'serverCert':
          $scope.certificateObject.cert = data;
          $scope.certificateObject.$save({ type: 'cert' }, function(){
            $scope.uploadSuccess('serverCert', fileName);
          }, function(err){
            $scope.uploadFail(err, 'serverCert', fileName);
          });
          break;
        case 'serverKey':
          $scope.certificateObject.key = data;
          $scope.certificateObject.$save({ type: 'key' }, function(){
            $scope.uploadSuccess('serverKey', fileName);
          }, function(err){
            $scope.uploadFail(err, 'serverKey', fileName);
          });
          break;
        case 'trustedCerts':
          $scope.certificateObject.cert = data;
          $scope.certificateObject.$save({ type: 'ca', property: 'cert' }, function(){
            $scope.uploadSuccess('trustedCerts', fileName);
          }, function(err){
            $scope.uploadFail(err, 'trustedCerts', fileName);
          });
          break;
      }

      doneItems++;
      $scope.importProgressStatus = Math.floor( doneItems / totalFiles );

      // update progress bar too 100%
      if( doneItems === totalFiles ){
        $scope.importProgressStatus = 100;
        $scope.importProgressType = 'success';
      }
      
    };

    /* ----- Watcher to look for dropped files ----- */

    // watch if serverCert have been dropped
    $scope.$watch('serverCert', function () {
      $scope.upload($scope.serverCert);
      $scope.uploadType = 'serverCert';
    });

    // watch if serverKey have been dropped
    $scope.$watch('serverKey', function () {
      $scope.upload($scope.serverKey);
      $scope.uploadType = 'serverKey';
    });

    // watch if trustedCerts have been dropped
    $scope.$watch('trustedCerts', function () {
      $scope.upload($scope.trustedCerts);
      $scope.uploadType = 'trustedCerts';
    });

    /* ----- Watcher to look for dropped files ----- */


    

    // function to upload the file
    $scope.upload = function (files) {
      if (files && files.length) {


        var fileWrappedImportread = function( file ){
          return function(event) {
            var data = event.target.result;
            // read the import script data and process
            $scope.uploadCertificate(data, files.length, file.name);
          };
        };

        $scope.showImportResults = false;

        // foreach uploaded file
        for (var i = 0; i < files.length; i++) {
          var file = files[i];

          var reader = new FileReader();
          // onload function used by the reader
          reader.onload = fileWrappedImportread( file );

          if ( $scope.uploadType === 'trustedCerts' ){
            $scope.showImportResults = true;
          }

          // when the file is read it triggers the onload event function above.
          reader.readAsText(file);
        }
      }
    };


    /****************************************/
    /**         Import Functions           **/
    /****************************************/




    


    /****************************************/
    /**         Delete Functions           **/
    /****************************************/

    $scope.confirmDelete = function(cert){
      Alerting.AlertReset();

      var deleteObject = {
        title: 'Delete Trusted Certificate',
        button: 'Delete',
        message: 'Are you sure you wish to delete the Trusted Certificate "' + cert.commonName + '"?'
      };

      var modalInstance = $modal.open({
        templateUrl: 'views/confirmModal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          confirmObject: function () {
            return deleteObject;
          }
        }
      });

      modalInstance.result.then(function () {

        var certToDelete = new Api.Keystore();
        certToDelete.$remove({ type: 'ca', property: cert._id }, deleteSuccess, deleteError);

      }, function () {
        // delete cancelled - do nothing
      });

    };

    var deleteSuccess = function () {
      // On success
      $scope.resetCertificates();
      Alerting.AlertAddMsg('trustedCertDelete', 'success', 'The Trusted Certificate has been deleted successfully');
    };

    var deleteError = function (err) {
      // add the error message
      Alerting.AlertAddMsg('trustedCertDelete', 'danger', 'An error has occurred while deleting the trusted certificate: #' + err.status + ' - ' + err.data);
    };

    /****************************************/
    /**         Delete Functions           **/
    /****************************************/


  });