'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: AboutCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimConsoleApp'));

  // setup config constant to be used for API server details
  beforeEach(function() {
    module('openhimConsoleApp', function($provide){
      $provide.constant('config', { 'version': '1.7.0', 'minimumCoreVersion':'3.0.0', 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });
    });
  });

  var scope, createController, httpBackend, modalSpy;
  
  var coreResponse = {
    'currentCoreVersion': '3.0.0'
  };
  
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {

    httpBackend = $httpBackend;
    
    $httpBackend.when('GET', new RegExp('.*/about')).respond(coreResponse);

    modalSpy = sinon.spy($modal, 'open');

    createController = function() {
      scope = $rootScope.$new();
      return $controller('AboutCtrl', { $scope: scope });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach about information to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/about'));
    createController();
    httpBackend.flush();
    
    scope.aboutInfo.currentConsoleVersion.should.equal('1.7.0');
    scope.aboutInfo.currentCoreVersion.should.equal('3.0.0');
    
    scope.aboutInfo.minimumCoreVersion.should.equal('3.0.0');
    scope.aboutInfo.maximumCoreVersion.should.equal('4.0.0');
  });

  
});
