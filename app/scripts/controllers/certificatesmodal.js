'use strict';
angular.module('openhimConsoleApp')
  .controller('CertificatesModalCtrl', function ($rootScope, $scope, $modalInstance, $timeout, Api, Notify, Alerting) {

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

      // clientID validation
      if( !$scope.cert.name ){
        $scope.ngError.name = true;
        $scope.ngError.hasErrors = true;
      }
    };

    $scope.submitFormCertificate = function () {
      $scope.validateFormCertificates();
      // save the client object if no errors are present
      if ( $scope.ngError.hasErrors === false ){
        $scope.save($scope.cert);
      }
    };

    $scope.certificateObject = new Api.Certificates();

    $scope.save = function (cert) {
      $scope.certificateObject = cert;
    };
  });
