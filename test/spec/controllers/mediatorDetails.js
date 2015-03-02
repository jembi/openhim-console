'use strict';
/* jshint expr: true */
/* global sinon: false */

describe('Controller: MediatorDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  // setup config constant to be used for API server details
  beforeEach(function(){
    module('openhimWebui2App', function($provide){
      $provide.constant('config', { 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });
    });
  });

  var scope, createController, httpBackend, modalSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $modal) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('.*/mediators/AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE')).respond({
        'urn': 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE',
        'version': '0.0.1',
        'name': 'Test 1 Mediator',
        'description': 'Test 1 Description',
        'defaultChannelConfig': [
          {
            'name': 'Mediator Channel 1',
            'urlPattern': '/channel1',
            'routes': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }],
            'allow': [ 'xdlab' ],
            'type': 'http'
          }
        ],
        'endpoints': [{ 'name': 'Route 1', 'host': 'localhost', 'port': '1111', 'primary': true, 'type': 'http' }]
      });

    modalSpy = sinon.spy($modal, 'open');

    createController = function() {
      scope = $rootScope.$new();
      return $controller('MediatorDetailsCtrl', { $scope: scope, $routeParams: { urn: 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE' } });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a single meditor to the scope', function () {
    createController();
    httpBackend.flush();
    scope.mediatorDetails.urn.should.equal('AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE');
    scope.mediatorDetails.version.should.equal('0.0.1');
    scope.mediatorDetails.name.should.equal('Test 1 Mediator');
    scope.mediatorDetails.description.should.equal('Test 1 Description');
    scope.mediatorDetails.endpoints[0].name.should.equal('Route 1');
    scope.mediatorDetails.endpoints[0].host.should.equal('localhost');
    scope.mediatorDetails.endpoints[0].port.should.equal('1111');
    scope.mediatorDetails.endpoints[0].primary.should.equal(true);
    scope.mediatorDetails.endpoints[0].type.should.equal('http');
  });

});