'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: CertificatesModalCtrl', function () {
  // load the controller's module
  beforeEach(module('openhimConsoleApp'));

  // setup config constant to be used for API server details
  beforeEach(function(){
    module('openhimConsoleApp', function($provide){
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });
    });
  });

  var scope, createController, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {

    httpBackend = $httpBackend;

    $httpBackend.when('POST', new RegExp('.*/certificates')).respond(
      {
        certificate: '---BEGIN CERTIFICATE ---',
        key: '---BEGIN KEY ---'
      }
    );

    scope = $rootScope.$new();
    var modalInstance = sinon.spy();

    createController = function () {
      var cert;
      cert = {
        $save: sinon.spy(),
        $update: sinon.spy()
      };
      return $controller('CertificatesModalCtrl', {
        $scope: scope,
        $modalInstance: modalInstance,
        cert: cert
      });
    };
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should create a new certificate if this is not an update', function () {
    createController();
    scope.cert.should.be.ok;
  });

  it('should run validateFormCertificates() for any validation errors - ngErrors.hasErrors -> TRUE', function () {
    createController();
    scope.cert.commonName = '';
    scope.cert.days = '';
    // run the validate
    scope.validateFormCertificates();
    scope.ngError.should.have.property('commonName', true);
    scope.ngError.should.have.property('days', true);
  });

  it('should run validateFormCertificates() for any validation errors when the form is submitted - ngErrors.hasErrors -> TRUE', function () {
    createController();
    scope.cert.commonName = 'testCommonName';
    scope.cert.days = '';
    // run the
    scope.submitFormCertificate();
    scope.ngError.should.have.property('days', true);
  });

  it('should generate the download links', function () {
    createController();
    scope.cert.commonName = 'testCommonName';
    scope.cert.days = '365';
    // submit the form
    scope.submitFormCertificate();
    //Generate the file Names
    scope.keyName.should.equal( 'testCommonName.key.pem' );
    scope.certName.should.equal( 'testCommonName.cert.crt' );
    httpBackend.flush();
  });

});
