'use strict';
angular.module('openhimConsoleApp')
  .controller('CertificatesModalCtrl', function ($rootScope, $scope, $modalInstance, $timeout, Api, Notify, Alerting) {

    var success = function () {
      // add the success message
      Alerting.AlertAddMsg('top', 'success', 'The client has been saved successfully');
      notifyUser();

    };

    var error = function (err) {
      // add the success message
      Alerting.AlertAddMsg('top', 'danger', 'An error has occurred while saving the clients\' details: #' + err.status + ' - ' + err.data);
      notifyUser();
    };

    var notifyUser = function(){
      // reset backing object and refresh clients list
      Notify.notify('clientsChanged');
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.validateFormCertificates = function () {
      // reset hasErrors alert object
      Alerting.AlertReset('hasErrors');

      // clear timeout if it has been set
      $timeout.cancel( $scope.clearValidation );

      $scope.ngError = {};
      $scope.ngError.hasErrors = false;

      // certificate validity validation
      if( !$scope.cert.days){
        $scope.ngError.days = true;
        $scope.ngError.hasErrors = true;
      }
    };

    $scope.submitFormCertificate = function () {
      $scope.validateFormCertificates();
      console.log($scope.cert);
      // save the client object if no errors are present
      if ( $scope.ngError.hasErrors === false ){
        $scope.save($scope.cert);
      }
    };

    $scope.cert = new Api.Certificates();

    $scope.save = function (cert) {
      saveCert(cert);
    };

    var saveCert = function (cert) {
      // set backup client object to check if cert has changed
      $scope.certBackup = angular.copy(cert);
      if ($scope.update) {
        cert.$update(success, error);
      } else {
        cert.$save({ clientId: '' }, success, error);
      }
    };
  });
